
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD8GWx4ry3hgM6jV0qtTMHBrT7JoWHQCAk",
  authDomain: "desarollogit-68916509-89c54.firebaseapp.com",
  databaseURL: "https://desarollogit-68916509-89c54-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "desarollogit-68916509-89c54",
  storageBucket: "desarollogit-68916509-89c54.appspot.com",
  messagingSenderId: "464708937070",
  appId: "1:464708937070:web:41e91b162694b2bb7c8d7f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app); // For Firestore
export const rtdb = getDatabase(app); // For Realtime Database
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
