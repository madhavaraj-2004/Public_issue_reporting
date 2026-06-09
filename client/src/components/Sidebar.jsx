import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar(){
  return (
    <aside className="sidebar glass-card">
      <div className="sidebar-title">Menu</div>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/create">Create Complaint</Link>
        <Link to="/my-complaints">My Complaints</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </aside>
  );
}
