import { PRIORITY, STATUS, STATUS_ORDER, dueState, formatDate } from '../utils/format.js';

export default function TaskCard({ task, onToggleComplete, onChangeStatus, onEdit, onDelete }) {
  const done = task.status === 'completada';
  const due = dueState(task);

  return (
    <article className={`card priority-${task.priority} ${done ? 'is-done' : ''}`}>
      <div className="card-top">
        <button
          className={`check ${done ? 'checked' : ''}`}
          onClick={() => onToggleComplete(task)}
          aria-label={done ? 'Marcar como pendiente' : 'Marcar como completada'}
          title={done ? 'Marcar como pendiente' : 'Marcar como completada'}
        >
          {done ? '✓' : ''}
        </button>
        <h3 className="card-title">{task.title}</h3>
      </div>

      {task.description && <p className="card-desc">{task.description}</p>}

      <div className="card-meta">
        <span className={`chip chip-${task.priority}`}>Prioridad {PRIORITY[task.priority].label.toLowerCase()}</span>
        <span className={`due ${due ? `due-${due}` : ''}`}>
          {due === 'vencida' ? 'Vencida · ' : due === 'hoy' ? 'Vence hoy · ' : ''}
          {formatDate(task.due_date)}
        </span>
      </div>

      <div className="card-actions">
        <select
          value={task.status}
          onChange={(e) => onChangeStatus(task, e.target.value)}
          aria-label="Cambiar estado"
          className="select-sm"
        >
          {STATUS_ORDER.map((k) => (
            <option key={k} value={k}>{STATUS[k].label}</option>
          ))}
        </select>
        <div className="card-buttons">
          <button className="btn btn-ghost btn-sm" onClick={() => onEdit(task)}>Editar</button>
          <button className="btn btn-danger-ghost btn-sm" onClick={() => onDelete(task)}>Eliminar</button>
        </div>
      </div>
    </article>
  );
}
