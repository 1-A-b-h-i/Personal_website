import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllBlogPosts, deleteBlogPost } from '../services/blogService';
import { isAuthenticated, logOut } from '../services/authService';
import { FaEdit, FaTrash, FaPlus, FaSignOutAlt } from 'react-icons/fa';

function BlogAdminPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    fetchBlogPosts();
  }, [navigate]);
  
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const posts = await getAllBlogPosts();
      setBlogPosts(posts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to load blog posts. Please try again later.');
      setLoading(false);
    }
  };
  
  const handleDeleteClick = (postId) => {
    setDeleteConfirm(postId);
  };
  
  const handleDeleteConfirm = async (postId) => {
    try {
      setLoading(true);
      await deleteBlogPost(postId);
      
      // Refresh the post list
      fetchBlogPosts();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting blog post:', error);
      setError(error.message || 'Failed to delete blog post. Please try again later.');
      setLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await logOut();
      navigate('/blog');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    }
  };
  
  if (loading && blogPosts.length === 0) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="page-content">
          <div className="loading">Loading blog posts...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <div className="blog-admin-container">
          <div className="admin-header">
            <h2 className="admin-title">Manage Blog Posts</h2>
            <div className="admin-actions">
              <Link to="/blog/new" className="new-post-button">
                <FaPlus /> New Post
              </Link>
              <button className="sign-out-button" onClick={handleSignOut}>
                <FaSignOutAlt /> Sign Out
              </button>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {blogPosts.length === 0 ? (
            <div className="no-posts-message">
              <p>No blog posts found. Create your first post!</p>
              <Link to="/blog/new" className="new-post-button">Create Post</Link>
            </div>
          ) : (
            <div className="blog-posts-table-container">
              <table className="blog-posts-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogPosts.map((post) => (
                    <tr key={post.id}>
                      <td className="post-title-cell">
                        <Link to={`/blog/${post.slug || post.id}`}>
                          {post.title}
                        </Link>
                      </td>
                      <td>{post.date}</td>
                      <td>{post.category || 'Uncategorized'}</td>
                      <td className="post-actions-cell">
                        <Link 
                          to={`/blog/edit/${post.id}`} 
                          className="edit-button"
                          title="Edit post"
                        >
                          <FaEdit />
                        </Link>
                        
                        {deleteConfirm === post.id ? (
                          <div className="delete-confirm">
                            <span>Confirm?</span>
                            <button 
                              onClick={() => handleDeleteConfirm(post.id)}
                              className="confirm-yes"
                            >
                              Yes
                            </button>
                            <button 
                              onClick={() => setDeleteConfirm(null)}
                              className="confirm-no"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleDeleteClick(post.id)}
                            className="delete-button"
                            title="Delete post"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="back-link-container">
            <Link to="/blog" className="back-button">Return to Blog</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogAdminPage; 