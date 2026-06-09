import React from 'react';
import SectionTitle from '../components/SectionTitle.jsx';

const workflow = [
  'Citizens create a complaint with images and location details.',
  'Admins review it, assign priority, and update the status timeline.',
  'Everyone can follow the complaint until it is resolved.',
];

export default function About() {
  return (
    <div className="container page-shell">
      <SectionTitle
        eyebrow="About"
        title="Built for public issue reporting"
        description="A simple MERN stack platform designed to make reporting city issues faster, clearer, and easier to maintain."
      />
      <div className="glass-card about-card">
        <p>
          The current architecture is preserved while the interface and complaint workflow have been modernized with reusable components,
          better spacing, improved responsiveness, and scalable complaint management features.
        </p>
        <ul className="about-list">
          {workflow.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
