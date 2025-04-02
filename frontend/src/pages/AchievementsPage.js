import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Achievements from '../components/Achievements/Achievements';

function AchievementsPage() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <Achievements />
        <div className="back-link-container">
          <Link to="/" className="back-button">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default AchievementsPage;
