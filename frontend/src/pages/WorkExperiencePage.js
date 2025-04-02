import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import WorkExperience from '../components/WorkExperience/WorkExperience';

function WorkExperiencePage() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <WorkExperience />
        <div className="back-link-container">
          <Link to="/" className="back-button">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default WorkExperiencePage;
