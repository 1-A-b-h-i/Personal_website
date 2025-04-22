import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BlogDetail from '../components/Blog/BlogDetail';

function BlogDetailPage() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <BlogDetail />
        <div className="back-link-container">
          <Link to="/blog" className="back-button">Back to Blog</Link>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage; 