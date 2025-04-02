import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BlogList from '../components/Blog/BlogList';

function BlogPage() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <BlogList />
        <div className="back-link-container">
          <Link to="/" className="back-button">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
