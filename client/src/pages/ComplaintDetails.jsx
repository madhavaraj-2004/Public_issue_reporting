import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import Notification from '../components/Notification.jsx';
import Timeline from '../components/Timeline.jsx';
import MapPreview from '../components/MapPreview.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

const categories = [
  'Road Damage',
  'Garbage Issues',
  'Water Leakage',
  'Street Light Problems',
  'Drainage Problems',
  'Transport Problems',
];

const priorities = ['Low', 'Medium', 'High', 'Critical'];

export default function ComplaintDetails() {
  const { id } = useParams();
  const [c, setC] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '', category: '', location: '', priority: '' });
  const [editImages, setEditImages] = useState([]);
  const { user } = useContext(AuthContext);

  const canEdit = useMemo(() => {
    if (!c || !user) return false;
    return user.role === 'admin' || String(c.userId?._id) === String(user.id || user._id);
  }, [c, user]);

  const loadComplaint = async () => {
    try {
      const response = await API.get(`/complaints/${id}`);
      setC(response.data);
      setEditForm({
        title: response.data.title || '',
        description: response.data.description || '',
        category: response.data.category || categories[0],
        location: response.data.location || '',
        priority: response.data.priority || 'Low',
      });
    } catch (error) {
      setMessageType('error');
      setMessage('Failed to load complaint details.');
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const submitComment = async (event) => {
    event.preventDefault();
    try {
      const response = await API.post(`/complaints/${id}/comments`, { message: comment });
      setC(response.data);
      setComment('');
      setMessageType('success');
      setMessage('Comment added successfully.');
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Unable to add comment.');
    }
  };

  const submitEdit = async (event) => {
    event.preventDefault();
    try {
      const form = new FormData();
      form.append('title', editForm.title);
      form.append('description', editForm.description);
      form.append('category', editForm.category);
      form.append('location', editForm.location);
      form.append('priority', editForm.priority);
      editImages.forEach((file) => form.append('images', file));
      const response = await API.put(`/complaints/${id}`, form);
      setC(response.data);
      setIsEditing(false);
      setEditImages([]);
      setMessageType('success');
      setMessage('Complaint updated successfully.');
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Unable to update complaint.');
    }
  };

  const deleteComplaint = async () => {
    if (!window.confirm('Delete this complaint?')) return;
    try {
      await API.delete(`/complaints/${id}`);
      window.location = '/my-complaints';
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Unable to delete complaint.');
    }
  };

  if (!c) return <div className="container">Loading...</div>;

  return (
    <div className="container page-shell">
      <Notification type={messageType} message={message} onClose={() => setMessage('')} />
      <SectionTitle
        eyebrow="Complaint Details"
        title={c.title}
        description="Track the timeline, add comments, and preview the complaint location."
      />

      <div className="details-layout">
        <section className="glass-card detail-panel">
          <div className="detail-badges">
            <span className={`status-chip status-${String(c.status || 'pending').toLowerCase().replace(/\s+/g, '-')}`}>{c.status}</span>
            <span className={`priority priority-${String(c.priority || 'low').toLowerCase()}`}>{c.priority}</span>
          </div>
          <p className="detail-description">{c.description}</p>
          <div className="detail-meta-grid">
            <div>
              <span>Category</span>
              <strong>{c.category}</strong>
            </div>
            <div>
              <span>Location</span>
              <strong>{c.location || 'No location added'}</strong>
            </div>
            <div>
              <span>Reported by</span>
              <strong>{c.userId?.name || 'Anonymous'}</strong>
            </div>
            <div>
              <span>Priority</span>
              <strong>{c.priority}</strong>
            </div>
          </div>

          {c.images?.length || c.image ? (
            <div className="image-preview-grid detail-images">
              {(c.images?.length ? c.images : [c.image]).map((image) => (
                <img key={image} src={`${apiBase}/uploads/${image}`} alt="Complaint" className="preview-image" />
              ))}
            </div>
          ) : null}

          <div className="detail-actions">
            {canEdit ? <button className="btn-primary" type="button" onClick={() => setIsEditing((current) => !current)}>{isEditing ? 'Close editor' : 'Edit complaint'}</button> : null}
            {canEdit ? <button className="btn-secondary" type="button" onClick={deleteComplaint}>Delete complaint</button> : null}
          </div>

          {isEditing ? (
            <form className="inline-form" onSubmit={submitEdit}>
              <div className="form-grid">
                <input value={editForm.title} onChange={(event) => setEditForm({ ...editForm, title: event.target.value })} />
                <select value={editForm.category} onChange={(event) => setEditForm({ ...editForm, category: event.target.value })}>
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <select value={editForm.priority} onChange={(event) => setEditForm({ ...editForm, priority: event.target.value })}>
                  {priorities.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <input value={editForm.location} onChange={(event) => setEditForm({ ...editForm, location: event.target.value })} />
              </div>
              <textarea value={editForm.description} onChange={(event) => setEditForm({ ...editForm, description: event.target.value })} rows="5" />
              <input type="file" multiple accept="image/*" onChange={(event) => setEditImages(Array.from(event.target.files || []))} />
              <button className="btn-primary" type="submit">Save changes</button>
            </form>
          ) : null}
        </section>

        <aside className="detail-sidebar">
          <div className="glass-card panel-block">
            <SectionTitle eyebrow="Map Preview" title="Location on map" description="The map preview helps identify the reported area quickly." />
            <MapPreview location={c.location} />
          </div>

          <div className="glass-card panel-block">
            <SectionTitle eyebrow="Complaint Timeline" title="Activity history" description="See when the complaint was created, updated, and commented on." />
            <Timeline items={c.timeline || []} />
          </div>

          <div className="glass-card panel-block">
            <SectionTitle eyebrow="Comments" title="Discussion thread" description="Add useful information for the admin team." />
            <form className="comment-form" onSubmit={submitComment}>
              <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write a comment" rows="4" />
              <button className="btn-primary" type="submit">Post comment</button>
            </form>
            <div className="comment-list">
              {(c.comments || []).map((item, index) => (
                <div className="comment-item" key={`${item.createdAt || index}`}>
                  <strong>{item.userName || item.userId?.name || 'User'}</strong>
                  <p>{item.message}</p>
                  <small>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</small>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
