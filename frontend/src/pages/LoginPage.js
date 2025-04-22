import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { signIn, isAuthenticated } from '../services/authService';

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/blog/admin');
    }
  }, [navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      await signIn();
      
      // Redirect on successful login
      navigate('/blog/admin');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Failed to enable edit mode. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <div className="login-container">
          <h2 className="login-title">Enable Edit Mode</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-actions">
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Enabling...' : 'Enable Edit Mode'}
              </button>
            </div>
          </form>
          
          <div className="login-options">
            <Link to="/blog" className="login-option">Return to Blog</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 