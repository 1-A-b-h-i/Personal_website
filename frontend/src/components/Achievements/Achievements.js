import React, { useState, useEffect } from 'react';

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/achievements');
        if (!response.ok) {
          throw new Error('Failed to fetch achievements data');
        }
        const data = await response.json();
        setAchievements(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError('Failed to load achievements data. Please try again later.');
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return <div className="loading">Loading achievements...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
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
