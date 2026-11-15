import { useState } from 'react';
import { PRIORITY, STATUS, STATUS_ORDER } from '../utils/format.js';

const EMPTY = { title: '', description: '', due_date: '', priority: 'media', status: 'pendiente' };

// se usa para crear y para editar
export default function TaskForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => ({ ...EMPTY, ...initial, due_date: initial?.due_date || '' }));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.title.trim()) {
      setError('El título es obligatorio.');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        title: values.title,
        description: values.description,
        due_date: values.due_date || null,
        priority: values.priority,
        status: values.status,
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span>Título *</span>
        <input value={values.title} onChange={set('title')} maxLength={150} autoFocus placeholder="Ej. Enviar informe semanal" />
      </label>
      <label className="field">
        <span>Descripción</span>
        <textarea value={values.description} onChange={set('description')} rows={4} placeholder="Detalles, pasos o notas" />
      </label>
      <div className="field-row">
        <label className="field">
          <span>Fecha de vencimiento</span>
          <input type="date" value={values.due_date} onChange={set('due_date')} />
        </label>
        <label className="field">
          <span>Prioridad</span>
          <select value={values.priority} onChange={set('priority')}>
            {Object.entries(PRIORITY).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Estado</span>
          <select value={values.status} onChange={set('status')}>
            {STATUS_ORDER.map((key) => (
              <option key={key} value={key}>{STATUS[key].label}</option>
            ))}
          </select>
        </label>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Guardando…' : initial?.id ? 'Guardar cambios' : 'Crear tarea'}
        </button>
      </div>
    </form>
  );
}
