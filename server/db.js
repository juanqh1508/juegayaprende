import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'plataforma_juegos',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

export const pool = new Pool(poolConfig);

// Inicializar tablas automáticamente al arrancar
export async function initDb() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL establecida con éxito.');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        full_name VARCHAR(100),
        role VARCHAR(20) DEFAULT 'student',
        auth_provider VARCHAR(50) DEFAULT 'local',
        provider_id VARCHAR(255),
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Modificaciones para admitir autenticación de Google/Hotmail/OAuth
      ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'local';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

      CREATE TABLE IF NOT EXISTS game_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        game_key VARCHAR(50) NOT NULL,
        difficulty INT NOT NULL DEFAULT 1,
        highest_level INT NOT NULL DEFAULT 0,
        completed BOOLEAN DEFAULT FALSE,
        certificate_name VARCHAR(100),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, game_key, difficulty)
      );

      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    client.release();
    console.log('✅ Tablas de PostgreSQL verificadas/creadas correctamente.');
  } catch (err) {
    console.error('⚠️ Advertencia: No se pudo conectar a PostgreSQL en este momento.');
    console.error(`   Detalle del error: ${err.message}`);
    console.error('   👉 Asegúrate de que el servicio PostgreSQL esté activo y los datos en server/.env sean correctos.');
  }
}
