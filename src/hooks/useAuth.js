import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
// Import Realtime Database functions
import { ref, set, serverTimestamp } from "firebase/database"; 
import { auth, db, googleProvider } from '../firebase.js';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateUserProfile = async (user) => {
    if (!user) return;
    // Use Realtime Database `ref` function
    const userRef = ref(db, 'users/' + user.uid); 
    // Use Realtime Database `set` function
    await set(userRef, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      // Use Realtime Database `serverTimestamp`
      lastLogin: serverTimestamp(), 
    });
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // The profile update will now work with Realtime Database
      await updateUserProfile(result.user);
    } catch (error) {
      console.error("Error durante el inicio de sesión con Google:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return { user, loading, signInWithGoogle, logout };
};

export default useAuth;
