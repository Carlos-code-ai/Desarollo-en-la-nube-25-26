
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { ref as dbRef, set, update, serverTimestamp, onValue, remove } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, googleProvider } from '../firebase.js';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  // This effect runs once on mount to set up the auth state listener.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // We create a new object to ensure that components depending on the user state will re-render.
      setUser(currentUser ? { ...currentUser } : null);
      if (!currentUser) {
          setFavorites(new Set());
      }
      // We only stop loading on the initial auth state check.
      if (loading) setLoading(false);
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This effect manages fetching user-specific data like favorites.
  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }

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

  // Function to force a refresh of the user's profile data.
  const forceRefreshUser = async () => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.reload();
        const refreshedUser = auth.currentUser;
        // Create a new object to ensure React recognizes the state change.
        setUser({ ...refreshedUser });
      } catch (error) {
        console.error("Error reloading user data:", error);
      }
    }
  };

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
    } finally {
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

  // Note: updateUserProfileAndPhoto is kept for other potential uses but is not used by the new ProfileScreen
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
      // The onAuthStateChanged listener will now pick up the changes automatically.
      forceRefreshUser();

    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
      user,
      loading,
      favorites,
      toggleFavorite,
      signInWithGoogle,
      logout,
      forceRefreshUser, // Export the new function
      updateUserProfileAndPhoto
  };
};

export default useAuth;
