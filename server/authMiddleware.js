import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado: No se proporcionó token de sesión.' });
  }

  const secret = process.env.JWT_SECRET || 'super_secreto_cambiar_en_produccion_12345!';

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado. Inicia sesión nuevamente.' });
    }
    req.user = decoded;
    next();
  });
}
