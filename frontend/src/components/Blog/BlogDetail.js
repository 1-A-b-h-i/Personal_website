import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostBySlug } from '../../services/dataService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaCalendarAlt, FaTag } from 'react-icons/fa';

function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const data = await getBlogPostBySlug(slug);
        
        if (!data) {
          setError('Blog post not found');
          setLoading(false);
          return;
        }
        
        setPost(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. Please try again later.');
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  if (loading) {
    return <div className="loading">Loading blog post...</div>;
  }

  if (error || !post) {
    return <div className="error-message">{error || 'Blog post not found'}</div>;
  }

  return (
    <div className="blog-detail-container">
      {post.image && (
        <div className="blog-detail-image-container">
          <img src={post.image} alt={post.title} className="blog-detail-image" />
          {post.category && <div className="blog-detail-category">{post.category}</div>}
        </div>
      )}
      
      <h1 className="blog-detail-title">{post.title}</h1>
      
      <div className="blog-detail-meta">
        <div className="blog-detail-date">
          <FaCalendarAlt /> {post.date}
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="blog-detail-tags">
            <FaTag />
            {post.tags.map((tag, index) => (
              <span key={tag} className="blog-tag">
                {tag}
                {index < post.tags.length - 1 && ', '}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="blog-detail-content">
        {post.content ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        ) : (
          <p>{post.summary}</p>
        )}
      </div>
      
      <div className="blog-detail-navigation">
        <Link to="/blog" className="back-to-blog">
          &larr; Back to all posts
        </Link>
      </div>
    </div>
  );
}

export default BlogDetail; 