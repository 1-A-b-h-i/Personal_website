const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('./firebase-credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadWebsiteData() {
  try {
    console.log('Reading website_data.json...');
    const websiteData = JSON.parse(fs.readFileSync('./website_data.json', 'utf8'));
    
    console.log('Uploading to Firestore...');
    // Upload to 'website_data/main_data' document
    await db.collection('website_data').doc('main_data').set(websiteData);
    
    console.log('Website data uploaded successfully!');
    
    // Set proper security rules for all collections
    console.log('Note: Make sure your Firestore security rules allow reading these collections');
    console.log('Example rules:\n');
    console.log(`
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Allow public read access to website data
        match /website_data/{document=**} {
          allow read: if true;
          allow write: if request.auth != null;
        }
        
        // Allow public read access to blog posts
        match /blog_posts/{document=**} {
          allow read: if true;
          allow write: if request.auth != null;
        }
        
        // Allow public read access to knowledge chunks
        match /knowledge_chunks/{document=**} {
          allow read: if true;
          allow write: if request.auth != null;
        }
        
        // Allow public read/write for chat
        match /chat_sessions/{document=**} {
          allow read, write: if true;
        }
        
        // Allow public write for contacts
        match /contacts/{document=**} {
          allow read: if request.auth != null;
          allow write: if true;
        }
      }
    }
    `);
    
  } catch (error) {
    console.error('Error uploading website data:', error);
  }
}

// Check if knowledge.json exists in the backend and copy it to frontend
function copyKnowledgeJson() {
  const backendPath = path.join(__dirname, 'backend', 'knowledge.json');
  const frontendPath = path.join(__dirname, 'frontend', 'src', 'data', 'knowledge.json');
  
  try {
    if (fs.existsSync(backendPath)) {
      console.log('Copying knowledge.json from backend to frontend...');
      
      // Create directory if it doesn't exist
      const frontendDir = path.dirname(frontendPath);
      if (!fs.existsSync(frontendDir)) {
        fs.mkdirSync(frontendDir, { recursive: true });
      }
      
      fs.copyFileSync(backendPath, frontendPath);
      console.log(`Knowledge file copied to ${frontendPath}`);
      
      // Also, let's process the knowledge file into chunks for RAG
      processKnowledgeForRAG(backendPath);
    } else {
      console.log('knowledge.json not found in backend directory');
    }
  } catch (error) {
    console.error('Error copying knowledge.json:', error);
  }
}

// Process knowledge.json into chunks and upload to Firestore
async function processKnowledgeForRAG(knowledgePath) {
  try {
    console.log('Processing knowledge.json for RAG...');
    
    if (!fs.existsSync(knowledgePath)) {
      console.log('knowledge.json not found at:', knowledgePath);
      return;
    }
    
    const knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
    
    // Create chunks from knowledge data
    const chunks = [];
    
    // Process basic info
    if (knowledge.basic_info) {
      chunks.push({
        type: 'basic_info',
        content: JSON.stringify(knowledge.basic_info),
        metadata: { section: 'basic_info' }
      });
    }
    
    // Process experience details
    if (knowledge.experience_details) {
      knowledge.experience_details.forEach((exp, index) => {
        chunks.push({
          type: 'experience',
          content: `Role: ${exp.title} at ${exp.company} (${exp.period}). ${exp.description}. Skills: ${exp.technologies.join(', ')}`,
          metadata: { section: 'experience', index }
        });
      });
    }
    
    // Process achievements
    if (knowledge.achievements_details) {
      knowledge.achievements_details.forEach((achievement, index) => {
        chunks.push({
          type: 'achievement',
          content: `Achievement: ${achievement.title} (${achievement.date}). ${achievement.description}`,
          metadata: { section: 'achievements', index }
        });
      });
    }
    
    // Process education
    if (knowledge.education) {
      knowledge.education.forEach((edu, index) => {
        chunks.push({
          type: 'education',
          content: `Education: ${edu.degree} from ${edu.school} (${edu.period}). ${edu.location || ''}`,
          metadata: { section: 'education', index }
        });
      });
    }
    
    // Process skills
    if (knowledge.skills) {
      Object.entries(knowledge.skills).forEach(([category, skillList]) => {
        chunks.push({
          type: 'skills',
          content: `Skills in ${category}: ${skillList.join(', ')}`,
          metadata: { section: 'skills', category }
        });
      });
    }
    
    // Process projects
    if (knowledge.projects) {
      knowledge.projects.forEach((project, index) => {
        chunks.push({
          type: 'project',
          content: `Project: ${project.name}. ${project.description}. Technologies: ${project.technologies.join(', ')}`,
          metadata: { section: 'projects', index }
        });
      });
    }

    // Process personal interests
    if (knowledge.personal_interests) {
      chunks.push({
        type: 'personal_interests',
        content: `Personal interests: ${knowledge.personal_interests.join(', ')}`,
        metadata: { section: 'personal_interests' }
      });
    }

    // Process hobbies
    if (knowledge.hobbies_details) {
      Object.entries(knowledge.hobbies_details).forEach(([hobby, description]) => {
        chunks.push({
          type: 'hobbies',
          content: `${hobby}: ${description}`,
          metadata: { section: 'hobbies', category: hobby }
        });
      });
    }
    
    console.log(`Created ${chunks.length} knowledge chunks for RAG`);
    
    // Upload chunks to Firestore
    console.log('Uploading knowledge chunks to Firestore...');
    
    const batch = db.batch();
    
    chunks.forEach((chunk, index) => {
      const docRef = db.collection('knowledge_chunks').doc(`chunk_${index}`);
      batch.set(docRef, {
        ...chunk,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    await batch.commit();
    
    console.log('Knowledge chunks uploaded successfully!');
    
  } catch (error) {
    console.error('Error processing knowledge for RAG:', error);
  }
}

// Run the script
async function main() {
  try {
    await uploadWebsiteData();
    copyKnowledgeJson();
    
    console.log('Process completed successfully!');
    console.log('You can now delete the backend directory if desired.');
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    // Exit the process when done
    setTimeout(() => process.exit(0), 2000);
  }
}

main(); 