import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import WorkExperiencePage from './pages/WorkExperiencePage';
import AchievementsPage from './pages/AchievementsPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import BlogEditorPage from './pages/BlogEditorPage';
import BlogAdminPage from './pages/BlogAdminPage';
import LoginPage from './pages/LoginPage';
import AIAssistantPage from './pages/AIAssistantPage';
import ProjectsPage from './pages/ProjectsPage';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import ClipboardPage from './pages/ClipboardPage';
import ProductivityPage from './pages/ProductivityPage';

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
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/blog/new" element={<BlogEditorPage />} />
        <Route path="/blog/edit/:postId" element={<BlogEditorPage />} />
        <Route path="/blog/admin" element={<BlogAdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/chat" element={<AIAssistantPage />} />
        <Route path="/clipboard" element={<ClipboardPage />} />
        <Route path="/productivity" element={<ProductivityPage />} />
        <Route path="/workspace" element={<ProductivityPage />} />
        <Route path="*" element={<HomePage welcomeTexts={welcomeTexts} textIndex={textIndex} />} />
      </Routes>
    </Router>
  );
}

export default App;
