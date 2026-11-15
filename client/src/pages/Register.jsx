import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// Pantalla de registro de nuevos usuarios.
export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    if (form.password !== form.confirm) return setError('Las contraseñas no coinciden.');
    setBusy(true);
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Completa los datos para registrarte."
      footer={<>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></>}
    >
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Nombre completo</span>
          <input value={form.name} onChange={set('name')} required autoComplete="name" />
        </label>
        <label className="field">
          <span>Correo electrónico</span>
          <input type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
        </label>
        <div className="field-row two">
          <label className="field">
            <span>Contraseña</span>
            <input type="password" value={form.password} onChange={set('password')} required autoComplete="new-password" />
          </label>
          <label className="field">
            <span>Confirmar contraseña</span>
            <input type="password" value={form.confirm} onChange={set('confirm')} required autoComplete="new-password" />
          </label>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>
    </AuthLayout>
  );
}
