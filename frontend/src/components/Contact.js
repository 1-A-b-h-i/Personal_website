import React from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">Contact Information</h1>
        <div className="contact-card">
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">👤</span>
              <p><strong>Name:</strong> Abhinav Paidisetti</p>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <p><strong>Email:</strong> <a href="mailto:abhinavpaidisetti@gmail.com">abhinavpaidisetti@gmail.com</a></p>
            </div>
            <div className="contact-item">
              <span className="contact-icon">👔</span>
              <p><strong>LinkedIn:</strong> <a href="https://in.linkedin.com/in/abhinav-paidisetti-a23186181" target="_blank" rel="noopener noreferrer">Abhinav Paidisetti</a></p>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🌐</span>
              <p><strong>Website:</strong> <a href="https://abhinavpaidisetti.me" target="_blank" rel="noopener noreferrer">abhinavpaidisetti.me</a></p>
            </div>
            <div className="contact-item">
              <span className="contact-icon">💻</span>
              <p><strong>GitHub:</strong> <a href="https://github.com/1-abhinav" target="_blank" rel="noopener noreferrer">1-abhinav</a></p>
            </div>
          </div>
        </div>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
    </div>
  );
}

export default Contact;
