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

  // Simulate AI response
  const simulateAIResponse = (question) => {
    const responses = {
      "who is abhinav": "Abhinav Paidisetti is a software developer specialized in web technologies and AI. He has worked on various projects and has expertise in React, Node.js, and machine learning.",
      "what are abhinav's skills": "Abhinav is proficient in several programming languages including JavaScript, Python, and Java. He specializes in web development with frameworks like React, Vue.js, and has experience with backend technologies like Node.js and Express. He also has knowledge in machine learning and data science.",
      "what projects has abhinav worked on": "Abhinav has worked on several notable projects including a healthcare management system using AI, a real-time collaboration tool for developers, and an e-learning platform. Check out his experience section for more details.",
      "education": "Abhinav completed his Bachelor's degree in Computer Science from a prestigious university with honors. He has also taken various online courses to enhance his skills in specific areas of interest.",
      "contact": "You can reach out to Abhinav via email at abhinavpaidisetti@gmail.com or connect with him on LinkedIn. Check the contact section for more details.",
      "default": "I don't have specific information about that. Please ask me about Abhinav's skills, experience, education, or projects."
    };

    const lowerQuestion = question.toLowerCase();
    let response = "";
    
    if (lowerQuestion.includes("who is abhinav") || lowerQuestion.includes("about abhinav")) {
      response = responses["who is abhinav"];
    } else if (lowerQuestion.includes("skills") || lowerQuestion.includes("what can abhinav do")) {
      response = responses["what are abhinav's skills"];
    } else if (lowerQuestion.includes("projects") || lowerQuestion.includes("work")) {
      response = responses["what projects has abhinav worked on"];
    } else if (lowerQuestion.includes("education") || lowerQuestion.includes("study")) {
      response = responses["education"];
    } else if (lowerQuestion.includes("contact") || lowerQuestion.includes("email") || lowerQuestion.includes("reach")) {
      response = responses["contact"];
    } else {
      response = responses["default"];
    }

    return response;
  };

  const handleSendMessage = () => {
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
    
    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: simulateAIResponse(inputMessage),
        sender: "ai"
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
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
