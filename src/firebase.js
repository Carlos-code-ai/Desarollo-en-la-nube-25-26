import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA5XbrF9jZJQ1fL3vjYJ5nI1dJ_r3e-vWc",
  authDomain: "desarollogit-68916509-89c54.firebaseapp.com",
  databaseURL: "https://desarollogit-68916509-89c54-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "desarollogit-68916509-89c54",
  storageBucket: "desarollogit-68916509-89c54.appspot.com",
  messagingSenderId: "84128038339",
  appId: "1:84128038339:web:96500284b7a13825313f96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);
