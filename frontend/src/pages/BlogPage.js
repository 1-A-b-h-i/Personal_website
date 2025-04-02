import React from 'react';
import Navbar from '../components/Navbar';
import BlogList from '../components/Blog/BlogList';

function BlogPage() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <BlogList />
        <div className="back-link-container">
          <a href="/" className="back-button">Back to Home</a>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
