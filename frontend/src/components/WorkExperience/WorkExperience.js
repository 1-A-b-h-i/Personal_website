import React, { useState, useEffect } from 'react';

function WorkExperience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/experience');
        if (!response.ok) {
          throw new Error('Failed to fetch experience data');
        }
        const data = await response.json();
        setExperiences(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching experiences:', err);
        setError('Failed to load work experience data. Please try again later.');
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return <div className="loading">Loading work experience...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="work-experience-container">
      <h2 className="section-title">Work Experience</h2>
      <div className="experience-timeline">
        {experiences.map((experience) => (
          <div className="experience-card" key={experience.id}>
            <div className="experience-header">
              <h3 className="experience-title">{experience.title}</h3>
              <span className="experience-period">{experience.period}</span>
            </div>
            <h4 className="experience-company">
              {experience.company} • {experience.location}
            </h4>
            <p className="experience-description">{experience.description}</p>
            <div className="experience-technologies">
              {experience.technologies.map((tech, index) => (
                <span className="technology-tag" key={index}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkExperience;
