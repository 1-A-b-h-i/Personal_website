import React from 'react';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';

function ContactPage() {
  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <Contact />
      </div>
    </div>
  );
}

export default ContactPage; 