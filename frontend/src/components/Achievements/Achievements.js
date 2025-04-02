import React from 'react';

function Achievements() {
  const achievements = [
    {
      id: 1,
      title: "First Prize in National Hackathon",
      organization: "TechFest 2022",
      date: "November 2022",
      description: "Won first prize for developing an innovative solution for healthcare management using AI and blockchain technology."
    },
    {
      id: 2,
      title: "Published Research Paper",
      organization: "International Journal of Computer Science",
      date: "July 2021",
      description: "Published a research paper on 'Effective Machine Learning Approaches for Data Analysis in Healthcare'."
    },
    {
      id: 3,
      title: "Google Developer Certification",
      organization: "Google",
      date: "March 2021",
      description: "Obtained certification in Google Cloud Platform with specialization in machine learning and data engineering."
    },
    {
      id: 4,
      title: "Open Source Contribution Award",
      organization: "GitHub",
      date: "January 2020",
      description: "Recognized for significant contributions to open-source projects, particularly in the development of tools for web developers."
    }
  ];

  return (
    <div className="achievements-container">
      <h2 className="section-title">Notable Achievements</h2>
      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div className="achievement-card" key={achievement.id}>
            <div className="achievement-icon">🏆</div>
            <h3 className="achievement-title">{achievement.title}</h3>
            <div className="achievement-details">
              <span className="achievement-organization">{achievement.organization}</span>
              <span className="achievement-date">{achievement.date}</span>
            </div>
            <p className="achievement-description">{achievement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;
