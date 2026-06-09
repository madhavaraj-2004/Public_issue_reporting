import React from 'react';

export default function Timeline({ items = [] }) {
  if (!items.length) {
    return <div className="empty-state">No timeline entries yet.</div>;
  }

  return (
    <div className="timeline">
      {items.map((item, index) => (
        <div key={`${item.status}-${index}`} className="timeline-item">
          <div className="timeline-dot" />
          <div className="timeline-content">
            <strong>{item.status}</strong>
            <span>{item.note || 'Update recorded'}</span>
            <small>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
