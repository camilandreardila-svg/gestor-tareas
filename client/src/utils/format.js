export const STATUS = {
  pendiente: { label: 'Pendiente' },
  en_progreso: { label: 'En progreso' },
  completada: { label: 'Completada' },
};
export const STATUS_ORDER = ['pendiente', 'en_progreso', 'completada'];

export const PRIORITY = {
  alta: { label: 'Alta' },
  media: { label: 'Media' },
  baja: { label: 'Baja' },
};

export function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function formatDate(iso) {
  if (!iso) return 'Sin fecha';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function dueState(task) {
  if (!task.due_date || task.status === 'completada') return null;
  const today = todayISO();
  if (task.due_date < today) return 'vencida';
  if (task.due_date === today) return 'hoy';
  return null;
}
