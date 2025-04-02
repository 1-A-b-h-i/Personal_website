import React from 'react';
import Navbar from '../components/Navbar';
import ProjectList from '../components/Projects/ProjectList';

function ProjectsPage() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <ProjectList />
        <div className="back-link-container">
          <a href="/" className="back-button">Back to Home</a>
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage; 