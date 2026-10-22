-- Esquema de base de datos PostgreSQL para Plataforma de Juegos

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255), -- NULL para usuarios que inician con Google o Microsoft
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'student',
    auth_provider VARCHAR(50) DEFAULT 'local', -- 'local', 'google', 'microsoft'
    provider_id VARCHAR(255),                  -- ID devuelto por Google o Microsoft
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

-- Índices para optimizar búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON game_progress(user_id);
