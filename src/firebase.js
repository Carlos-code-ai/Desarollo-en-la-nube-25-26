
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Use Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyD8GWx4ry3hgM6jV0qtTMHBrT7JoWHQCAk",
  authDomain: "desarollogit-68916509-89c54.firebaseapp.com",
  databaseURL: "https://desarollogit-68916509-89c54-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "desarollogit-68916509-89c54",
  storageBucket: "desarollogit-68916509-89c54.firebasestorage.app",
  messagingSenderId: "464708937070",
  appId: "1:464708937070:web:41e91b162694b2bb7c8d7f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
// IMPORTANT: Initialize Realtime Database and export it as 'db'
export const db = getDatabase(app); 
export const googleProvider = new GoogleAuthProvider();
