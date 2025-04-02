import React from 'react';
import Navbar from '../components/Navbar';
import Achievements from '../components/Achievements/Achievements';
import './PageCommon.css';

function AchievementsPage() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <Achievements />
        <div className="back-link-container">
          <a href="/" className="back-button">Back to Home</a>
        </div>
      </div>
    </div>
  );
}

export default AchievementsPage;
