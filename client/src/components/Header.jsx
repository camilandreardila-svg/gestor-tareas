import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="header">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">✓</span>
        <span className="brand-name">Mis Tareas</span>
      </div>
      <div className="header-user">
        <span className="avatar" aria-hidden="true">{initials}</span>
        <span className="header-name">{user.name}</span>
        <button className="btn btn-ghost btn-sm" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
