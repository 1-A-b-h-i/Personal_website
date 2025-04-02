import React from 'react';
import Navbar from '../components/Navbar';
import AIChat from '../components/AIAssistant/AIChat';

function AIAssistantPage() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <h2 className="section-title">AI Assistant</h2>
        <p className="page-description">
          Chat with my AI assistant to learn more about me, my skills, projects, and experiences.
          This AI is trained on my personal data and can answer questions about my professional life.
        </p>
        <AIChat />
        <div className="back-link-container">
          <a href="/" className="back-button">Back to Home</a>
        </div>
      </div>
    </div>
  );
}

export default AIAssistantPage;
