import React, { useEffect, useState } from 'react';
import API from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import StatCard from '../components/StatCard.jsx';
import ComplaintCard from '../components/ComplaintCard.jsx';

const statusLabels = ['Pending', 'Under Review', 'In Progress', 'Resolved', 'Closed'];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState({ total: 0, userCount: 0, byStatus: [], byCategory: [], departmentSummary: [], latestReports: [] });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await API.get('/admin/analytics');
        setAnalytics(response.data);
      } catch (error) {
        setAnalytics({ total: 0, userCount: 0, byStatus: [], byCategory: [], departmentSummary: [], latestReports: [] });
      }
    };

    loadAnalytics();
  }, []);

  const statusMap = analytics.byStatus?.reduce((accumulator, item) => {
    accumulator[item._id] = item.count;
    return accumulator;
  }, {}) || {};

  const categoryMap = analytics.byCategory?.reduce((accumulator, item) => {
    accumulator[item._id] = item.count;
    return accumulator;
  }, {}) || {};

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-hero glass-card">
          <div>
            <span className="hero-badge">Admin Dashboard</span>
            <h1>Monitor trends, assign priority, and resolve issues faster.</h1>
            <p>Analytics, user counts, latest reports, and department summaries in one workspace.</p>
          </div>
        </div>

        <div className="stats-grid dashboard-stats">
          <StatCard label="Complaint Analytics" value={analytics.total} hint="Total complaints" tone="blue" />
          <StatCard label="User Counts" value={analytics.userCount} hint="Registered citizens" tone="green" />
          <StatCard label="Latest Reports" value={analytics.latestReports?.length || 0} hint="Newest submissions" tone="amber" />
          <StatCard label="Department Summary" value={analytics.departmentSummary?.length || 0} hint="Tracked categories" tone="purple" />
        </div>

        <div className="dashboard-grid admin-grid">
          <section className="glass-card dashboard-panel">
            <SectionTitle eyebrow="Complaint Analytics" title="Status distribution" description="A simple trend view built with lightweight CSS bars." />
            <div className="bar-chart">
              {statusLabels.map((label) => (
                <div key={label} className="bar-row">
                  <div className="bar-label">{label}</div>
                  <div className="bar-track">
                    <div className="bar-fill bar-fill-blue" style={{ width: `${Math.min((statusMap[label] || 0) * 12, 100)}%` }} />
                  </div>
                  <div className="bar-value">{statusMap[label] || 0}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card dashboard-panel">
            <SectionTitle eyebrow="Category Counts" title="Issue categories" description="How complaints are distributed by type." />
            <div className="mini-list">
              {(analytics.byCategory || []).map((item) => (
                <div key={item._id} className="mini-list-item">
                  <span>{item._id}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card dashboard-panel">
            <SectionTitle eyebrow="Latest Reports" title="Most recent submissions" description="Focus on what needs attention first." />
            <div className="activity-list">
              {(analytics.latestReports || []).map((item) => (
                <ComplaintCard complaint={item} compact key={item._id} />
              ))}
            </div>
          </section>

          <section className="glass-card dashboard-panel">
            <SectionTitle eyebrow="Department Summary" title="Operational view" description="Use the complaint categories as departments in the current data model." />
            <div className="mini-list">
              {(analytics.departmentSummary || []).map((item) => (
                <div key={item.department} className="mini-list-item">
                  <span>{item.department}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
