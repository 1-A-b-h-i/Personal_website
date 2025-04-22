import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBlogPost, updateBlogPost, getBlogPostById } from '../../services/blogService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { isAuthenticated } from '../../services/authService';

function BlogEditor() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!postId;
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    tags: '',
    image: ''
  });
  
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/blog');
      return;
    }
    
    // If editing an existing post, fetch the post data
    if (isEditing) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const post = await getBlogPostById(postId);
          
          if (!post) {
            setError('Blog post not found');
            setLoading(false);
            return;
          }
          
          setFormData({
            title: post.title || '',
            summary: post.summary || '',
            content: post.content || '',
            date: post.date || new Date().toISOString().split('T')[0],
            category: post.category || '',
            tags: post.tags ? post.tags.join(', ') : '',
            image: post.image || ''
          });
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching post:', error);
          setError('Failed to load blog post. Please try again later.');
          setLoading(false);
        }
      };
      
      fetchPost();
    }
  }, [isEditing, postId, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Process tags - convert comma-separated string to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      const blogData = {
        ...formData,
        tags: tagsArray
      };
      
      let result;
      
      if (isEditing) {
        // Update existing post
        result = await updateBlogPost(postId, blogData);
      } else {
        // Create new post
        result = await createBlogPost(blogData);
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Navigate to the newly created/updated post after a delay
      setTimeout(() => {
        navigate(`/blog/${result.slug || result.id}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error saving blog post:', error);
      setError(error.message || 'Failed to save blog post. Please try again later.');
      setLoading(false);
    }
  };
  
  if (loading && isEditing) {
    return <div className="loading">Loading blog post...</div>;
  }
  
  return (
    <div className="blog-editor-container">
      <h2 className="editor-title">{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Blog post saved successfully!</div>}
      
      <div className="editor-tabs">
        <button 
          className={`editor-tab ${!preview ? 'active' : ''}`}
          onClick={() => setPreview(false)}
        >
          Edit
        </button>
        <button 
          className={`editor-tab ${preview ? 'active' : ''}`}
          onClick={() => setPreview(true)}
        >
          Preview
        </button>
      </div>
      
      {preview ? (
        <div className="blog-preview">
          <h1 className="preview-title">{formData.title || 'Untitled Post'}</h1>
          
          <div className="preview-meta">
            <div className="preview-date">{formData.date}</div>
            {formData.category && <div className="preview-category">{formData.category}</div>}
          </div>
          
          <div className="preview-summary">{formData.summary}</div>
          
          <div className="preview-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {formData.content || 'No content yet...'}
            </ReactMarkdown>
          </div>
          
          {formData.tags && (
            <div className="preview-tags">
              Tags: {formData.tags}
            </div>
          )}
        </div>
      ) : (
        <form className="blog-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter blog post title"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="summary">Summary *</label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              required
              rows="2"
              placeholder="Brief summary of your post"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content (Markdown supported) *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows="12"
              placeholder="Write your blog post content here... Markdown is supported!"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="E.g., Web Development"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="E.g., react, javascript, web"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/blog')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default BlogEditor; 