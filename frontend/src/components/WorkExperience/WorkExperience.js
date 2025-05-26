import React, { useState, useEffect } from 'react';

function WorkExperience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real work experience data from website_data.json
  const staticExperiences = [
    {
      id: 1,
      title: "SDE Intern",
      company: "Wizcom Technologies",
      location: "India",
      period: "6th Dec 2024 – 6th Jan 2025",
      description: "Developed a full-stack Stock Alert App using React, Flask, MySQL, and Pandas to automate stock price monitoring, trigger alerts, and data analysis.",
      technologies: ["React", "Flask", "MySQL", "Pandas"]
    },
    {
      id: 2,
      title: "Research Intern",
      company: "IIT Hyderabad",
      location: "Hyderabad, India",
      period: "10th June – 10th Sept 2024",
      description: "Trained a YOLOv8 model for AOI Detection and analyzed driver attention spans using Gaze Parameters.",
      technologies: ["YOLOv8", "Gaze Parameters", "Python"]
    },
    {
      id: 3,
      title: "Technical Intern",
      company: "Tech Mahindra",
      location: "India",
      period: "22nd May – 30th June 2024",
      description: "Worked on SAP (ERP Model) – Data Archiving (SARA & SARI modules).",
      technologies: ["SAP", "Data Archiving", "ERP Model"]
    }
  ];

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setExperiences(staticExperiences);
      setLoading(false);
    }, 500);
  }, [staticExperiences]);

  if (loading) {
    return <div className="loading">Loading work experience...</div>;
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
