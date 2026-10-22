import pkg from 'pg';
const { Pool } = pkg;
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isPostgres = false;
let sqliteDb = null;

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
      max: 10,
      connectionTimeoutMillis: 3000,
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
    isPostgres = true;
    console.log('✅ Tablas de PostgreSQL verificadas/creadas correctamente.');
  } catch (err) {
    console.log('ℹ️ PostgreSQL no se encuentra activo localmente.');
    console.log('💡 Activando modo de desarrollo local automático con base de datos SQLite (server/database.sqlite)...');
    
    // Iniciar fallback con SQLite local
    await initSqliteFallback();
  }
}

function initSqliteFallback() {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, 'database.sqlite');
    sqliteDb = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error al inicializar SQLite:', err);
        return reject(err);
      }

      sqliteDb.serialize(() => {
        sqliteDb.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE,
            password_hash TEXT,
            full_name TEXT,
            role TEXT DEFAULT 'student',
            auth_provider TEXT DEFAULT 'local',
            provider_id TEXT,
            avatar_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);

        sqliteDb.run(`
          CREATE TABLE IF NOT EXISTS game_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            game_key TEXT NOT NULL,
            difficulty INTEGER DEFAULT 1,
            highest_level INTEGER DEFAULT 0,
            completed INTEGER DEFAULT 0,
            certificate_name TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, game_key, difficulty)
          );
        `, (tableErr) => {
          if (tableErr) return reject(tableErr);
          isPostgres = false;
          console.log('✅ Base de datos local SQLite lista para registrar usuarios y guardar progreso.');
          resolve();
        });
      });
    });
  });
}

// Interfaz unificada de consulta (funciona tanto para PostgreSQL como SQLite)
export function dbQuery(sql, params = []) {
  if (isPostgres) {
    return pool.query(sql, params);
  }

  // SQLite Fallback
  return new Promise((resolve, reject) => {
    if (!sqliteDb) {
      return reject(new Error('La base de datos aún no está inicializada.'));
    }

    // Reemplazar sintaxis $1, $2 de PostgreSQL por ? para SQLite
    let sqliteSql = sql.replace(/\$\d+/g, '?');

    // Adaptar GREATEST para SQLite
    sqliteSql = sqliteSql.replace(/GREATEST\(([^,]+),\s*([^)]+)\)/gi, 'MAX($1, $2)');

    // Adaptar BOOLEAN a INTEGER
    sqliteDb.all(sqliteSql, params, (err, rows) => {
      if (err) return reject(err);
      resolve({ rows: rows || [] });
    });
  });
}
