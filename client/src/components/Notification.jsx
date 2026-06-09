import React from 'react';

export default function Notification({ type = 'success', message, onClose }) {
  if (!message) return null;

  return (
    <div className={`notification notification-${type}`}>
      <span>{message}</span>
      {onClose ? (
        <button type="button" className="notification-close" onClick={onClose}>
          ×
        </button>
      ) : null}
    </div>
  );
}
