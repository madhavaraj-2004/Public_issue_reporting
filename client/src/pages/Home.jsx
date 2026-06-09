import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import SectionTitle from '../components/SectionTitle.jsx';
import StatCard from '../components/StatCard.jsx';
import ComplaintCard from '../components/ComplaintCard.jsx';

const categories = [
  'Road Damage',
  'Garbage Issues',
  'Water Leakage',
  'Street Light Problems',
  'Drainage Problems',
  'Transport Problems',
];

const featureCards = [
  {
    title: 'Fast Reporting',
    text: 'Capture the issue, location, and photos in a clean guided flow.',
  },
  {
    title: 'Live Tracking',
    text: 'Follow every status change with clear timeline updates and alerts.',
  },
  {
    title: 'Smarter Operations',
    text: 'Admins can filter, prioritize, and respond with fewer clicks.',
  },
];

const howItWorks = [
  'Create a complaint with images and location details.',
  'Track the complaint through its timeline and comments.',
  'Receive status updates until the issue is resolved.',
];

export default function Home() {
  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    const loadRecentComplaints = async () => {
      try {
        const response = await API.get('/complaints/recent');
        setRecentComplaints(response.data || []);
      } catch (error) {
        setRecentComplaints([]);
      }
    };

    loadRecentComplaints();
  }, []);

  return (
    <main className="page-shell">
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-badge">Public Issue Reporting System</span>
            <h1>Report Public Issues Faster and Smarter</h1>
            <p>
              A modern citizen-to-admin workflow for reporting potholes, garbage, water leaks, streetlight failures, and more.
            </p>
            <div className="hero-actions">
              <Link to="/create" className="btn-primary btn-large">
                Report Issue
              </Link>
              <Link to="/my-complaints" className="btn-secondary btn-large">
                Track Complaint
              </Link>
            </div>
            <div className="hero-stats">
              <StatCard label="Categories" value="6" hint="City issue types" tone="blue" />
              <StatCard label="Statuses" value="5" hint="Full lifecycle tracking" tone="green" />
              <StatCard label="Priority" value="4" hint="Low to Critical" tone="amber" />
            </div>
          </div>

          <div className="hero-panel glass-card">
            <div className="panel-head">
              <span>Recent report preview</span>
              <span className="pill pill-live">Live</span>
            </div>
            {recentComplaints.slice(0, 2).map((complaint) => (
              <ComplaintCard complaint={complaint} compact key={complaint._id} />
            ))}
            {!recentComplaints.length ? <div className="empty-state">No reports yet. Be the first to report an issue.</div> : null}
          </div>
        </div>
      </section>

      <section className="section-block container">
        <SectionTitle
          eyebrow="Statistics"
          title="Overview at a glance"
          description="A cleaner, modern landing page that highlights the key benefits and reporting flow."
        />
        <div className="stats-grid">
          <StatCard label="Average Response" value="24h" hint="Workflow target" tone="blue" />
          <StatCard label="Public Categories" value="6" hint="Core complaint types" tone="green" />
          <StatCard label="Resolution Rate" value="91%" hint="Recent city performance" tone="amber" />
          <StatCard label="Active Users" value="12k+" hint="Citizen community" tone="purple" />
        </div>
      </section>

      <section className="section-block container">
        <SectionTitle eyebrow="Categories" title="Report the right issue" description="Clean cards for the most common public service problems." />
        <div className="category-grid">
          {categories.map((category) => (
            <div key={category} className="category-card glass-card">
              <span>{category}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block container two-column">
        <div>
          <SectionTitle eyebrow="How It Works" title="Simple for citizens" description="The flow stays easy on mobile and desktop." />
          <div className="step-list">
            {howItWorks.map((item, index) => (
              <div key={item} className="step-item glass-card">
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle eyebrow="Features" title="Built for daily usage" description="Reusable components, glass cards, and responsive spacing." />
          <div className="feature-grid">
            {featureCards.map((item) => (
              <div key={item.title} className="feature-card glass-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block container">
        <SectionTitle eyebrow="Recent Complaints" title="Latest public reports" description="A preview of the freshest complaints in the system." />
        <div className="recent-grid">
          {recentComplaints.slice(0, 4).map((complaint) => (
            <ComplaintCard complaint={complaint} key={complaint._id} />
          ))}
          {!recentComplaints.length ? <div className="empty-state">Recent complaints will appear here after citizens start reporting.</div> : null}
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <strong>Public Issue Reporting</strong>
            <p>Fast reporting, better visibility, and a cleaner city workflow.</p>
          </div>
          <div className="footer-links">
            <Link to="/create">Report Issue</Link>
            <Link to="/my-complaints">Track Complaint</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
