/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API with environment variable
const config = functions.config();
const GEMINI_API_KEY = config.gemini?.key || process.env.GEMINI_API_KEY;

// Set up CORS
const cors = require('cors')({ origin: true });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

/**
 * Secure Cloud Function to handle Gemini API requests
 */
exports.processGeminiMessage = onRequest({ cors: true }, async (req, res) => {
  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Get request data
    const { message, history, systemPrompt } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a chat session
    let chat;
    if (systemPrompt) {
      chat = model.startChat({
        history: history || [],
        systemInstruction: systemPrompt,
      });
    } else {
      chat = model.startChat({
        history: history || []
      });
    }

    // Generate response
    const response = await chat.sendMessage(message);
    const responseText = response.response.text();

    // Return response
    return res.status(200).json({
      response: responseText,
      success: true
    });
  } catch (error) {
    logger.error("Error processing Gemini request:", error);
    return res.status(500).json({
      error: `Error processing request: ${error.message}`,
      success: false
    });
  }
});
