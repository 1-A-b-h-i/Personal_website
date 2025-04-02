import React, { useState, useRef, useEffect } from 'react';

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
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message to backend API
  const sendMessageToAPI = async (message) => {
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error communicating with API:', error);
      return "Sorry, I'm having trouble connecting to my knowledge base right now.";
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
    
    // Get response from API
    try {
      const aiResponseText = await sendMessageToAPI(inputMessage);
      
      const aiResponse = {
        id: messages.length + 2,
        text: aiResponseText,
        sender: "ai"
      };
      
      setMessages(prev => [...prev, aiResponse]);
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

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <div className="ai-avatar">AI</div>
        <div className="ai-info">
          <h3>Abhinav's AI Assistant</h3>
          <p>Ask me anything about Abhinav</p>
        </div>
      </div>
      
      <div className="ai-chat-messages">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`message ${message.sender === "user" ? "user-message" : "ai-message"}`}
          >
            <div className="message-bubble">
              {message.text}
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
