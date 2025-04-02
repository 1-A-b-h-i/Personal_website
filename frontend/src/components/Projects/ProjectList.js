import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { FaSearch } from 'react-icons/fa';

function ProjectList() {
  // Sample project data (in a real app, this would come from an API)
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Personal Portfolio Website",
      description: "A full-stack personal portfolio website with a React frontend and Flask backend.",
      readmeSnippet: "Modern UI with responsive design, portfolio sections, interactive components, contact form, and AI chat assistant integration.",
      image: "https://via.placeholder.com/600x400?text=Portfolio+Website",
      githubUrl: "https://github.com/1-A-b-h-i/Personal_website",
      liveUrl: "https://1-A-b-h-i.github.io/Personal_website",
      techStack: ["React", "Flask", "Python", "JavaScript"],
      category: "Web Development",
      isActive: true,
      lastUpdated: "2023-04-01"
    },
    {
      id: 2,
      title: "AI Image Generator",
      description: "An AI-powered image generation tool that creates unique images from text descriptions.",
      readmeSnippet: "Uses deep learning models to generate images from natural language prompts. Features custom styling options and export capabilities.",
      image: "https://via.placeholder.com/600x400?text=AI+Image+Generator",
      githubUrl: "https://github.com/1-A-b-h-i/ai-image-generator",
      liveUrl: "https://ai-image-gen.example.com",
      techStack: ["Python", "TensorFlow", "React", "Flask"],
      category: "AI",
      isActive: true,
      lastUpdated: "2023-03-15"
    },
    {
      id: 3,
      title: "Weather App",
      description: "A real-time weather application with location detection and forecasting.",
      readmeSnippet: "Features current conditions, 5-day forecast, and historical weather data. Supports location search and favorites.",
      image: "https://via.placeholder.com/600x400?text=Weather+App",
      githubUrl: "https://github.com/1-A-b-h-i/weather-app",
      liveUrl: "https://weather.example.com",
      techStack: ["JavaScript", "React", "OpenWeather API", "CSS"],
      category: "Web Development",
      isActive: false,
      lastUpdated: "2023-02-20"
    },
    {
      id: 4,
      title: "E-commerce Platform",
      description: "A full-featured e-commerce platform with product management, cart, and checkout.",
      readmeSnippet: "Includes user authentication, product catalog, shopping cart, payment processing, and order management.",
      image: "https://via.placeholder.com/600x400?text=E-commerce+Platform",
      githubUrl: "https://github.com/1-A-b-h-i/ecommerce-platform",
      liveUrl: null,
      techStack: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
      category: "Web Development",
      isActive: true,
      lastUpdated: "2023-01-10"
    },
    {
      id: 5,
      title: "Task Management CLI",
      description: "A command-line tool for managing tasks and projects efficiently.",
      readmeSnippet: "Organize tasks, set priorities, track deadlines, and generate progress reports all from your terminal.",
      image: "https://via.placeholder.com/600x400?text=Task+CLI",
      githubUrl: "https://github.com/1-A-b-h-i/task-cli",
      liveUrl: null,
      techStack: ["Python", "Click", "SQLite"],
      category: "Tools",
      isActive: false,
      lastUpdated: "2022-11-05"
    },
    {
      id: 6,
      title: "Machine Learning Exercise Tracker",
      description: "A fitness application that uses ML to track and correct exercise form.",
      readmeSnippet: "Uses computer vision to analyze exercise form and provide real-time feedback for improved results and injury prevention.",
      image: "https://via.placeholder.com/600x400?text=ML+Exercise+Tracker",
      githubUrl: "https://github.com/1-A-b-h-i/ml-exercise-tracker",
      liveUrl: "https://exercise-tracker.example.com",
      techStack: ["Python", "TensorFlow", "OpenCV", "React Native"],
      category: "AI",
      isActive: true,
      lastUpdated: "2023-03-30"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get unique categories for filters
  const categories = ['All', ...new Set(projects.map(project => project.category))];
  
  // Filter projects based on selected category and search term
  const filteredProjects = projects
    .filter(project => activeFilter === 'All' || project.category === activeFilter)
    .filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="projects-container">
      <h2 className="section-title">My Projects</h2>
      
      <div className="projects-header">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <button className="filter-toggle" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            Filter
            <span className={`filter-arrow ${isFilterOpen ? 'open' : ''}`}>▾</span>
          </button>
          
          <div className={`filter-dropdown ${isFilterOpen ? 'open' : ''}`}>
            {categories.map(category => (
              <button 
                key={category}
                className={`filter-button ${activeFilter === category ? 'active' : ''}`}
                onClick={() => {
                  setActiveFilter(category);
                  setIsFilterOpen(false);
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="projects-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="no-projects">
            <p>No projects found. Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectList;