import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createChatSession, getChatHistory, clearChatHistory } from '../../services/ragChatService';
import { sendRagChatMessage } from '../../services/ragChatService';

function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm Abhinav's AI assistant. How can I help you today?",
      sender: "ai"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize session on component mount
  useEffect(() => {
    initializeSession();
  }, []);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat session
  const initializeSession = async () => {
    try {
      const { sessionId } = createChatSession();
      setSessionId(sessionId);
      
      // Load previous messages if any exist
      if (sessionId) {
        const history = await getChatHistory(sessionId);
        if (history && history.length > 0) {
          const formattedMessages = history.map((msg, index) => ({
            id: index + 2, // Start from 2 because we already have the welcome message
            text: msg.message,
            sender: msg.isUser ? "user" : "ai"
          }));
          
          setMessages(prevMessages => [prevMessages[0], ...formattedMessages]);
        }
      }
    } catch (error) {
      console.error('Error initializing chat session:', error);
    }
  };

  // Clear conversation history
  const clearConversation = async () => {
    try {
      if (sessionId) {
        await clearChatHistory(sessionId);
      }
      
      // Reset UI
      setMessages([
        {
          id: 1,
          text: "Hi there! I'm Abhinav's AI assistant. How can I help you today?",
          sender: "ai"
        }
      ]);
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user"
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Get response using our RAG service
    try {
      const result = await sendRagChatMessage(inputMessage, sessionId);
      
      const aiResponse = {
        id: messages.length + 2,
        text: result.response,
        sender: "ai"
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Update session ID if needed
      if (result.sessionId && result.sessionId !== sessionId) {
        setSessionId(result.sessionId);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      
      const errorResponse = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble responding right now.",
        sender: "ai"
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Render message content with or without Markdown
  const renderMessageContent = (message) => {
    if (message.sender === "ai") {
      return (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.text}
        </ReactMarkdown>
      );
    } else {
      return message.text;
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <div className="ai-avatar">AI</div>
        <div className="ai-info">
          <h3>Abhinav's AI Assistant</h3>
          <p>Ask me anything about Abhinav</p>
        </div>
        <button 
          className="clear-chat-btn" 
          onClick={clearConversation}
          title="Clear conversation history"
        >
          Clear Chat
        </button>
      </div>
      
      <div className="ai-chat-messages">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`message ${message.sender === "user" ? "user-message" : "ai-message"}`}
          >
            <div className="message-bubble">
              {renderMessageContent(message)}
            </div>
            <div className="message-avatar">
              {message.sender === "user" ? "👤" : "🤖"}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message ai-message">
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
      
      <div className="ai-chat-input">
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about Abhinav..."
        />
        <button onClick={handleSendMessage}>
          <span className="send-icon">➤</span>
        </button>
      </div>
      
      <div className="ai-chat-suggestions">
        <button onClick={() => setInputMessage("What are Abhinav's skills?")}>
          What are Abhinav's skills?
        </button>
        <button onClick={() => setInputMessage("Tell me about Abhinav's projects")}>
          Tell me about Abhinav's projects
        </button>
        <button onClick={() => setInputMessage("How can I contact Abhinav?")}>
          How can I contact Abhinav?
        </button>
      </div>
    </div>
  );
}

export default AIChat;
