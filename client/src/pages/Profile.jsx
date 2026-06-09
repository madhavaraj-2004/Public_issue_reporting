import React, { useContext, useEffect, useState } from 'react';
import API from '../services/api';
import Notification from '../components/Notification.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user, login } = useContext(AuthContext);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      const form = new FormData();
      form.append('name', profileForm.name);
      form.append('email', profileForm.email);
      if (profileImage) form.append('profileImage', profileImage);
      const response = await API.put('/auth/profile', form);
      login(localStorage.getItem('token'), response.data.user);
      setMessageType('success');
      setMessage('Profile updated successfully.');
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Unable to update profile.');
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    try {
      await API.put('/auth/password', passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setMessageType('success');
      setMessage('Password changed successfully.');
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Unable to change password.');
    }
  };

  return (
    <div className="container page-shell">
      <Notification type={messageType} message={message} onClose={() => setMessage('')} />
      <SectionTitle eyebrow="Profile" title="Manage your account" description="Update your profile details, profile image, and password." />
      <div className="profile-grid">
        <form className="glass-card form-panel" onSubmit={saveProfile}>
          <SectionTitle eyebrow="Update Profile" title="Edit your details" description="Keep your public account details current." />
          <input value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} placeholder="Name" />
          <input value={profileForm.email} onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })} placeholder="Email" />
          <label className="upload-box">
            <span>Profile image</span>
            <input type="file" accept="image/*" onChange={(event) => setProfileImage(event.target.files?.[0] || null)} />
          </label>
          <button className="btn-primary" type="submit">Save profile</button>
        </form>

        <form className="glass-card form-panel" onSubmit={changePassword}>
          <SectionTitle eyebrow="Security" title="Change password" description="Keep your account secure with a fresh password." />
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })}
            placeholder="Current password"
          />
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })}
            placeholder="New password"
          />
          <button className="btn-secondary" type="submit">Update password</button>
        </form>
      </div>
    </div>
  );
}
