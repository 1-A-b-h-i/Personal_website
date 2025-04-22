import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
// Get this from Firebase Console → Project Settings → Your Apps → SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJWmYtYz_8sYZa-i5vAcWWTXs8NsZBBuY",
  authDomain: "portfolio-productivity-54549.firebaseapp.com",
  projectId: "portfolio-productivity-54549",
  storageBucket: "portfolio-productivity-54549.appspot.com",
  messagingSenderId: "639414436908",
  appId: "1:639414436908:web:df1c7a12b6b6e6c1d8cc84"
};

// Initialize Firebase
console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = getFunctions(app);

console.log("Firebase initialized successfully");

export { db, functions }; 