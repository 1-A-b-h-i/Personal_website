import React from 'react';
import './WorkExperience.css';

function WorkExperience() {
  const experiences = [
    {
      id: 1,
      title: "Software Engineer",
      company: "Tech Company",
      location: "City, Country",
      period: "Jan 2022 - Present",
      description: "Developed and maintained web applications using React.js and Node.js. Implemented new features and improved existing functionality. Collaborated with cross-functional teams to deliver high-quality software products.",
      technologies: ["React", "Node.js", "MongoDB", "AWS"]
    },
    {
      id: 2,
      title: "Junior Developer",
      company: "Startup Inc.",
      location: "City, Country",
      period: "May 2020 - Dec 2021",
      description: "Assisted in the development of web applications. Participated in code reviews and testing. Learned and implemented best practices in software development.",
      technologies: ["JavaScript", "HTML/CSS", "Git", "Agile"]
    },
    {
      id: 3,
      title: "Intern",
      company: "Tech Solutions",
      location: "City, Country",
      period: "Jan 2020 - Apr 2020",
      description: "Developed small features and bug fixes for existing applications. Participated in daily stand-ups and sprint planning.",
      technologies: ["Python", "Django", "PostgreSQL"]
    }
  ];

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
