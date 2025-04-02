import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProjectList from '../components/Projects/ProjectList';

function ProjectsPage() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <ProjectList />
        <div className="back-link-container">
          <Link to="/" className="back-button">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage; 