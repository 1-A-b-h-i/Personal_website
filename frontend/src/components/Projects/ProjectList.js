import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import { FaSearch } from 'react-icons/fa';

function ProjectList() {
  // Real project data from website_data.json
  const [projects] = useState([
    {
      id: 1,
      title: "Personal Portfolio Website",
      description: "Personal portfolio website built with modern web technologies.",
      readmeSnippet: "Modern UI with responsive design, portfolio sections, interactive components, contact form, and AI chat assistant integration.",
      image: "https://via.placeholder.com/600x400?text=Portfolio+Website",
      githubUrl: "",
      liveUrl: "abhinavpaidisetti.me",
      techStack: ["Web Technologies"],
      category: "Web Development",
      isActive: true,
      lastUpdated: "2024-01-01"
    },
    {
      id: 2,
      title: "ML Prediction & Classification Models",
      description: "Developed various machine learning models for prediction and classification tasks, applying different algorithms and techniques to improve accuracy and performance.",
      readmeSnippet: "Implemented various classification algorithms with high accuracy for different prediction tasks.",
      image: "https://via.placeholder.com/600x400?text=ML+Models",
      githubUrl: "",
      liveUrl: null,
      techStack: ["Python", "Scikit-learn", "Pandas", "NumPy", "Machine Learning Algorithms"],
      category: "AI",
      isActive: true,
      lastUpdated: "2024-01-01"
    },
    {
      id: 3,
      title: "Computer Vision Applications",
      description: "Created deep learning applications for image detection and recognition using computer vision techniques and neural network architectures.",
      readmeSnippet: "Developed object detection and image recognition systems using advanced computer vision techniques.",
      image: "https://via.placeholder.com/600x400?text=Computer+Vision",
      githubUrl: "",
      liveUrl: null,
      techStack: ["TensorFlow", "PyTorch", "OpenCV", "CNN", "Deep Learning"],
      category: "AI",
      isActive: true,
      lastUpdated: "2024-01-01"
    },
    {
      id: 4,
      title: "LLM Exploration Projects",
      description: "Currently exploring Large Language Models, including fine-tuning, prompt engineering, and application development.",
      readmeSnippet: "Actively researching and implementing LLM-based solutions for various applications.",
      image: "https://via.placeholder.com/600x400?text=LLM+Projects",
      githubUrl: "",
      liveUrl: null,
      techStack: ["Transformers", "LLMs", "NLP", "Python"],
      category: "AI",
      isActive: true,
      lastUpdated: "2024-01-01"
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