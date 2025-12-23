
import { useState, useEffect } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from '../firebase.js';

/**
 * Hook de React para gestionar el estado de autenticación y el perfil de usuario.
 */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged es un observador que escucha los cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Limpiamos el observador cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  /**
   * Actualiza o crea el perfil del usuario en la colección 'users' de Firestore.
   * @param {object} user - El objeto de usuario de Firebase Auth.
   */
  const updateUserProfile = async (user) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    
    await setDoc(userRef, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp(), // Guardamos la fecha del último login
    }, { merge: true }); // 'merge: true' evita sobreescribir otros campos como 'favorites'
  };

  /**
   * Inicia el proceso de inicio de sesión con el pop-up de Google.
   */
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await updateUserProfile(result.user); // Guardamos el perfil en Firestore
    } catch (error) {
      console.error("Error durante el inicio de sesión con Google:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cierra la sesión del usuario.
   */
  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return { user, loading, signInWithGoogle, logOut };
};

export default useAuth;
