import { PRIORITY, STATUS, STATUS_ORDER, dueState, formatDate } from '../utils/format.js';

export default function TaskCard({ task, onToggleComplete, onChangeStatus, onEdit, onDelete }) {
  const done = task.status === 'completada';
  const due = dueState(task);

  return (
    <div className={`task ${done ? 'done' : ''}`}>
      <div className="task-head">
        <label className="task-check">
          <input
            type="checkbox"
            checked={done}
            onChange={() => onToggleComplete(task)}
            title={done ? 'Marcar como pendiente' : 'Marcar como completada'}
          />
          <span className="task-title">{task.title}</span>
        </label>
        <span className={`badge badge-${task.priority}`}>{PRIORITY[task.priority].label}</span>
      </div>

      {task.description && <p className="task-desc">{task.description}</p>}

      <p className={`task-date ${due || ''}`}>
        📅 {formatDate(task.due_date)}
        {due === 'vencida' && ' (vencida)'}
        {due === 'hoy' && ' (hoy)'}
      </p>
      {done && task.completed_at && (
        <p className="task-date">
          ✔ Completada el {new Date(task.completed_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
        </p>
      )}

      <div className="task-footer">
        <select value={task.status} onChange={(e) => onChangeStatus(task, e.target.value)} aria-label="Estado">
          {STATUS_ORDER.map((k) => (
            <option key={k} value={k}>{STATUS[k].label}</option>
          ))}
        </select>
        <div>
          <button className="link-btn" onClick={() => onEdit(task)}>Editar</button>
          <button className="link-btn red" onClick={() => onDelete(task)}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
