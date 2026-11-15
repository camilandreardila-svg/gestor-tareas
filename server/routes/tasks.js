import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const PRIORITIES = ['baja', 'media', 'alta'];
const STATUSES = ['pendiente', 'en_progreso', 'completada'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const COLUMNS = `id, title, description, to_char(due_date, 'YYYY-MM-DD') AS due_date,
  priority, status, completed_at, created_at, updated_at`;

// partial = true cuando es PATCH (solo se validan los campos que llegan)
function validate(body, partial = false) {
  const data = {};
  if (!partial || body.title !== undefined) {
    const title = String(body.title ?? '').trim();
    if (!title) return { error: 'El título es obligatorio.' };
    if (title.length > 150) return { error: 'El título admite máximo 150 caracteres.' };
    data.title = title;
  }
  if (body.description !== undefined) data.description = String(body.description).trim();
  if (body.due_date !== undefined) {
    if (body.due_date && !DATE_RE.test(body.due_date)) return { error: 'Fecha de vencimiento inválida.' };
    data.due_date = body.due_date || null;
  }
  if (body.priority !== undefined) {
    if (!PRIORITIES.includes(body.priority)) return { error: 'Prioridad inválida.' };
    data.priority = body.priority;
  }
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) return { error: 'Estado inválido.' };
    data.status = body.status;
  }
  return { data };
}

// GET /api/tasks?q=&status=&priority=
router.get('/', async (req, res, next) => {
  try {
    const where = ['user_id = $1'];
    const params = [req.userId];
    const { q, status, priority } = req.query;

    if (q && String(q).trim()) {
      params.push(`%${String(q).trim()}%`);
      where.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`);
    }
    if (status && STATUSES.includes(status)) {
      params.push(status);
      where.push(`status = $${params.length}`);
    }
    if (priority && PRIORITIES.includes(priority)) {
      params.push(priority);
      where.push(`priority = $${params.length}`);
    }

    const { rows } = await query(
      `SELECT ${COLUMNS} FROM tasks WHERE ${where.join(' AND ')}
       ORDER BY due_date ASC NULLS LAST,
         CASE priority WHEN 'alta' THEN 1 WHEN 'media' THEN 2 ELSE 3 END,
         created_at DESC`,
      params,
    );
    res.json({ tasks: rows });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { data, error } = validate(req.body);
    if (error) return res.status(400).json({ error });
    const status = data.status || 'pendiente';
    const { rows } = await query(
      `INSERT INTO tasks (user_id, title, description, due_date, priority, status, completed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ${COLUMNS}`,
      [
        req.userId,
        data.title,
        data.description || '',
        data.due_date ?? null,
        data.priority || 'media',
        status,
        status === 'completada' ? new Date() : null,
      ],
    );
    res.status(201).json({ task: rows[0] });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { data, error } = validate(req.body, true);
    if (error) return res.status(400).json({ error });
    const fields = Object.keys(data);
    if (!fields.length) return res.status(400).json({ error: 'No hay cambios para guardar.' });

    const sets = fields.map((f, i) => `${f} = $${i + 3}`);
    if (data.status) {
      sets.push(
        data.status === 'completada'
          ? 'completed_at = COALESCE(completed_at, NOW())'
          : 'completed_at = NULL',
      );
    }
    sets.push('updated_at = NOW()');

    const { rows } = await query(
      `UPDATE tasks SET ${sets.join(', ')} WHERE id = $1 AND user_id = $2 RETURNING ${COLUMNS}`,
      [req.params.id, req.userId, ...fields.map((f) => data[f])],
    );
    if (!rows[0]) return res.status(404).json({ error: 'La tarea no existe.' });
    res.json({ task: rows[0] });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [
      req.params.id,
      req.userId,
    ]);
    if (!rowCount) return res.status(404).json({ error: 'La tarea no existe.' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
