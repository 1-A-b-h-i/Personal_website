import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

function PersonalAssistant() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [todos, setTodos] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const messagesEndRef = useRef(null);

  // Initialize Gemini API
  // NOTE: For security in production, this should be done through a backend service or serverless function
  // This implementation is for demonstration purposes only
  // In production, use environment variables set through deployment platform, not in the client
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

  // Load conversation history and context data
  useEffect(() => {
    const loadConversation = async () => {
      try {
        // Load messages
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

        if (messagesList.length === 0) {
          // Add welcome message if no history
          setMessages([{
            id: 'welcome',
            text: "Hello! I'm your personal assistant. I can help you manage tasks, track deadlines, and answer questions. I'll learn and remember things we discuss to get better at helping you. What can I help you with today?",
            sender: "assistant"
          }]);
        } else {
          setMessages(messagesList);
        }

        // Load todos for context
        const todosQuery = query(collection(db, 'todos'));
        const todosSnapshot = await getDocs(todosQuery);
        const todosList = todosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTodos(todosList);

        // Load deadlines for context
        const deadlinesQuery = query(collection(db, 'deadlines'));
        const deadlinesSnapshot = await getDocs(deadlinesQuery);
        const deadlinesList = deadlinesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDeadlines(deadlinesList);
      } catch (error) {
        console.error('Error loading conversation:', error);
      }
    };

    loadConversation();
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Clear conversation history
  const clearConversation = async () => {
    try {
      // In a production app, you would delete from Firestore
      // Here we'll just reset the UI
      setMessages([{
        id: 'welcome',
        text: "I've cleared our conversation history. How can I help you now?",
        sender: "assistant"
      }]);
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  };

  // Generate system prompt with context
  const generateSystemPrompt = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    // Format incomplete tasks for context
    const incompleteTasks = todos
      .filter(todo => !todo.completed)
      .map(todo => `- ${todo.text} (${todo.priority} priority)`)
      .join('\n');
    
    // Format upcoming deadlines for context
    const upcomingDeadlines = deadlines
      .map(deadline => {
        const deadlineDate = new Date(deadline.date);
        const formattedDate = deadlineDate.toLocaleDateString();
        return `- ${deadline.title} (${formattedDate})`;
      })
      .join('\n');

    return `
    You are an advanced personal assistant for productivity management. 
    Today is ${currentDate}, and the current time is ${currentTime}.
    
    Always maintain conversational memory about what the user tells you, their preferences, recurring topics, and personal details they share.
    Never refer to yourself as an AI, a language model, or mention technical limitations - just be their helpful assistant.
    
    INFORMATION ABOUT THE USER'S CURRENT TASKS:
    ${incompleteTasks || "No incomplete tasks at the moment."}
    
    INFORMATION ABOUT THE USER'S UPCOMING DEADLINES:
    ${upcomingDeadlines || "No upcoming deadlines at the moment."}
    
    When responding:
    1. Be concise but friendly
    2. Use natural, conversational language
    3. Never mention that you are "referring to your information" or "based on the data"
    4. If the user asks about tasks or deadlines, reference the actual data provided above
    5. Learn from conversations to become more personalized over time
    6. If the user adds information about themselves, remember it for future interactions
    
    Use Markdown when helpful for formatting responses.
    `;
  };

  // Process message with Gemini API directly
  const processWithGemini = async (userMessage) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Format conversation history for Gemini
      const history = messages
        .filter(msg => msg.id !== 'welcome') // Skip welcome message
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
      console.error('Error calling Gemini API:', error);
      return "I'm having trouble connecting right now. Please try again in a moment.";
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
      // Store user message in Firestore
      await addDoc(collection(db, 'assistant_messages'), userMessageObj);
      
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
      
      // Store assistant message in Firestore
      await addDoc(collection(db, 'assistant_messages'), assistantMessageObj);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message to UI
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        text: "Sorry, I encountered an error processing your request.",
        sender: "assistant",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="personal-assistant-container">
      <div className="personal-assistant-header">
        <div className="assistant-avatar">PA</div>
        <div className="assistant-info">
          <h3>Personal Assistant</h3>
          <p>Your productivity companion</p>
        </div>
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
              {message.sender === "user" ? "👤" : "🤖"}
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
            <div className="message-avatar">🤖</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="assistant-input">
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything or tell me about your day..."
        />
        <button onClick={handleSendMessage}>
          <span className="send-icon">➤</span>
        </button>
      </div>
    </div>
  );
}

export default PersonalAssistant; 