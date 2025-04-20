import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import TodoList from '../components/Productivity/TodoList';
import Deadlines from '../components/Productivity/Deadlines';
import PersonalAssistant from '../components/Productivity/PersonalAssistant';
import '../components/Productivity/Productivity.css';

function ProductivityPage() {
  const [activeTab, setActiveTab] = useState('todo');

  return (
    <div className="page-container productivity-page">
      <Navbar />
      <div className="productivity-container">
        <h1 className="productivity-title">Personal Workspace</h1>
        
        <div className="productivity-tabs">
          <button 
            className={`tab-button ${activeTab === 'todo' ? 'active' : ''}`}
            onClick={() => setActiveTab('todo')}
          >
            Tasks
          </button>
          <button 
            className={`tab-button ${activeTab === 'deadlines' ? 'active' : ''}`}
            onClick={() => setActiveTab('deadlines')}
          >
            Deadlines
          </button>
          <button 
            className={`tab-button ${activeTab === 'assistant' ? 'active' : ''}`}
            onClick={() => setActiveTab('assistant')}
          >
            Personal Assistant
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'todo' && <TodoList />}
          {activeTab === 'deadlines' && <Deadlines />}
          {activeTab === 'assistant' && <PersonalAssistant />}
        </div>
      </div>
    </div>
  );
}

export default ProductivityPage; 