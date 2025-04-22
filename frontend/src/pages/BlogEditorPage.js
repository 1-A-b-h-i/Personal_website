import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BlogEditor from '../components/Blog/BlogEditor';
import { isAuthenticated } from '../services/authService';

function BlogEditorPage() {
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/blog');
    }
  }, [navigate]);
  
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <BlogEditor />
        <div className="back-link-container">
          <Link to="/blog" className="back-button">Cancel and Return to Blog</Link>
        </div>
      </div>
    </div>
  );
}

export default BlogEditorPage; 