import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Notification from '../components/Notification.jsx';
import MapPreview from '../components/MapPreview.jsx';
import SectionTitle from '../components/SectionTitle.jsx';

const categories = [
  'Road Damage',
  'Garbage Issues',
  'Water Leakage',
  'Street Light Problems',
  'Drainage Problems',
  'Transport Problems',
];

export default function CreateComplaint() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Road Damage');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('Low');
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const nextPreviews = images.map((file) => URL.createObjectURL(file));
    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [images]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('description', description);
      form.append('category', category);
      form.append('location', location);
      form.append('priority', priority);
      images.forEach((file) => form.append('images', file));
      await API.post('/complaints', form);
      setMessageType('success');
      setMessage('Complaint submitted successfully.');
      setTimeout(() => {
        window.location = '/my-complaints';
      }, 700);
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Error submitting complaint.');
    }
  };

  return (
    <div className="container page-shell">
      <Notification type={messageType} message={message} onClose={() => setMessage('')} />
      <SectionTitle
        eyebrow="Create Complaint"
        title="Report the issue with clear details"
        description="Upload multiple images, choose a priority, and preview the map location before you submit."
      />
      <div className="form-layout">
        <form className="glass-card form-panel" onSubmit={submit}>
          <div className="form-grid">
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Complaint title" />
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
            <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location details" />
          </div>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the issue in detail" rows="6" />
          <label className="upload-box">
            <span>Upload complaint images</span>
            <input type="file" multiple accept="image/*" onChange={(event) => setImages(Array.from(event.target.files || []))} />
          </label>
          {previews.length ? (
            <div className="image-preview-grid">
              {previews.map((src) => (
                <img key={src} src={src} alt="Preview" className="preview-image" />
              ))}
            </div>
          ) : null}
          <div className="form-actions">
            <button className="btn-primary" type="submit">
              Submit complaint
            </button>
          </div>
        </form>
        <div className="glass-card side-panel">
          <SectionTitle eyebrow="Location Preview" title="See where the issue is" description="A map preview helps with better complaint routing." />
          <MapPreview location={location} />
        </div>
      </div>
    </div>
  );
}
