import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { format } from 'date-fns';
import { FaTrash, FaCalendarAlt, FaEdit, FaLock } from 'react-icons/fa';

function Journal({ existingEntries, onDataChange, readOnly = false }) {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [mood, setMood] = useState('neutral');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(readOnly ? 'history' : 'write'); // Default to history view if read-only

  // Load existing entries if provided or fetch from Firestore
  useEffect(() => {
    if (existingEntries) {
      setEntries(existingEntries);
      setLoading(false);
    } else {
      fetchEntries();
    }
  }, [existingEntries]);

  // If readOnly changes, update viewMode accordingly
  useEffect(() => {
    if (readOnly) {
      setViewMode('history');
    }
  }, [readOnly]);

  // Fetch journal entries from Firestore
  const fetchEntries = async () => {
    try {
      const entriesQuery = query(
        collection(db, 'journal_entries'),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(entriesQuery);
      
      const entriesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setEntries(entriesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      setLoading(false);
    }
  };

  // Check if there's an entry for the selected date
  useEffect(() => {
    const todayEntry = entries.find(entry => entry.date === selectedDate);
    if (todayEntry) {
      setContent(todayEntry.content);
      setMood(todayEntry.mood || 'neutral');
    } else {
      setContent('');
      setMood('neutral');
    }
  }, [selectedDate, entries]);

  // Save a journal entry
  const saveEntry = async (e) => {
    e.preventDefault();
    if (content.trim() === '' || readOnly) return;
    
    try {
      // Check if there's already an entry for this date
      const existingEntry = entries.find(entry => entry.date === selectedDate);
      
      if (existingEntry) {
        // Update existing entry (in a real app, you'd use updateDoc)
        await deleteDoc(doc(db, 'journal_entries', existingEntry.id));
      }
      
      // Add new entry
      const newEntry = {
        date: selectedDate,
        content,
        mood,
        timestamp: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'journal_entries'), newEntry);
      
      // Update local state
      if (existingEntry) {
        setEntries(
          entries.map(entry => 
            entry.id === existingEntry.id 
              ? { id: docRef.id, ...newEntry } 
              : entry
          )
        );
      } else {
        setEntries([
          { id: docRef.id, ...newEntry },
          ...entries
        ]);
      }
      
      if (onDataChange) {
        onDataChange();
      }
      
      alert('Journal entry saved!');
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  // Delete a journal entry
  const deleteEntry = async (entryId) => {
    if (readOnly) return;
    
    try {
      await deleteDoc(doc(db, 'journal_entries', entryId));
      setEntries(entries.filter(entry => entry.id !== entryId));
      
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  };

  // Get emoji for mood
  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'excited': return '🎉';
      case 'neutral': return '😐';
      case 'tired': return '😴';
      case 'sad': return '😢';
      case 'angry': return '😠';
      default: return '😐';
    }
  };

  if (loading) {
    return <div className="journal-container">Loading journal...</div>;
  }

  return (
    <div className="journal-container">
      <div className="journal-header">
        <h2>Daily Journal</h2>
        {readOnly && (
          <div className="read-only-indicator">
            <FaLock /> <span>View Only</span>
          </div>
        )}
        {!readOnly && (
          <div className="journal-view-toggle">
            <button 
              className={`journal-view-btn ${viewMode === 'write' ? 'active' : ''}`}
              onClick={() => setViewMode('write')}
            >
              Write
            </button>
            <button 
              className={`journal-view-btn ${viewMode === 'history' ? 'active' : ''}`}
              onClick={() => setViewMode('history')}
            >
              History
            </button>
          </div>
        )}
      </div>
      
      {viewMode === 'write' && !readOnly ? (
        <form onSubmit={saveEntry} className="journal-form">
          <div className="journal-date-picker">
            <FaCalendarAlt />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
          
          <div className="mood-selector">
            <label>Today's Mood:</label>
            <select 
              value={mood} 
              onChange={(e) => setMood(e.target.value)}
            >
              <option value="happy">Happy 😊</option>
              <option value="excited">Excited 🎉</option>
              <option value="neutral">Neutral 😐</option>
              <option value="tired">Tired 😴</option>
              <option value="sad">Sad 😢</option>
              <option value="angry">Angry 😠</option>
            </select>
          </div>
          
          <textarea
            className="journal-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write about your day, thoughts, ideas, or anything on your mind..."
            rows={6}
          />
          
          <button type="submit" className="journal-save-btn">
            Save Entry
          </button>
        </form>
      ) : (
        <div className="journal-entries-list">
          {entries.length === 0 ? (
            <div className="empty-entries">No journal entries yet.</div>
          ) : (
            entries.map(entry => (
              <div key={entry.id} className="journal-entry-item">
                <div className="journal-entry-header">
                  <div className="journal-entry-date">
                    <FaCalendarAlt />
                    <span>{format(new Date(entry.date), 'MMMM dd, yyyy')}</span>
                  </div>
                  <div className="journal-entry-mood">
                    {getMoodEmoji(entry.mood)}
                  </div>
                  {!readOnly && (
                    <div className="journal-entry-actions">
                      <button 
                        className="journal-action-btn edit-btn" 
                        onClick={() => {
                          setSelectedDate(entry.date);
                          setViewMode('write');
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="journal-action-btn delete-btn" 
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
                <div className="journal-entry-content">
                  {entry.content}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Journal; 