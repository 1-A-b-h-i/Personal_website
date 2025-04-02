import React, { useState } from 'react';
import { FaGithub, FaExternalLinkAlt, FaClock, FaCode } from 'react-icons/fa';

function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`project-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="project-image-container">
        <img src={project.image} alt={project.title} className="project-image" />
        
        {project.isActive && (
          <div className="project-status">
            <span className="status-indicator"></span>
            Active Development
          </div>
        )}
        
        <div className="project-category">{project.category}</div>
      </div>
      
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        
        <p className="project-description">{project.description}</p>
        
        <div className="project-readme">
          <h4>From the README:</h4>
          <p>{project.readmeSnippet}</p>
        </div>
        
        <div className="project-meta">
          <div className="project-updated">
            <FaClock /> Last updated: {project.lastUpdated}
          </div>
        </div>
        
        <div className="project-tech-stack">
          <FaCode /> 
          {project.techStack.map((tech, index) => (
            <span key={index} className="tech-badge">
              {tech}
            </span>
          ))}
        </div>
        
        <div className="project-links">
          <a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            <FaGithub /> GitHub Repo
          </a>
          
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="live-link"
            >
              <FaExternalLinkAlt /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard; 