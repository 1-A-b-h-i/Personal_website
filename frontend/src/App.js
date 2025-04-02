import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import WorkExperiencePage from './pages/WorkExperiencePage';
import AchievementsPage from './pages/AchievementsPage';
import BlogPage from './pages/BlogPage';
import AIAssistantPage from './pages/AIAssistantPage';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';

function App() {
  const [textIndex, setTextIndex] = useState(0);
  const welcomeTexts = [
    "Welcome to my digital space.",
    "I create, I build, I innovate.",
    "Let's bring ideas to life."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % welcomeTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage welcomeTexts={welcomeTexts} textIndex={textIndex} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/experience" element={<WorkExperiencePage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/chat" element={<AIAssistantPage />} />
      </Routes>
    </Router>
  );
}

export default App;
