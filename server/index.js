import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDb } from './db.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api', (_req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));

// build de react
const distDir = path.join(__dirname, '..', 'dist');
app.use(express.static(distDir));
// para que funcione react router al recargar
app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')));

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido.' });
  if (err.code === '22P02') return res.status(400).json({ error: 'Identificador inválido.' });
  res.status(500).json({ error: 'Error interno del servidor.' });
});

initDb()
  .then(() => app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('No se pudo inicializar la base de datos:', err);
    process.exit(1);
  });
