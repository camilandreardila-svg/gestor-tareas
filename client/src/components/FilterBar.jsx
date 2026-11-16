import { PRIORITY, STATUS, STATUS_ORDER } from '../utils/format.js';

export default function FilterBar({ search, onSearch, status, onStatus, priority, onPriority, sortBy, onSort, onClear }) {
  const active = search || status || priority;
  return (
    <div className="filters" role="search">
      <div className="search">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar tarea..."
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
      <select value={sortBy} onChange={(e) => onSort(e.target.value)} aria-label="Ordenar por">
        <option value="fecha">Ordenar: fecha de vencimiento</option>
        <option value="prioridad">Ordenar: prioridad</option>
        <option value="recientes">Ordenar: más recientes</option>
        <option value="titulo">Ordenar: título (A-Z)</option>
      </select>
      {active && (
        <button className="link-btn" onClick={onClear}>Quitar filtros</button>
      )}
    </div>
  );
}
