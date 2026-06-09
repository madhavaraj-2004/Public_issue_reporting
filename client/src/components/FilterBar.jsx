import React from 'react';

export default function FilterBar({ filters, onChange, onSearch, onReset, categories = [], statuses = [] }) {
  return (
    <div className="filter-bar glass-card">
      <input
        value={filters.q || ''}
        onChange={(event) => onChange('q', event.target.value)}
        placeholder="Search complaints or locations"
      />
      <select value={filters.category || ''} onChange={(event) => onChange('category', event.target.value)}>
        <option value="">All categories</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <select value={filters.status || ''} onChange={(event) => onChange('status', event.target.value)}>
        <option value="">All statuses</option>
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <input type="date" value={filters.startDate || ''} onChange={(event) => onChange('startDate', event.target.value)} />
      <input type="date" value={filters.endDate || ''} onChange={(event) => onChange('endDate', event.target.value)} />
      <div className="filter-actions">
        <button type="button" className="btn-primary" onClick={onSearch}>
          Apply
        </button>
        <button type="button" className="btn-secondary" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
