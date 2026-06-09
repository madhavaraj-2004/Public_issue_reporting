import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Notification from '../components/Notification.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      window.location = res.data.user.role === 'admin' ? '/admin' : '/dashboard';
    } catch (err) {
      setMessageType('error');
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container auth-shell">
      <Notification type={messageType} message={message} onClose={() => setMessage('')} />
      <div className="auth-card glass-card">
        <SectionTitle eyebrow="Welcome back" title="Login to your account" description="Use your email and password to continue." />
        <form className="auth-form" onSubmit={submit}>
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" />
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
          <button className="btn-primary" type="submit">Login</button>
        </form>
        <p className="auth-footer-text">
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
