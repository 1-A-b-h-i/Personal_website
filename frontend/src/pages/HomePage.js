import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/HomePage.css';

function HomePage({ welcomeTexts, textIndex }) {
  const [keySequence, setKeySequence] = useState([]);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const navigate = useNavigate();

  const navigateToContact = () => {
    navigate('/contact');
  };

  const navigateToExperience = () => {
    navigate('/experience');
  };

  // Shorter secret code: up, down, up, down
  const secretCode = [38, 40, 38, 40];
  
  // Check for secret key combination
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Add the key code to our sequence
      const updatedSequence = [...keySequence, e.keyCode];
      
      // Only keep the last 4 keys
      if (updatedSequence.length > 4) {
        updatedSequence.shift();
      }
      
      setKeySequence(updatedSequence);
      
      // Check if sequence matches our secret code
      if (updatedSequence.join(',') === secretCode.join(',')) {
        // Secret code matched! Redirect to productivity page
        navigate('/productivity');
        setKeySequence([]);
      }
    };
    
    // Attempt to show easter egg if user previously tried to access productivity
    const hasAttempted = localStorage.getItem('attemptedProductivityAccess') === 'true';
    if (hasAttempted && !showEasterEgg) {
      setShowEasterEgg(true);
      
      // Clear the flag after 10 seconds
      setTimeout(() => {
        setShowEasterEgg(false);
        localStorage.removeItem('attemptedProductivityAccess');
      }, 10000);
    }
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [keySequence, navigate, showEasterEgg]);

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
          {showEasterEgg && (
            <div className="easter-egg-hint">
              <p>Psst... try pressing Up, Down, Up, Down to access hidden features.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
