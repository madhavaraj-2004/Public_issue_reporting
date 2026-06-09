import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ComplaintCard from '../components/ComplaintCard.jsx';
import FilterBar from '../components/FilterBar.jsx';
import Notification from '../components/Notification.jsx';
import SectionTitle from '../components/SectionTitle.jsx';

const categories = [
  'Road Damage',
  'Garbage Issues',
  'Water Leakage',
  'Street Light Problems',
  'Drainage Problems',
  'Transport Problems',
];

const statuses = ['Pending', 'Under Review', 'In Progress', 'Resolved', 'Closed'];

export default function MyComplaints() {
  const [list, setList] = useState([]);
  const [filters, setFilters] = useState({ q: '', category: '', status: '', startDate: '', endDate: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const loadComplaints = async (query = '') => {
    try {
      const response = await API.get(`/complaints/me${query}`);
      setList(response.data || []);
    } catch (error) {
      setMessageType('error');
      setMessage('Unable to load complaints right now.');
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const onChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const onSearch = async () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const query = params.toString() ? `?${params.toString()}` : '';
    await loadComplaints(query);
  };

  const onReset = async () => {
    setFilters({ q: '', category: '', status: '', startDate: '', endDate: '' });
    await loadComplaints();
  };

  return (
    <div className="container page-shell">
      <Notification type={messageType} message={message} onClose={() => setMessage('')} />
      <SectionTitle
        eyebrow="My Complaints"
        title="Review and manage your reports"
        description="Use the filters to search by complaint text, location, category, status, or date."
      />
      <FilterBar
        filters={filters}
        onChange={onChange}
        onSearch={onSearch}
        onReset={onReset}
        categories={categories}
        statuses={statuses}
      />
      <div className="complaint-grid">
        {list.map((complaint) => (
          <ComplaintCard complaint={complaint} key={complaint._id} />
        ))}
        {!list.length ? <div className="empty-state">No complaints found. Try adjusting your filters or submit a new complaint.</div> : null}
      </div>
    </div>
  );
}
