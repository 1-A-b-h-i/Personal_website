const { exec } = require('child_process');
require('dotenv').config();

// Get the Gemini API key from .env
const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;

if (!geminiApiKey) {
  console.error('Error: REACT_APP_GEMINI_API_KEY not found in .env file');
  process.exit(1);
}

// Set the environment variable for Firebase Functions
console.log('Setting GEMINI_API_KEY for Firebase Functions...');
exec(`firebase functions:config:set gemini.key="${geminiApiKey}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }
  console.log(`Success: ${stdout}`);
}); 