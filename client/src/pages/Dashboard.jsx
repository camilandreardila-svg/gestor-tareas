import { useState } from 'react';
import Header from '../components/Header.jsx';
import FilterBar from '../components/FilterBar.jsx';
import TaskBoard from '../components/TaskBoard.jsx';
import TaskForm from '../components/TaskForm.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../hooks/useTasks.js';
import { useDebounce } from '../hooks/useDebounce.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const q = useDebounce(search);

  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks({ q, status, priority });

  const [editing, setEditing] = useState(null); // {} = tarea nueva
  const [toDelete, setToDelete] = useState(null);
  const [actionError, setActionError] = useState('');

  const run = async (fn) => {
    try {
      setActionError('');
      await fn();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleSave = async (data) => {
    if (editing?.id) await updateTask(editing.id, data);
    else await createTask(data);
    setEditing(null);
  };

  const pending = tasks.filter((t) => t.status !== 'completada').length;
  const firstName = user.name.split(' ')[0];

  return (
    <div className="app">
      <Header />
      <main className="container">
        <div className="top-row">
          <div>
            <h1>Bienvenido/a, {firstName}</h1>
            <p className="muted">{loading ? 'Cargando...' : `Tareas sin terminar: ${pending}`}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setEditing({})}>+ Agregar tarea</button>
        </div>

        <FilterBar
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
          priority={priority}
          onPriority={setPriority}
          onClear={() => {
            setSearch('');
            setStatus('');
            setPriority('');
          }}
        />

        {(error || actionError) && <p className="banner-error" role="alert">{error || actionError}</p>}

        {!loading && tasks.length === 0 && (search || status || priority) && (
          <p className="no-results">No se encontraron tareas con esos filtros.</p>
        )}

        <TaskBoard
          tasks={tasks}
          statusFilter={status}
          onToggleComplete={(t) =>
            run(() => updateTask(t.id, { status: t.status === 'completada' ? 'pendiente' : 'completada' }))
          }
          onChangeStatus={(t, s) => run(() => updateTask(t.id, { status: s }))}
          onEdit={(t) => setEditing(t)}
          onDelete={(t) => setToDelete(t)}
        />
      </main>

      {editing && (
        <Modal title={editing.id ? 'Editar tarea' : 'Nueva tarea'} onClose={() => setEditing(null)}>
          <TaskForm initial={editing} onSubmit={handleSave} onCancel={() => setEditing(null)} />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Eliminar tarea"
          message={`¿Seguro que quieres eliminar "${toDelete.title}"? Esta acción no se puede deshacer.`}
          onCancel={() => setToDelete(null)}
          onConfirm={() =>
            run(async () => {
              await deleteTask(toDelete.id);
              setToDelete(null);
            })
          }
        />
      )}
    </div>
  );
}
