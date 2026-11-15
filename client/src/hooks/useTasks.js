import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client.js';

export function useTasks(filters) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { q, status, priority } = filters;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { tasks } = await api.listTasks({ q, status, priority });
      setTasks(tasks);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [q, status, priority]);

  useEffect(() => {
    load();
  }, [load]);

  const createTask = async (data) => {
    await api.createTask(data);
    await load();
  };

  const updateTask = async (id, changes) => {
    const { task } = await api.updateTask(id, changes);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    await load();
  };

  const deleteTask = async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, error, createTask, updateTask, deleteTask, reload: load };
}
