import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { FaEdit, FaTrash, FaCheck, FaLock } from 'react-icons/fa';

function TodoList({ existingTodos, onDataChange, readOnly = false }) {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState(null);

  // Use existing todos if provided or fetch from Firestore
  useEffect(() => {
    if (existingTodos) {
      setTodos(existingTodos);
      setLoading(false);
    } else {
      fetchTodos();
    }
  }, [existingTodos]);

  // Fetch todos from Firestore
  const fetchTodos = async () => {
    try {
      const todoQuery = query(collection(db, 'todos'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(todoQuery);
      
      const todosList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setTodos(todosList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async () => {
    if (newTodoText.trim() === '' || readOnly) return;
    
    try {
      const newTodo = {
        text: newTodoText,
        completed: false,
        priority,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'todos'), newTodo);
      
      setTodos([
        {
          id: docRef.id,
          ...newTodo
        },
        ...todos
      ]);
      
      setNewTodoText('');
      setPriority('medium');
      
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Toggle todo completion status
  const toggleComplete = async (todoId) => {
    if (readOnly) return;
    
    try {
      const todoToUpdate = todos.find(todo => todo.id === todoId);
      
      await updateDoc(doc(db, 'todos', todoId), {
        completed: !todoToUpdate.completed
      });
      
      setTodos(
        todos.map(todo => 
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        )
      );
      
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Delete a todo
  const deleteTodo = async (todoId) => {
    if (readOnly) return;
    
    try {
      await deleteDoc(doc(db, 'todos', todoId));
      setTodos(todos.filter(todo => todo.id !== todoId));
      
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Start editing a todo
  const startEditing = (todo) => {
    if (readOnly) return;
    
    setEditingTodo({
      id: todo.id,
      text: todo.text,
      priority: todo.priority
    });
    setNewTodoText(todo.text);
    setPriority(todo.priority);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTodo(null);
    setNewTodoText('');
    setPriority('medium');
  };

  // Update an existing todo
  const updateTodo = async () => {
    if (newTodoText.trim() === '' || !editingTodo || readOnly) return;
    
    try {
      await updateDoc(doc(db, 'todos', editingTodo.id), {
        text: newTodoText,
        priority: priority
      });
      
      setTodos(
        todos.map(todo => 
          todo.id === editingTodo.id 
            ? { ...todo, text: newTodoText, priority: priority } 
            : todo
        )
      );
      
      setEditingTodo(null);
      setNewTodoText('');
      setPriority('medium');
      
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTodo) {
      updateTodo();
    } else {
      addTodo();
    }
  };

  // Get priority class name
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  if (loading) {
    return <div className="todo-container">Loading tasks...</div>;
  }

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>{editingTodo ? 'Edit Task' : 'My Tasks'}</h2>
        {readOnly && (
          <div className="read-only-indicator">
            <FaLock /> <span>View Only</span>
          </div>
        )}
        {editingTodo && (
          <button 
            className="todo-action-btn" 
            onClick={cancelEditing}
          >
            Cancel
          </button>
        )}
      </div>
      
      {!readOnly && (
        <form onSubmit={handleSubmit} className="todo-input-container">
          <input
            type="text"
            className="todo-input"
            placeholder="What do you need to do?"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
          />
          <select
            className="todo-priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button 
            type="submit" 
            className="add-todo-btn"
          >
            {editingTodo ? 'Update' : 'Add Task'}
          </button>
        </form>
      )}
      
      <div className="todo-list-wrapper">
        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="todo-item empty-state">No tasks yet. {!readOnly && 'Add one above!'}</li>
          ) : (
            todos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed-task' : ''}`}>
                {!readOnly && (
                  <div className="todo-checkbox-wrapper">
                    <input
                      type="checkbox"
                      className="todo-checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id)}
                      id={`todo-${todo.id}`}
                    />
                    <label 
                      htmlFor={`todo-${todo.id}`}
                      className="todo-checkbox-label"
                    >
                      <FaCheck className="check-icon" />
                    </label>
                  </div>
                )}
                <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                  {todo.text}
                </span>
                <span className={`todo-priority ${getPriorityClass(todo.priority)}`}>
                  {todo.priority}
                </span>
                {!readOnly && (
                  <div className="todo-actions">
                    <button
                      className="todo-action-btn edit-btn"
                      onClick={() => startEditing(todo)}
                      disabled={todo.completed}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="todo-action-btn delete-btn"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default TodoList; 