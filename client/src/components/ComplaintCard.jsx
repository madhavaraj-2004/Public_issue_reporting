import React from 'react';
import { Link } from 'react-router-dom';

const priorityClass = (priority) => `priority priority-${String(priority || 'low').toLowerCase()}`;

export default function ComplaintCard({ complaint, compact = false }){
  return (
    <article className={`complaint-card glass-card ${compact ? 'complaint-card-compact' : ''}`}>
      <div className="card-topline">
        <span className={priorityClass(complaint.priority)}>{complaint.priority || 'Low'}</span>
        <span className={`status-chip status-${String(complaint.status || 'pending').toLowerCase().replace(/\s+/g, '-')}`}>{complaint.status}</span>
      </div>
      <h4>{complaint.title}</h4>
      <p>{complaint.description}</p>
      <div className="card-meta">
        <span>{complaint.category}</span>
        <span>{complaint.location || 'Location not added'}</span>
      </div>
      <div className="card-footer">
        <Link to={`/complaint/${complaint._id}`}>View details</Link>
      </div>
    </article>
  );
}
