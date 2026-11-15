import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Falta la variable de entorno DATABASE_URL (cadena de conexión a PostgreSQL).');
  process.exit(1);
}

// en render la conexion externa pide ssl
const useSSL = process.env.DATABASE_SSL === 'true';

export const pool = new Pool({
  connectionString,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

export const query = (text, params) => pool.query(text, params);

export async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          VARCHAR(100) NOT NULL,
      email         VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id           SERIAL PRIMARY KEY,
      user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title        VARCHAR(150) NOT NULL,
      description  TEXT NOT NULL DEFAULT '',
      due_date     DATE,
      priority     VARCHAR(10) NOT NULL DEFAULT 'media'
                   CHECK (priority IN ('baja', 'media', 'alta')),
      status       VARCHAR(15) NOT NULL DEFAULT 'pendiente'
                   CHECK (status IN ('pendiente', 'en_progreso', 'completada')),
      completed_at TIMESTAMPTZ,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
  `);
}
