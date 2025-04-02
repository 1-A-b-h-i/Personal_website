import React from 'react';
import Navbar from '../components/Navbar';
import WorkExperience from '../components/WorkExperience/WorkExperience';

function WorkExperiencePage() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <WorkExperience />
        <div className="back-link-container">
          <a href="/" className="back-button">Back to Home</a>
        </div>
      </div>
    </div>
  );
}

export default WorkExperiencePage;
