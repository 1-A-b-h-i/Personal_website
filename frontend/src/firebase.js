import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your web app's Firebase configuration
// For development and testing only - replace with environment variables in production
const firebaseConfig = {
  apiKey: "AIzaSyDQjVVGOXvGqSOkGI5BlQYsJguU0AiKio8",
  authDomain: "portfolio-productivity-54549.firebaseapp.com",
  projectId: "portfolio-productivity-54549",
  storageBucket: "portfolio-productivity-54549.appspot.com",
  messagingSenderId: "197745049109",
  appId: "1:197745049109:web:f72b43ba91cb78e890d81c",
  measurementId: "G-JYSJJN2767"
};

// Initialize Firebase
let app, db, auth, functions;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  functions = getFunctions(app);
  
  // Connect to emulators if running locally
  if (window.location.hostname === "localhost") {
    console.log("Running on localhost");
  }
  
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { db, auth, functions }; 