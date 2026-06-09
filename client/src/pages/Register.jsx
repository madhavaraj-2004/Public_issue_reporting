import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Notification from '../components/Notification.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Register() {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', { name, email, password });
      login(res.data.token, res.data.user);
      window.location = res.data.user.role === 'admin' ? '/admin' : '/dashboard';
    } catch (err) {
      setMessageType('error');
      setMessage(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="container auth-shell">
      <Notification type={messageType} message={message} onClose={() => setMessage('')} />
      <div className="auth-card glass-card">
        <SectionTitle eyebrow="Get started" title="Create your account" description="Join the platform and start reporting issues in seconds." />
        <form className="auth-form" onSubmit={submit}>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" />
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" />
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
          <button className="btn-primary" type="submit">Create account</button>
        </form>
        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
