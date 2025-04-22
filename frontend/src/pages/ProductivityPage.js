import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TodoList from '../components/Productivity/TodoList';
import Deadlines from '../components/Productivity/Deadlines';
import PersonalAssistant from '../components/Productivity/PersonalAssistant';
import Journal from '../components/Productivity/Journal';
import '../components/Productivity/Productivity.css';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { FaLock, FaUnlock } from 'react-icons/fa';

function ProductivityPage() {
  const [todos, setTodos] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editEnabled, setEditEnabled] = useState(false);
  const [keyPressed, setKeyPressed] = useState({
    ctrl: false,
    shift: false,
    e: false
  });

  // Initialize editEnabled from localStorage
  useEffect(() => {
    const storedEditMode = localStorage.getItem('editModeEnabled');
    setEditEnabled(storedEditMode === 'true');
  }, []);

  // Function to trigger refresh of data
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    const newEditMode = !editEnabled;
    setEditEnabled(newEditMode);
    localStorage.setItem('editModeEnabled', newEditMode.toString());
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Update keyPressed state
      if (e.key === 'Control' || e.key === 'Meta') {
        setKeyPressed(prev => ({ ...prev, ctrl: true }));
      } else if (e.key === 'Shift') {
        setKeyPressed(prev => ({ ...prev, shift: true }));
      } else if (e.key === 'e' || e.key === 'E') {
        setKeyPressed(prev => ({ ...prev, e: true }));
      }
      
      // Check for Ctrl+Shift+E combination
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'e' || e.key === 'E')) {
        // Prevent default browser behavior
        e.preventDefault();
        toggleEditMode();
      }
    };

    const handleKeyUp = (e) => {
      // Reset keyPressed state
      if (e.key === 'Control' || e.key === 'Meta') {
        setKeyPressed(prev => ({ ...prev, ctrl: false }));
      } else if (e.key === 'Shift') {
        setKeyPressed(prev => ({ ...prev, shift: false }));
      } else if (e.key === 'e' || e.key === 'E') {
        setKeyPressed(prev => ({ ...prev, e: false }));
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Clean up event listeners
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Load all data for context sharing between components
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load todos
        const todosQuery = query(collection(db, 'todos'), orderBy('createdAt', 'desc'));
        const todosSnapshot = await getDocs(todosQuery);
        const todosList = todosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTodos(todosList);

        // Load deadlines
        const deadlinesQuery = query(collection(db, 'deadlines'), orderBy('date', 'asc'));
        const deadlinesSnapshot = await getDocs(deadlinesQuery);
        const deadlinesList = deadlinesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDeadlines(deadlinesList);

        // Load journal entries
        const journalQuery = query(collection(db, 'journal_entries'), orderBy('date', 'desc'));
        const journalSnapshot = await getDocs(journalQuery);
        const journalList = journalSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setJournalEntries(journalList);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [refreshTrigger]);

  return (
    <div className="page-container productivity-page">
      <Navbar />
      <div className="productivity-dashboard">
        <header className="dashboard-header">
          <h1>Personal Workspace</h1>
          <div className="edit-toggle-container">
            <button 
              className="edit-toggle-btn"
              onClick={toggleEditMode}
              title={editEnabled ? "Disable editing (Ctrl+Shift+E)" : "Enable editing (Ctrl+Shift+E)"}
            >
              {editEnabled ? <FaUnlock /> : <FaLock />}
            </button>
          </div>
        </header>

        <div className="dashboard-grid">
          <div className="dashboard-card tasks-card">
            <TodoList 
              existingTodos={todos} 
              onDataChange={refreshData}
              readOnly={!editEnabled}
            />
          </div>
          
          <div className="dashboard-card deadlines-card">
            <Deadlines 
              existingDeadlines={deadlines} 
              onDataChange={refreshData}
              readOnly={!editEnabled}
            />
          </div>
          
          <div className="dashboard-card journal-card">
            <Journal 
              existingEntries={journalEntries} 
              onDataChange={refreshData}
              readOnly={!editEnabled}
            />
          </div>
          
          <div className="dashboard-card assistant-card">
            <PersonalAssistant 
              todos={todos || []} 
              deadlines={deadlines || []} 
              journalEntries={journalEntries || []} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductivityPage; 