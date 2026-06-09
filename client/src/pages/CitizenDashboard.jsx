import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import StatCard from '../components/StatCard.jsx';
import ComplaintCard from '../components/ComplaintCard.jsx';

export default function CitizenDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, progress: 0, recentActivities: [] });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await API.get('/complaints/stats/me');
        setStats(response.data);
      } catch (error) {
        setStats({ total: 0, pending: 0, resolved: 0, progress: 0, recentActivities: [] });
      }
    };

    loadStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-hero glass-card">
          <div>
            <span className="hero-badge">Citizen Dashboard</span>
            <h1>Stay on top of every complaint you submit.</h1>
            <p>Quick actions, progress overview, and the latest activity in one clean view.</p>
          </div>
          <div className="quick-actions">
            <Link to="/create" className="btn-primary">
              New Complaint
            </Link>
            <Link to="/my-complaints" className="btn-secondary">
              View All Complaints
            </Link>
          </div>
        </div>

        <div className="stats-grid dashboard-stats">
          <StatCard label="Total Complaints" value={stats.total} hint="All submitted reports" tone="blue" />
          <StatCard label="Pending Complaints" value={stats.pending} hint="Waiting for action" tone="amber" />
          <StatCard label="Resolved Complaints" value={stats.resolved} hint="Closed issues" tone="green" />
          <StatCard label="Progress" value={`${stats.progress}%`} hint="Resolution progress" tone="purple" />
        </div>

        <div className="dashboard-grid">
          <section className="glass-card dashboard-panel">
            <SectionTitle eyebrow="Recent Activities" title="Latest complaint updates" description="Track what changed most recently." />
            <div className="activity-list">
              {(stats.recentActivities || []).map((item) => (
                <ComplaintCard complaint={item} compact key={item._id} />
              ))}
              {!stats.recentActivities?.length ? <div className="empty-state">Your latest updates will appear here.</div> : null}
            </div>
          </section>

          <section className="glass-card dashboard-panel">
            <SectionTitle eyebrow="Quick Actions" title="Get to work faster" description="Shortcuts for common citizen tasks." />
            <div className="quick-grid">
              <Link to="/create" className="quick-action-card">
                Report issue
              </Link>
              <Link to="/my-complaints" className="quick-action-card">
                Search complaints
              </Link>
              <Link to="/profile" className="quick-action-card">
                Update profile
              </Link>
              <Link to="/about" className="quick-action-card">
                Learn how it works
              </Link>
            </div>

            <div className="progress-block">
              <div className="progress-head">
                <strong>Resolution progress</strong>
                <span>{stats.progress || 0}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${stats.progress || 0}%` }} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
