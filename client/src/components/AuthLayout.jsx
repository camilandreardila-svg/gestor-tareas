export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <div className="auth-box">
        <div className="auth-logo">
          <img src="/favicon.svg" alt="" width="40" height="40" />
          <span>Mis Tareas</span>
        </div>
        <div className="auth-card">
          <h2>{title}</h2>
          <p className="muted">{subtitle}</p>
          {children}
        </div>
        <p className="auth-footer">{footer}</p>
      </div>
    </div>
  );
}
