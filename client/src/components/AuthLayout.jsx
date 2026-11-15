export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <aside className="auth-aside">
        <div className="brand brand-light">
          <span className="brand-mark" aria-hidden="true">✓</span>
          <span className="brand-name">Mis Tareas</span>
        </div>
        <div className="auth-pitch">
          <h1>Gestor de tareas</h1>
          <p>Organiza tus tareas diarias por estado y prioridad.</p>
        </div>
        <ul className="auth-points">
          <li>Crear, editar y eliminar tareas</li>
          <li>Buscar y filtrar</li>
          <li>Marcar como completadas</li>
        </ul>
      </aside>
      <main className="auth-main">
        <div className="auth-card">
          <h2>{title}</h2>
          <p className="muted">{subtitle}</p>
          {children}
          <p className="auth-footer">{footer}</p>
        </div>
      </main>
    </div>
  );
}
