import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { FaTrash, FaCalendarAlt } from 'react-icons/fa';
import { format, differenceInDays, parseISO } from 'date-fns';

function Deadlines() {
  const [deadlines, setDeadlines] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch deadlines from Firestore
  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const deadlineQuery = query(
          collection(db, 'deadlines'), 
          orderBy('date', 'asc')
        );
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

    fetchDeadlines();
  }, []);

  // Add a new deadline
  const addDeadline = async (e) => {
    e.preventDefault();
    if (title.trim() === '' || !date) return;
    
    try {
      const newDeadline = {
        title,
        date,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'deadlines'), newDeadline);
      
      // Add the new deadline to the state and sort by date
      const updatedDeadlines = [...deadlines, {
        id: docRef.id,
        ...newDeadline
      }].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setDeadlines(updatedDeadlines);
      setTitle('');
      setDate('');
    } catch (error) {
      console.error('Error adding deadline:', error);
    }
  };

  // Delete a deadline
  const deleteDeadline = async (deadlineId) => {
    try {
      await deleteDoc(doc(db, 'deadlines', deadlineId));
      setDeadlines(deadlines.filter(deadline => deadline.id !== deadlineId));
    } catch (error) {
      console.error('Error deleting deadline:', error);
    }
  };

  // Calculate days until deadline and return appropriate class
  const getCountdownInfo = (deadlineDate) => {
    const today = new Date();
    const targetDate = parseISO(deadlineDate);
    const daysRemaining = differenceInDays(targetDate, today);
    
    let countdownClass = '';
    let countdownText = '';
    
    if (daysRemaining < 0) {
      countdownClass = 'deadline-approaching';
      countdownText = 'Overdue';
    } else if (daysRemaining === 0) {
      countdownClass = 'deadline-approaching';
      countdownText = 'Today';
    } else if (daysRemaining === 1) {
      countdownClass = 'deadline-approaching';
      countdownText = 'Tomorrow';
    } else if (daysRemaining <= 7) {
      countdownClass = 'deadline-upcoming';
      countdownText = `${daysRemaining} days`;
    } else {
      countdownClass = 'deadline-distant';
      countdownText = `${daysRemaining} days`;
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
      </div>
      
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
      
      <div className="deadlines-list">
        {deadlines.length === 0 ? (
          <div className="deadline-item">No deadlines set. Add one above!</div>
        ) : (
          deadlines.map(deadline => {
            const { countdownClass, countdownText } = getCountdownInfo(deadline.date);
            
            return (
              <div key={deadline.id} className="deadline-item">
                <div className="deadline-info">
                  <h3 className="deadline-title">{deadline.title}</h3>
                  <p className="deadline-date">
                    <FaCalendarAlt style={{ marginRight: '5px' }} />
                    {format(parseISO(deadline.date), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <span className={`deadline-countdown ${countdownClass}`}>
                  {countdownText}
                </span>
                <button
                  className="todo-action-btn delete-btn"
                  onClick={() => deleteDeadline(deadline.id)}
                >
                  <FaTrash />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Deadlines; 