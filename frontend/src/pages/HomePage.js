import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';


function HomePage({ welcomeTexts, textIndex }) {
  const navigate = useNavigate();

  const navigateToContact = () => {
    navigate('/contact');
  };

  const navigateToExperience = () => {
    navigate('/experience');
  };

  return (
    <div className="welcome-container">
      <Navbar />
      <div className="content-wrapper">
        <div className="animated-background"></div>
        
        <div className="welcome-content">
          <h1 className="welcome-title">Hello, I'm <span className="highlight">Abhinav</span></h1>
          <div className="typing-container">
            <p className="welcome-text">{welcomeTexts[textIndex]}</p>
          </div>
          <div className="buttons-container">
            <button className="explore-button" onClick={navigateToExperience}>Explore My Work</button>
            <button className="contact-button" onClick={navigateToContact}>Get In Touch</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
