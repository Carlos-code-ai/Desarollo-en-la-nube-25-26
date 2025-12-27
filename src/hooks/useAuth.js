import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { ref as dbRef, set, update, serverTimestamp, onValue, remove } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, googleProvider } from '../firebase.js';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
          setFavorites(new Set());
          setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }

    setLoading(true);
    const favoritesRef = dbRef(db, `users/${user.uid}/favorites`);
    
    const unsubscribeFavorites = onValue(favoritesRef, (snapshot) => {
      const favs = snapshot.val();
      setFavorites(new Set(favs ? Object.keys(favs) : []));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching favorites: ", error);
      setLoading(false);
    });

    return () => unsubscribeFavorites();
  }, [user]);

  const updateUserProfileInDB = async (userData) => {
    if (!userData) return;
    const userRef = dbRef(db, 'users/' + userData.uid);
    return update(userRef, {
        displayName: userData.displayName,
        email: userData.email,
        photoURL: userData.photoURL,
        lastLogin: serverTimestamp(),
    });
  };

  const updateUserProfileAndPhoto = async (newName, imageFile) => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      let photoURL = auth.currentUser.photoURL;

      if (imageFile) {
        const imageRef = storageRef(getStorage(), `profile-images/${auth.currentUser.uid}`);
        await uploadBytes(imageRef, imageFile);
        photoURL = await getDownloadURL(imageRef);
      }

      await updateProfile(auth.currentUser, { displayName: newName, photoURL: photoURL });

      await updateUserProfileInDB({ ...auth.currentUser, displayName: newName, photoURL });

      setUser(prevUser => ({ ...prevUser, displayName: newName, photoURL }));

    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (suitId) => {
      if (!user) return;
      const favRef = dbRef(db, `users/${user.uid}/favorites/${suitId}`);
      if (favorites.has(suitId)) {
          await remove(favRef);
      } else {
          await set(favRef, true);
      }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const userRef = dbRef(db, 'users/' + result.user.uid);
        onValue(userRef, (snapshot) => {
            if (!snapshot.exists()) {
                updateUserProfileInDB(result.user);
            }
        }, { onlyOnce: true });
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
      user,
      loading,
      favorites,
      toggleFavorite,
      signInWithGoogle,
      logout,
      updateUserProfileAndPhoto
  };
};

export default useAuth;
