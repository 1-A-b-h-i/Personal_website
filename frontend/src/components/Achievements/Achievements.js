import React, { useState, useEffect } from 'react';

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real achievements data from website_data.json
  const staticAchievements = [
    {
      id: 1,
      title: "Hackathon Winner",
      date: "2024",
      description: "Won ₹20,000 INR at a hackathon hosted by HCLTech.",
      link: null
    },
    {
      id: 2,
      title: "BCG Data Science Internship",
      date: "2023",
      description: "Completed the Data Science Virtual Experience Program by BCG Forage.",
      link: null
    },
    {
      id: 3,
      title: "IBM AI Engineering",
      date: "2024",
      description: "Pursuing IBM AI Engineering Professional Certificate.",
      link: null
    }
  ];

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setAchievements(staticAchievements);
      setLoading(false);
    }, 500);
  }, [staticAchievements]);

  if (loading) {
    return <div className="loading">Loading achievements...</div>;
  }

  return (
    <div className="achievements-container">
      <h2 className="section-title">Notable Achievements</h2>
      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div className="achievement-card" key={achievement.id}>
            <div className="achievement-icon">🏆</div>
            <h3 className="achievement-title">{achievement.title}</h3>
            <div className="achievement-details">
              <span className="achievement-date">{achievement.date}</span>
            </div>
            <p className="achievement-description">{achievement.description}</p>
            {achievement.link && (
              <a 
                href={achievement.link} 
                className="achievement-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                View More
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;
