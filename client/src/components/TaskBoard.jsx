import TaskCard from './TaskCard.jsx';
import { STATUS, STATUS_ORDER } from '../utils/format.js';

export default function TaskBoard({ tasks, statusFilter, ...handlers }) {
  const columns = statusFilter ? [statusFilter] : STATUS_ORDER;

  return (
    <div className={`board cols-${columns.length}`}>
      {columns.map((status) => {
        const items = tasks.filter((t) => t.status === status);
        return (
          <section key={status} className={`column column-${status}`} aria-label={STATUS[status].label}>
            <header className="column-head">
              <h2>{STATUS[status].label}</h2>
              <span className="count">{items.length}</span>
            </header>
            <div className="column-body">
              {items.length === 0 ? (
                <p className="empty">Sin tareas aquí.</p>
              ) : (
                items.map((task) => <TaskCard key={task.id} task={task} {...handlers} />)
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
