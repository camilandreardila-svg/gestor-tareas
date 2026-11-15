import { PRIORITY, STATUS, STATUS_ORDER } from '../utils/format.js';

export default function FilterBar({ search, onSearch, status, onStatus, priority, onPriority, onClear }) {
  const active = search || status || priority;
  return (
    <div className="filters" role="search">
      <div className="search">
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar por título o descripción…"
          aria-label="Buscar tareas"
        />
      </div>
      <select value={status} onChange={(e) => onStatus(e.target.value)} aria-label="Filtrar por estado">
        <option value="">Todos los estados</option>
        {STATUS_ORDER.map((k) => (
          <option key={k} value={k}>{STATUS[k].label}</option>
        ))}
      </select>
      <select value={priority} onChange={(e) => onPriority(e.target.value)} aria-label="Filtrar por prioridad">
        <option value="">Todas las prioridades</option>
        {Object.entries(PRIORITY).map(([k, { label }]) => (
          <option key={k} value={k}>{label}</option>
        ))}
      </select>
      {active && (
        <button className="btn btn-ghost btn-sm" onClick={onClear}>Limpiar filtros</button>
      )}
    </div>
  );
}
