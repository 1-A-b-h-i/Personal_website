import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function BlogList() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        
        // Add some additional fields if they're not in the API data
        const enhancedData = data.map(post => ({
          ...post,
          category: post.category || "Web Development",
          image: post.image || "https://via.placeholder.com/600x400",
          slug: post.slug || `post-${post.id}`
        }));
        
        setBlogPosts(enhancedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return <div className="loading">Loading blog posts...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Get unique categories for filters
  const categories = ['All', ...new Set(blogPosts.map(post => post.category))];
  
  // Filter blog posts based on selected category
  const filteredPosts = activeFilter === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeFilter);

  return (
    <div className="blog-container">
      <h2 className="section-title">Latest Blog Posts</h2>
      
      <div className="blog-filter">
        {categories.map(category => (
          <button 
            key={category}
            className={`filter-button ${activeFilter === category ? 'active' : ''}`}
            onClick={() => setActiveFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="blog-grid">
        {filteredPosts.map((post) => (
          <div className="blog-card" key={post.id}>
            <div className="blog-image-container">
              <img src={post.image} alt={post.title} className="blog-image" />
              <div className="blog-category">{post.category}</div>
            </div>
            <div className="blog-content">
              <span className="blog-date">{post.date}</span>
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-summary">{post.summary}</p>
              <Link to={`/blog/${post.slug || post.id}`} className="read-more-link">
                Read More <span>&rarr;</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogList;
