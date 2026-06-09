import React from 'react';

export default function MapPreview({ location }) {
  if (!location) {
    return <div className="map-preview empty">Add a location to see a map preview.</div>;
  }

  const src = `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;

  return (
    <div className="map-preview">
      <iframe title="Complaint location preview" src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
