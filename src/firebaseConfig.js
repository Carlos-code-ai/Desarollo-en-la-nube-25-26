
// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

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

// Get a reference to the services
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { database, auth, storage, app };
