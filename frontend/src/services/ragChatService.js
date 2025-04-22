import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Generate a secure session ID
export const createChatSession = () => {
  const sessionId = localStorage.getItem('chat_session_id') || uuidv4();
  localStorage.setItem('chat_session_id', sessionId);
  return { sessionId };
};

// Implement RAG-based chat functionality
export const sendRagChatMessage = async (message, sessionId) => {
  try {
    // Store user message in Firestore
    const chatRef = collection(db, 'chat_sessions');
    await addDoc(chatRef, {
      message,
      sessionId,
      timestamp: new Date(),
      isUser: true
    });
    
    // Get conversation history for context
    const history = await getChatHistory(sessionId);
    const conversationHistory = history.map(msg => ({
      role: msg.isUser ? "user" : "model",
      parts: [{ text: msg.message }]
    }));
    
    // Retrieve relevant knowledge chunks based on the query
    const relevantChunks = await retrieveRelevantChunks(message);
    
    // Create context from retrieved chunks
    let context = "";
    if (relevantChunks.length > 0) {
      context = "Here is some information that may help answer the question:\n\n" + 
        relevantChunks.map(chunk => chunk.content).join("\n\n");
    }
    
    // Create the system instructions
    const systemInstructions = `
    You are JARVIS, an advanced AI assistant for Abhinav Paidisetti's personal portfolio website.
    Your purpose is to provide comprehensive, detailed information about Abhinav's background, 
    skills, experience, education, projects, and other professional information ONLY when specifically asked.
    
    Key characteristics of your personality:
    - Professional and precise in your delivery
    - Confident but not boastful
    - Slightly witty and personable when appropriate
    - Thorough and comprehensive in your responses
    - Anticipatory of follow-up questions
    
    CRITICAL RULES:
    1. NEVER list or summarize skills, experiences, or qualifications unless directly asked. 
       Do not preemptively offer to explain skills or provide skill lists.
    2. DO NOT start your responses with lists of information you can provide.
    3. Represent skills accurately according to their prominence in Abhinav's experience.
    4. Never begin with phrases like "Based on the information provided, I can assist you..."
    
    When visitors ask about Abhinav, provide complete and detailed information rather than
    brief or modest answers. Don't hold back on showcasing his accomplishments, but only
    discuss skills and achievements when directly relevant to the question being asked.
    
    Begin conversations with "How may I assist you today?" or similar professional greetings.
    DO NOT immediately suggest topics about Abhinav or offer information categories.

    Be helpful, thorough, and personable in your responses.
    If you don't know something, be honest about it rather than making up information.
    Use a conversational tone that is reminiscent of JARVIS from Iron Man - efficient,
    intelligent, and slightly witty when appropriate.
    `;
    
    // Call Gemini API with context, history, and user message
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.REACT_APP_GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemInstructions }] },
          ...(context ? [{ role: "user", parts: [{ text: context }] }] : []),
          ...conversationHistory,
          { role: "user", parts: [{ text: message }] }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        }
      })
    });

    const result = await response.json();
    
    // Extract the AI response
    const aiResponse = result.candidates && result.candidates[0] && result.candidates[0].content && 
                      result.candidates[0].content.parts && result.candidates[0].content.parts[0].text
                      ? result.candidates[0].content.parts[0].text
                      : "I'm having trouble processing your request. Please try again.";

    // Store AI response in Firestore
    await addDoc(chatRef, {
      message: aiResponse,
      sessionId,
      timestamp: new Date(),
      isUser: false
    });

    return { 
      response: aiResponse,
      sessionId 
    };
  } catch (error) {
    console.error('Error in RAG chat:', error);
    return {
      response: "I'm having trouble processing your request right now. Please try again later.",
      sessionId,
      error: error.message
    };
  }
};

// Get chat history for a session
export const getChatHistory = async (sessionId) => {
  try {
    const chatQuery = query(
      collection(db, 'chat_sessions'),
      where('sessionId', '==', sessionId),
      orderBy('timestamp')
    );
    
    const querySnapshot = await getDocs(chatQuery);
    const messages = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return messages;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

// Clear chat history
export const clearChatHistory = async (sessionId) => {
  try {
    const chatQuery = query(
      collection(db, 'chat_sessions'),
      where('sessionId', '==', sessionId)
    );
    
    const querySnapshot = await getDocs(chatQuery);
    
    const deletePromises = [];
    querySnapshot.forEach((document) => {
      deletePromises.push(deleteDoc(doc(db, 'chat_sessions', document.id)));
    });
    
    await Promise.all(deletePromises);
    return { success: true };
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return { success: false, error: error.message };
  }
};

// Retrieve relevant knowledge chunks based on query
async function retrieveRelevantChunks(query) {
  try {
    // Get all knowledge chunks from Firestore
    const chunksCollection = collection(db, 'knowledge_chunks');
    const chunksSnapshot = await getDocs(chunksCollection);
    
    // Convert to array
    const chunks = chunksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Use Gemini model for embeddings API to find most similar chunks
    // This is a simplified approach - in a real implementation, we would use a vector database
    // But for this simplified version, we'll do a basic keyword matching
    
    // Convert query to lowercase for case-insensitive matching
    const queryLower = query.toLowerCase();
    
    // Extract keywords from the query (simple approach)
    const keywords = queryLower
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    // Score chunks based on keyword matches
    const scoredChunks = chunks.map(chunk => {
      const contentLower = chunk.content.toLowerCase();
      let score = 0;
      
      // Calculate score based on keyword matches
      keywords.forEach(keyword => {
        if (contentLower.includes(keyword)) {
          score += 1;
        }
      });
      
      return {
        ...chunk,
        score
      };
    });
    
    // Sort by score and take top 3
    const relevantChunks = scoredChunks
      .sort((a, b) => b.score - a.score)
      .filter(chunk => chunk.score > 0)
      .slice(0, 3);
    
    return relevantChunks;
  } catch (error) {
    console.error('Error retrieving relevant chunks:', error);
    return [];
  }
}; 