import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Generate a secure session ID
export const createChatSession = () => {
  const sessionId = uuidv4();
  return { sessionId };
};

// Store message in Firestore and fetch response using client API key
export const sendChatMessage = async (message, sessionId) => {
  try {
    // Store message in Firestore
    const chatRef = collection(db, 'chat_sessions');
    await addDoc(chatRef, {
      message,
      sessionId,
      timestamp: new Date(),
      isUser: true
    });

    // Call Gemini API directly (requires setting up proper API key security)
    // For security, use a Firebase Callable Function or a backend API with auth
    // This is a simplified example - in production, you'd need proper API key security
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // In production, DO NOT expose API key in frontend code
        // Use Firebase Functions HTTP triggers or Cloud Run with Firebase Auth
        'x-goog-api-key': process.env.REACT_APP_GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: message }]
        }]
      })
    });

    const result = await response.json();
    const aiResponse = result.candidates[0].content.parts[0].text;

    // Store AI response
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
    console.error('Error in chat:', error);
    return {
      response: "I'm having trouble processing your request right now.",
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