const TOKEN_KEY = 'token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || 'Ocurrió un error inesperado.');
    error.status = res.status;
    throw error;
  }
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: () => request('/auth/me'),
  listTasks: (filters = {}) => {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v !== '' && v != null),
    );
    const qs = params.toString();
    return request(`/tasks${qs ? `?${qs}` : ''}`);
  },
  createTask: (task) => request('/tasks', { method: 'POST', body: task }),
  updateTask: (id, changes) => request(`/tasks/${id}`, { method: 'PATCH', body: changes }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};
