import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { pool } from '../db.js';
import { authenticateToken } from '../authMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_cambiar_en_produccion_12345!';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Utilidad para generar token JWT
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' } // Válido por 7 días
  );
}

// 1. REGISTRO CON CUALQUIER CORREO ELECTRÓNICO
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Permitir registrarse con email directamente (o username)
    const emailToUse = email ? email.trim().toLowerCase() : null;
    let usernameToUse = username ? username.trim().toLowerCase() : null;

    if (!emailToUse && !usernameToUse) {
      return res.status(400).json({ error: 'Por favor ingresa tu correo electrónico o un nombre de usuario.' });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres.' });
    }

    // Si solo dieron correo, derivar el nombre de usuario
    if (!usernameToUse && emailToUse) {
      usernameToUse = emailToUse.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
      if (usernameToUse.length < 3) usernameToUse = 'user_' + Math.floor(1000 + Math.random() * 9000);
    }

    // Verificar si ya existe en PostgreSQL
    const existing = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR (email IS NOT NULL AND email = $2)',
      [usernameToUse, emailToUse]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Este correo o usuario ya está registrado. Por favor inicia sesión.' });
    }

    // Hashear contraseña con bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, full_name, auth_provider)
       VALUES ($1, $2, $3, $4, 'local')
       RETURNING id, username, email, full_name, role, created_at`,
      [usernameToUse, emailToUse, passwordHash, fullName ? fullName.trim() : null]
    );

    const newUser = result.rows[0];
    const token = generateToken(newUser);

    return res.status(201).json({
      message: '¡Cuenta creada exitosamente!',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.full_name,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error en /register:', error);
    return res.status(500).json({ error: 'Error interno en el servidor al registrar el usuario.' });
  }
});

// 2. INICIO DE SESIÓN CON CORREO O USUARIO
router.post('/login', async (req, res) => {
  try {
    const { username, email, identifier, password } = req.body;
    const loginIdentifier = (identifier || email || username || '').trim().toLowerCase();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ error: 'Por favor ingresa tu correo/usuario y tu contraseña.' });
    }

    // Buscar usuario por correo o nombre de usuario
    const result = await pool.query(
      'SELECT id, username, email, full_name, role, password_hash, auth_provider FROM users WHERE email = $1 OR username = $1',
      [loginIdentifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'No encontramos una cuenta con ese correo o usuario.' });
    }

    const user = result.rows[0];

    // Si el usuario se registró con Google/Microsoft y no tiene contraseña local
    if (!user.password_hash) {
      return res.status(400).json({
        error: `Esta cuenta fue creada con ${user.auth_provider === 'google' ? 'Google' : 'Microsoft'}. Por favor usa el botón correspondiente para ingresar.`
      });
    }

    // Validar hash de contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    const token = generateToken(user);

    return res.json({
      message: '¡Inicio de sesión exitoso!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en /login:', error);
    return res.status(500).json({ error: 'Error al conectar con la base de datos o servidor.' });
  }
});

// 3. INICIO DE SESIÓN CON GOOGLE (OAuth2)
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Credencial de Google no recibida.' });
    }

    let payload;
    try {
      if (process.env.GOOGLE_CLIENT_ID) {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        payload = ticket.getPayload();
      } else {
        // Fallback usando el endpoint oficial de verificación de Google
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (!verifyRes.ok) throw new Error('Token de Google no válido');
        payload = await verifyRes.json();
      }
    } catch (e) {
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      if (!verifyRes.ok) throw new Error('No se pudo verificar el token de Google');
      payload = await verifyRes.json();
    }

    const { sub: googleId, email, name, picture } = payload;
    if (!email) {
      return res.status(400).json({ error: 'No se obtuvo un correo de la cuenta de Google.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Buscar si ya existe el usuario
    let userQuery = await pool.query(
      'SELECT id, username, email, full_name, role, avatar_url FROM users WHERE email = $1 OR (auth_provider = $2 AND provider_id = $3)',
      [cleanEmail, 'google', googleId]
    );

    let user;
    if (userQuery.rows.length > 0) {
      user = userQuery.rows[0];
      await pool.query(
        'UPDATE users SET auth_provider = $1, provider_id = $2, avatar_url = COALESCE($3, avatar_url), full_name = COALESCE(full_name, $4), updated_at = CURRENT_TIMESTAMP WHERE id = $5',
        ['google', googleId, picture, name, user.id]
      );
    } else {
      let baseUsername = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
      if (baseUsername.length < 3) baseUsername = 'user_' + Math.floor(1000 + Math.random() * 9000);

      const checkUsername = await pool.query('SELECT id FROM users WHERE username = $1', [baseUsername]);
      if (checkUsername.rows.length > 0) {
        baseUsername = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;
      }

      const insertRes = await pool.query(
        `INSERT INTO users (username, email, full_name, auth_provider, provider_id, avatar_url)
         VALUES ($1, $2, $3, 'google', $4, $5)
         RETURNING id, username, email, full_name, role, avatar_url`,
        [baseUsername, cleanEmail, name || baseUsername, googleId, picture]
      );
      user = insertRes.rows[0];
    }

    const token = generateToken(user);
    return res.json({
      message: '¡Bienvenido con Google!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name || name,
        role: user.role,
        avatarUrl: picture || user.avatar_url
      }
    });
  } catch (error) {
    console.error('Error en /google:', error);
    return res.status(401).json({ error: 'No se pudo verificar la cuenta de Google: ' + error.message });
  }
});

// 4. INICIO DE SESIÓN CON MICROSOFT (HOTMAIL / OUTLOOK / LIVE)
router.post('/microsoft', async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: 'Token de Microsoft no recibido.' });
    }

    // Consultar el perfil del usuario mediante Microsoft Graph API
    const msRes = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!msRes.ok) {
      return res.status(401).json({ error: 'El token de Microsoft no es válido o ha expirado.' });
    }

    const msData = await msRes.json();
    const microsoftId = msData.id;
    const email = msData.mail || msData.userPrincipalName;
    const name = msData.displayName;

    if (!email) {
      return res.status(400).json({ error: 'La cuenta de Microsoft no proporcionó un correo electrónico.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    let userQuery = await pool.query(
      'SELECT id, username, email, full_name, role FROM users WHERE email = $1 OR (auth_provider = $2 AND provider_id = $3)',
      [cleanEmail, 'microsoft', microsoftId]
    );

    let user;
    if (userQuery.rows.length > 0) {
      user = userQuery.rows[0];
      await pool.query(
        'UPDATE users SET auth_provider = $1, provider_id = $2, full_name = COALESCE(full_name, $3), updated_at = CURRENT_TIMESTAMP WHERE id = $4',
        ['microsoft', microsoftId, name, user.id]
      );
    } else {
      let baseUsername = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
      if (baseUsername.length < 3) baseUsername = 'user_' + Math.floor(1000 + Math.random() * 9000);

      const checkUsername = await pool.query('SELECT id FROM users WHERE username = $1', [baseUsername]);
      if (checkUsername.rows.length > 0) {
        baseUsername = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;
      }

      const insertRes = await pool.query(
        `INSERT INTO users (username, email, full_name, auth_provider, provider_id)
         VALUES ($1, $2, $3, 'microsoft', $4)
         RETURNING id, username, email, full_name, role`,
        [baseUsername, cleanEmail, name || baseUsername, microsoftId]
      );
      user = insertRes.rows[0];
    }

    const token = generateToken(user);
    return res.json({
      message: '¡Bienvenido con Microsoft / Hotmail!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name || name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en /microsoft:', error);
    return res.status(500).json({ error: 'Error al iniciar sesión con Microsoft.' });
  }
});

// 5. OBTENER PERFIL DEL USUARIO AUTENTICADO
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, full_name, role, auth_provider, avatar_url, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const user = result.rows[0];
    return res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        authProvider: user.auth_provider,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Error en /me:', error);
    return res.status(500).json({ error: 'Error al obtener datos del usuario.' });
  }
});

// 6. GUARDAR PROGRESO / DIPLOMA DEL JUEGO
router.post('/progress', authenticateToken, async (req, res) => {
  try {
    const { gameKey, difficulty, level, completed, certificateName } = req.body;
    const userId = req.user.id;

    if (!gameKey) {
      return res.status(400).json({ error: 'Se requiere el identificador del juego.' });
    }

    const query = `
      INSERT INTO game_progress (user_id, game_key, difficulty, highest_level, completed, certificate_name, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, game_key, difficulty)
      DO UPDATE SET
        highest_level = GREATEST(game_progress.highest_level, EXCLUDED.highest_level),
        completed = game_progress.completed OR EXCLUDED.completed,
        certificate_name = COALESCE(EXCLUDED.certificate_name, game_progress.certificate_name),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const result = await pool.query(query, [
      userId,
      gameKey,
      difficulty || 1,
      level || 0,
      !!completed,
      certificateName || null
    ]);

    return res.json({ message: 'Progreso guardado correctamente.', progress: result.rows[0] });
  } catch (error) {
    console.error('Error al guardar progreso:', error);
    return res.status(500).json({ error: 'Error al guardar progreso en la base de datos.' });
  }
});

// 7. OBTENER PROGRESO DEL USUARIO
router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT game_key, difficulty, highest_level, completed, certificate_name, updated_at FROM game_progress WHERE user_id = $1',
      [userId]
    );

    return res.json({ progress: result.rows });
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    return res.status(500).json({ error: 'Error al consultar progreso.' });
  }
});

export default router;
