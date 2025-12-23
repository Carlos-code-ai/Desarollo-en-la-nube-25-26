
import { initializeApp } from "firebase/app";
// 1. Importar GoogleAuthProvider
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5XbrF9jZJQ1fL3vjYJ5nI1dJ_r3e-vWc",
  authDomain: "desarollogit-68916509-89c54.firebaseapp.com",
  projectId: "desarollogit-68916509-89c54",
  storageBucket: "desarollogit-68916509-89c54.appspot.com",
  messagingSenderId: "84128038339",
  appId: "1:84128038339:web:96500284b7a13825313f96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// 2. Crear y exportar la instancia del proveedor de Google
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore
export const db = getFirestore(app);
