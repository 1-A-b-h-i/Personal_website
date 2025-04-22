import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { format } from 'date-fns';
import { FaRobot, FaUser, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

function PersonalAssistant({ todos, deadlines, journalEntries }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [useLocalStorage, setUseLocalStorage] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Debug logging for props
  useEffect(() => {
    console.log("PersonalAssistant component props:");
    console.log("- todos:", todos);
    console.log("- deadlines:", deadlines);
    console.log("- journalEntries:", journalEntries);
  }, [todos, deadlines, journalEntries]);

  // Initialize Gemini API
  // NOTE: In production, API calls should be routed through a backend service
  const genAI = new GoogleGenerativeAI("AIzaSyAqhIGlpd-iIThg2b0WkEfsVx0M1SU_qkk");

  // Load conversation history
  useEffect(() => {
    const loadConversation = async () => {
      // Try to load from Firestore first
      try {
        const messagesQuery = query(
          collection(db, 'assistant_messages'),
          orderBy('timestamp', 'asc'),
          limit(50)
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        const messagesList = messagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (messagesList.length > 0) {
          setMessages(messagesList);
        } else {
          addWelcomeMessage();
        }
      } catch (error) {
        console.error('Error loading from Firestore, falling back to local storage:', error);
        setErrorState(error);
        setUseLocalStorage(true);
        
        // Try to load from localStorage as fallback
        const savedMessages = localStorage.getItem('assistant_messages');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        } else {
          addWelcomeMessage();
        }
      }
    };

    loadConversation();
  }, []);

  // Save messages to localStorage when they change (if using localStorage)
  useEffect(() => {
    if (useLocalStorage && messages.length > 0) {
      localStorage.setItem('assistant_messages', JSON.stringify(messages));
    }
  }, [messages, useLocalStorage]);

  // Add welcome message
  const addWelcomeMessage = () => {
    setMessages([{
      id: 'welcome',
      text: "Hello! I'm your personal assistant. I can help manage your tasks, track deadlines, and keep your journal. I'll remember our conversations to better assist you. How can I help today?",
      sender: "assistant",
      timestamp: new Date().toISOString()
    }]);
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Clear conversation history
  const clearConversation = async () => {
    const clearMessage = {
      id: 'clear-message',
        text: "I've cleared our conversation history. How can I help you now?",
      sender: "assistant",
      timestamp: new Date().toISOString()
    };
    
    setMessages([clearMessage]);
    
    // Store in Firestore if available, otherwise just use localStorage
    if (!useLocalStorage) {
      try {
        await addDoc(collection(db, 'assistant_messages'), clearMessage);
    } catch (error) {
        console.error('Error writing to Firestore, using local storage instead:', error);
        setUseLocalStorage(true);
        localStorage.setItem('assistant_messages', JSON.stringify([clearMessage]));
      }
    } else {
      localStorage.setItem('assistant_messages', JSON.stringify([clearMessage]));
    }
  };

  // Generate system prompt with context from all components
  const generateSystemPrompt = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const today = new Date();
    
    // Task Analysis
    const totalTasks = todos?.length || 0;
    const completedTasks = todos?.filter(todo => todo.completed)?.length || 0;
    const incompleteTasks = todos?.filter(todo => !todo.completed) || [];
    const incompleteTasksCount = incompleteTasks.length;
    
    // Task priority breakdown
    const highPriorityTasks = incompleteTasks.filter(todo => todo.priority === 'high');
    const mediumPriorityTasks = incompleteTasks.filter(todo => todo.priority === 'medium');
    const lowPriorityTasks = incompleteTasks.filter(todo => todo.priority === 'low');
    
    // Format detailed tasks for context
    const detailedTasks = todos?.map(todo => {
      const createdDate = new Date(todo.createdAt).toLocaleDateString();
      return `- ${todo.text} (Priority: ${todo.priority}, Status: ${todo.completed ? 'Completed' : 'Incomplete'}, Created: ${createdDate})`;
    }).join('\n') || "No tasks available.";
    
    // Deadline Analysis
    const sortedDeadlines = [...(deadlines || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
    const upcomingDeadlinesCount = sortedDeadlines.length;
    
    // Check for overdue deadlines
    const overdueDeadlines = sortedDeadlines.filter(deadline => new Date(deadline.date) < today);
    const dueTodayDeadlines = sortedDeadlines.filter(deadline => {
      const deadlineDate = new Date(deadline.date);
      return deadlineDate.toDateString() === today.toDateString();
    });
    const upcomingDeadlinesWithin7Days = sortedDeadlines.filter(deadline => {
      const deadlineDate = new Date(deadline.date);
      const diffTime = deadlineDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 7;
    });
    
    // Format detailed deadlines for context
    const detailedDeadlines = sortedDeadlines.map(deadline => {
      const deadlineDate = new Date(deadline.date);
      const diffTime = deadlineDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let status = '';
      
      if (diffDays < 0) status = 'OVERDUE';
      else if (diffDays === 0) status = 'DUE TODAY';
      else if (diffDays <= 7) status = `Due in ${diffDays} days`;
      else status = `Due in ${diffDays} days`;
      
      return `- ${deadline.title} (${deadlineDate.toLocaleDateString()}) - ${status}`;
    }).join('\n') || "No deadlines available.";
    
    // Journal Analysis
    const sortedJournalEntries = [...(journalEntries || [])].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    // Analyze mood trends
    const moodCounts = {};
    sortedJournalEntries.forEach(entry => {
      const mood = entry.mood || 'neutral';
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });
    
    // Get most frequent mood
    let dominantMood = 'neutral';
    let maxCount = 0;
    for (const mood in moodCounts) {
      if (moodCounts[mood] > maxCount) {
        maxCount = moodCounts[mood];
        dominantMood = mood;
      }
    }
    
    // Get recent journal entries in more detail
    const detailedJournalEntries = sortedJournalEntries.map(entry => {
      const entryDate = format(new Date(entry.date), 'MMMM dd, yyyy');
      return `- ${entryDate} (Mood: ${entry.mood || 'neutral'})\n  ${entry.content}`;
    }).join('\n\n') || "No journal entries available.";
    
    // Cross-reference tasks with deadlines
    const taskDeadlineInsights = [];
    if (sortedDeadlines.length > 0 && incompleteTasks.length > 0) {
      const urgentDeadlines = sortedDeadlines.filter(deadline => {
        const deadlineDate = new Date(deadline.date);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3;
      });
      
      if (urgentDeadlines.length > 0 && highPriorityTasks.length === 0) {
        taskDeadlineInsights.push("You have urgent deadlines coming up but no high-priority tasks.");
      }
      
      if (overdueDeadlines.length > 0) {
        taskDeadlineInsights.push(`You have ${overdueDeadlines.length} overdue deadlines.`);
      }
    }

    return `
    You are an advanced personal assistant for productivity management with FULL CONTEXT of the user's tasks, deadlines, and journal entries.
    Today is ${currentDate}, and the current time is ${currentTime}.
    
    Always maintain conversational memory about what the user tells you, their preferences, recurring topics, and personal details they share.
    Never refer to yourself as an AI, a language model, or mention technical limitations - just be their helpful assistant who has complete awareness of their productivity data.
    
    PRODUCTIVITY OVERVIEW:
    - Total tasks: ${totalTasks} (${completedTasks} completed, ${incompleteTasksCount} incomplete)
    - High priority tasks: ${highPriorityTasks.length}
    - Medium priority tasks: ${mediumPriorityTasks.length}
    - Low priority tasks: ${lowPriorityTasks.length}
    - Upcoming deadlines: ${upcomingDeadlinesCount}
    - Overdue deadlines: ${overdueDeadlines.length}
    - Deadlines due today: ${dueTodayDeadlines.length}
    - Deadlines within 7 days: ${upcomingDeadlinesWithin7Days.length}
    - Journal entries: ${sortedJournalEntries.length}
    - Dominant mood: ${dominantMood}
    
    ${taskDeadlineInsights.length > 0 ? 'INSIGHTS:\n' + taskDeadlineInsights.join('\n') : ''}
    
    DETAILED TASK INFORMATION:
    ${detailedTasks}
    
    DETAILED DEADLINE INFORMATION:
    ${detailedDeadlines}
    
    JOURNAL ENTRIES:
    ${detailedJournalEntries}
    
    When responding:
    1. Make use of ALL the context provided above to give highly personalized responses
    2. Be conversational and empathetic, considering the user's recent moods from journal entries
    3. Reference specific tasks and deadlines by name when relevant
    4. Provide specific insights by cross-referencing tasks, deadlines, and journal entries
    5. Help the user manage their priorities based on both tasks and deadlines
    6. Track commitments the user mentions in conversation and remind them when relevant
    7. Recognize patterns in the user's productivity and journal entries to offer helpful insights
    8. When discussing multiple tasks or deadlines, format your response with bullet points for clarity
    9. If asked to summarize the user's current situation, provide a comprehensive overview of tasks, deadlines, and recent journal sentiments
    
    Use Markdown formatting to make your responses more readable when presenting structured information.
    `;
  };

  // Process message with Gemini API directly
  const processWithGemini = async (userMessage) => {
    try {
      // Check for direct questions about tasks or deadlines that we can answer immediately
      const lowerMessage = userMessage.toLowerCase().trim();
      console.log("Processing message:", lowerMessage);
      
      // Handle task count questions
      if (lowerMessage.includes('how many tasks') || 
          lowerMessage.includes('tasks left') || 
          lowerMessage.match(/tasks?.*remaining/)) {
        console.log("Detected task query");
        const incompleteTaskCount = todos?.filter(todo => !todo.completed)?.length || 0;
        const taskList = todos
          ?.filter(todo => !todo.completed)
          .map(todo => `- ${todo.text} (${todo.priority} priority)`)
          .join('\n');
          
        return `You have ${incompleteTaskCount} incomplete ${incompleteTaskCount === 1 ? 'task' : 'tasks'} remaining:\n\n${taskList || 'No tasks at the moment.'}`;
      }
      
      // Handle deadline questions - simplified detection logic
      if (lowerMessage === 'deadlines' || 
          lowerMessage === 'deadlines?' || 
          lowerMessage.includes('deadline') || 
          lowerMessage.includes('due date')) {
          
        console.log("Detected deadline query:", deadlines);
        const deadlineCount = deadlines?.length || 0;
        
        // Create a more detailed deadline list with status
        const today = new Date();
        const deadlineList = deadlines
          ?.map(deadline => {
            const deadlineDate = new Date(deadline.date);
            const diffTime = deadlineDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            let status = '';
            
            if (diffDays < 0) status = 'OVERDUE';
            else if (diffDays === 0) status = 'DUE TODAY';
            else if (diffDays === 1) status = 'DUE TOMORROW';
            else status = `Due in ${diffDays} days`;
            
            return `- ${deadline.title} (${deadlineDate.toLocaleDateString()}) - ${status}`;
          })
          .join('\n') || 'No deadlines at the moment.';
          
        return `You have ${deadlineCount} ${deadlineCount === 1 ? 'deadline' : 'deadlines'}:\n\n${deadlineList}`;
      }
      
      // Use Gemini API for other queries
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Format conversation history for Gemini
      const history = messages
        .filter(msg => msg.id !== 'welcome' && msg.id !== 'clear-message') // Skip non-conversation messages
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));
      
      // Create chat session
      const chat = model.startChat({
        history,
        systemInstruction: generateSystemPrompt(),
      });
      
      // Generate response
      const result = await chat.sendMessage(userMessage);
      return result.response.text();
    } catch (error) {
      console.error('Error processing message:', error);
      return "I'm having trouble connecting to my services right now. Please try again in a moment.";
    }
  };

  // Save message to storage
  const saveMessage = async (messageObj) => {
    if (!useLocalStorage) {
      try {
        await addDoc(collection(db, 'assistant_messages'), messageObj);
      } catch (error) {
        console.error('Error writing to Firestore, using local storage instead:', error);
        setUseLocalStorage(true);
        
        // Add all current messages to localStorage
        const allMessages = [...messages, messageObj];
        localStorage.setItem('assistant_messages', JSON.stringify(allMessages));
      }
    } else {
      // Already using localStorage, no need to try Firestore
      const allMessages = [...messages, messageObj];
      localStorage.setItem('assistant_messages', JSON.stringify(allMessages));
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;
    
    // Add user message to UI immediately
    const userMessageObj = {
      id: `user-${Date.now()}`,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessageObj]);
    setInputMessage('');
    setIsTyping(true);
    
    try {
      // Save user message
      await saveMessage(userMessageObj);
      
      // Process with Gemini API
      const assistantResponseText = await processWithGemini(inputMessage);
      
      // Create assistant message object
      const assistantMessageObj = {
        id: `assistant-${Date.now()}`,
        text: assistantResponseText,
        sender: "assistant",
        timestamp: new Date().toISOString()
      };
      
      // Update UI
      setMessages(prev => [...prev, assistantMessageObj]);
      
      // Save assistant message
      await saveMessage(assistantMessageObj);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message to UI
      const errorMessageObj = {
        id: `error-${Date.now()}`,
        text: "Sorry, I encountered an error processing your request.",
        sender: "assistant",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessageObj]);
      
      // Try to save error message
      try {
        await saveMessage(errorMessageObj);
      } catch (e) {
        console.error('Could not save error message:', e);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="personal-assistant-container">
      <div className="personal-assistant-header">
        <div className="assistant-avatar">
          <FaRobot />
        </div>
        <div className="assistant-info">
          <h3>Personal Assistant</h3>
          <p>Your productivity companion</p>
        </div>
        {useLocalStorage && (
          <div className="storage-indicator" title="Using local storage mode">
            <FaExclamationTriangle className="warning-icon" />
            <span className="storage-mode">Local Mode</span>
          </div>
        )}
        <button 
          className="clear-chat-btn" 
          onClick={clearConversation}
          title="Clear conversation history"
        >
          Clear Chat
        </button>
      </div>
      
      <div className="assistant-messages">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`message ${message.sender === "user" ? "user-message" : "assistant-message"}`}
          >
            <div className="message-bubble">
              {message.sender === "assistant" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.text}
                </ReactMarkdown>
              ) : (
                message.text
              )}
            </div>
            <div className="message-avatar">
              {message.sender === "user" ? <FaUser /> : <FaRobot />}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message assistant-message">
            <div className="message-bubble typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
            <div className="message-avatar">
              <FaRobot />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="assistant-input">
        <textarea 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything or tell me about your day..."
          rows={1}
        />
        <button onClick={handleSendMessage}>
          <span className="send-icon">➤</span>
        </button>
      </div>
    </div>
  );
}

export default PersonalAssistant; 