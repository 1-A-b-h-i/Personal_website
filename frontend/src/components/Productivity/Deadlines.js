import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { FaTrash, FaCalendarAlt, FaLock } from 'react-icons/fa';
import { format, parseISO, differenceInDays } from 'date-fns';

function Deadlines({ existingDeadlines, onDataChange, readOnly = false }) {
  const [deadlines, setDeadlines] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Use existing deadlines if provided or fetch from Firestore
  useEffect(() => {
    if (existingDeadlines) {
      setDeadlines(existingDeadlines);
      setLoading(false);
    } else {
      fetchDeadlines();
    }
  }, [existingDeadlines]);

  // Initialize date to today
  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Fetch deadlines from Firestore
  const fetchDeadlines = async () => {
    try {
      const deadlineQuery = query(collection(db, 'deadlines'), orderBy('date', 'asc'));
      const querySnapshot = await getDocs(deadlineQuery);
      
      const deadlinesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setDeadlines(deadlinesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching deadlines:', error);
      setLoading(false);
    }
  };

  // Add a new deadline
  const addDeadline = async (e) => {
    e.preventDefault();
    if (title.trim() === '' || !date || readOnly) return;
    
    try {
      // Format date to ISO string with time at the end of the day
      const isoDate = new Date(date + 'T23:59:59').toISOString();
      
      const newDeadline = {
        title: title.trim(),
        date: isoDate,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'deadlines'), newDeadline);
      
      setDeadlines([
        ...deadlines,
        {
          id: docRef.id,
          ...newDeadline
        }
      ].sort((a, b) => new Date(a.date) - new Date(b.date)));
      
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Error adding deadline:', error);
    }
  };

  // Delete a deadline
  const deleteDeadline = async (deadlineId) => {
    if (readOnly) return;
    
    try {
      await deleteDoc(doc(db, 'deadlines', deadlineId));
      setDeadlines(deadlines.filter(deadline => deadline.id !== deadlineId));
      
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Error deleting deadline:', error);
    }
  };

  // Get countdown information
  const getCountdownInfo = (deadlineDate) => {
    const today = new Date();
    const targetDate = new Date(deadlineDate);
    const diffDays = differenceInDays(targetDate, today);
    
    let countdownClass = '';
    let countdownText = '';
    
    if (diffDays < 0) {
      countdownClass = 'overdue';
      countdownText = 'Overdue';
    } else if (diffDays === 0) {
      countdownClass = 'due-today';
      countdownText = 'Due Today';
    } else if (diffDays === 1) {
      countdownClass = 'due-tomorrow';
      countdownText = 'Due Tomorrow';
    } else if (diffDays <= 3) {
      countdownClass = 'due-soon';
      countdownText = `${diffDays} days left`;
    } else {
      countdownClass = 'upcoming';
      countdownText = `${diffDays} days left`;
    }
    
    return { countdownClass, countdownText };
  };

  if (loading) {
    return <div className="deadlines-container">Loading deadlines...</div>;
  }

  return (
    <div className="deadlines-container">
      <div className="todo-header">
        <h2>Important Deadlines</h2>
        {readOnly && (
          <div className="read-only-indicator">
            <FaLock /> <span>View Only</span>
          </div>
        )}
      </div>
      
      {!readOnly && (
        <form onSubmit={addDeadline} className="todo-input-container">
          <input
            type="text"
            className="todo-input"
            placeholder="Deadline title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="date"
            className="todo-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
          <button 
            type="submit" 
            className="add-todo-btn"
          >
            Add Deadline
          </button>
        </form>
      )}
      
      <div className="deadlines-list">
        {deadlines.length === 0 ? (
          <div className="deadline-item empty-state">
            No deadlines set. {!readOnly && 'Add one above!'}
          </div>
        ) : (
          deadlines.map(deadline => {
            const { countdownClass, countdownText } = getCountdownInfo(deadline.date);
            
            return (
              <div key={deadline.id} className="deadline-item">
                <div className="deadline-info">
                  <h3 className="deadline-title">{deadline.title}</h3>
                  <p className="deadline-date">
                    <FaCalendarAlt className="calendar-icon" />
                    <span>{format(parseISO(deadline.date), 'MMMM dd, yyyy')}</span>
                  </p>
                </div>
                <span className={`deadline-countdown ${countdownClass}`}>
                  {countdownText}
                </span>
                {!readOnly && (
                  <button
                    className="todo-action-btn delete-btn"
                    onClick={() => deleteDeadline(deadline.id)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Deadlines; 