import React from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';

function BlogList() {
  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with React Hooks",
      date: "May 15, 2023",
      summary: "Learn how to use React Hooks to simplify your components and make your code more reusable.",
      category: "Web Development",
      image: "https://via.placeholder.com/600x400",
      slug: "getting-started-with-react-hooks"
    },
    {
      id: 2,
      title: "Machine Learning Fundamentals",
      date: "April 22, 2023",
      summary: "A comprehensive guide to understanding the basics of machine learning algorithms.",
      category: "AI",
      image: "https://via.placeholder.com/600x400",
      slug: "machine-learning-fundamentals"
    },
    {
      id: 3,
      title: "Building REST APIs with Node.js",
      date: "March 18, 2023",
      summary: "Step-by-step guide to creating robust REST APIs using Node.js and Express.",
      category: "Backend Development",
      image: "https://via.placeholder.com/600x400",
      slug: "building-rest-apis-with-nodejs"
    },
    {
      id: 4,
      title: "CSS Grid Layout: A Complete Guide",
      date: "February 05, 2023",
      summary: "Master CSS Grid Layout with practical examples and tips for responsive design.",
      category: "Web Design",
      image: "https://via.placeholder.com/600x400",
      slug: "css-grid-layout-guide"
    }
  ];

  return (
    <div className="blog-container">
      <h2 className="section-title">Latest Blog Posts</h2>
      
      <div className="blog-filter">
        <button className="filter-button active">All</button>
        <button className="filter-button">Web Development</button>
        <button className="filter-button">AI</button>
        <button className="filter-button">Backend Development</button>
        <button className="filter-button">Web Design</button>
      </div>
      
      <div className="blog-grid">
        {blogPosts.map((post) => (
          <div className="blog-card" key={post.id}>
            <div className="blog-image-container">
              <img src={post.image} alt={post.title} className="blog-image" />
              <div className="blog-category">{post.category}</div>
            </div>
            <div className="blog-content">
              <span className="blog-date">{post.date}</span>
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-summary">{post.summary}</p>
              <Link to={`/blog/${post.slug}`} className="read-more-link">
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
