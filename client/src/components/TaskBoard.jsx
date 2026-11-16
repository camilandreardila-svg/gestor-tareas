import TaskCard from './TaskCard.jsx';
import { STATUS, STATUS_ORDER } from '../utils/format.js';

export default function TaskBoard({ tasks, statusFilter, ...handlers }) {
  const columns = statusFilter ? [statusFilter] : STATUS_ORDER;

  return (
    <div className={`board cols-${columns.length}`}>
      {columns.map((status) => {
        const items = tasks.filter((t) => t.status === status);
        return (
          <section key={status} className={`column col-${status}`}>
            <h2 className="column-title">
              {STATUS[status].label} <span>({items.length})</span>
            </h2>
            {items.length === 0 ? (
              <p className="empty">No hay tareas</p>
            ) : (
              items.map((task) => <TaskCard key={task.id} task={task} {...handlers} />)
            )}
          </section>
        );
      })}
    </div>
  );
}
