import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { ref as dbRef, set, update, serverTimestamp } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, googleProvider, storage } from '../firebase.js';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateUserProfileInDB = async (user) => {
    if (!user) return;
    const userRef = dbRef(db, 'users/' + user.uid); 
    await set(userRef, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp(), 
    });
  };

  const updateUserProfileAndPhoto = async (newName, imageFile) => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      let photoURL = auth.currentUser.photoURL;

      if (imageFile) {
        const imageRef = storageRef(storage, `profile-images/${auth.currentUser.uid}`);
        await uploadBytes(imageRef, imageFile);
        photoURL = await getDownloadURL(imageRef);
      }

      await updateProfile(auth.currentUser, {
        displayName: newName,
        photoURL: photoURL,
      });

      const userRef = dbRef(db, 'users/' + auth.currentUser.uid);
      await update(userRef, {
        displayName: newName,
        photoURL: photoURL,
      });

      setUser({ ...auth.currentUser, displayName: newName, photoURL });

    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await updateUserProfileInDB(result.user);
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

  return { user, loading, signInWithGoogle, logout, updateUserProfileAndPhoto };
};

export default useAuth;
