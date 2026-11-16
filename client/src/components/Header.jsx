import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <img src="/favicon.svg" alt="" width="28" height="28" />
          <span>Mis Tareas</span>
        </div>
        <div className="header-user">
          <span className="header-name">{user.name}</span>
          <button className="btn btn-outline-light btn-sm" onClick={logout}>
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
