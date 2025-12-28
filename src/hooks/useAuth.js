
import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { ref as dbRef, set, update, serverTimestamp, onValue, remove } from "firebase/database";
import { auth, rtdb, googleProvider } from '../firebase.js';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({ ...currentUser });

        const favoritesRef = dbRef(rtdb, `users/${currentUser.uid}/favorites`);
        const unsubscribeFavorites = onValue(favoritesRef, (snapshot) => {
          const favsData = snapshot.val();
          setFavorites(new Set(favsData ? Object.keys(favsData) : []));
          setLoading(false);
        }, (error) => {
          console.error("Error fetching favorites: ", error);
          setLoading(false);
        });

        return () => unsubscribeFavorites();

      } else {
        setUser(null);
        setFavorites(new Set());
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const forceRefreshUser = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await currentUser.reload();
        setUser({ ...auth.currentUser });
      } catch (error) {
        console.error("Error reloading user data:", error);
      }
    }
  }, []);

  const updateUserProfileInDB = (userData) => {
    if (!userData) return;
    const userRef = dbRef(rtdb, 'users/' + userData.uid);
    return update(userRef, {
        displayName: userData.displayName,
        email: userData.email,
        photoURL: userData.photoURL,
        lastLogin: serverTimestamp(),
    });
  };

  const toggleFavorite = useCallback(async (suitId) => {
      if (!user) return;
      const favRef = dbRef(rtdb, `users/${user.uid}/favorites/${suitId}`);
      if (favorites.has(suitId)) {
          await remove(favRef);
      } else {
          await set(favRef, true);
      }
  }, [user, favorites]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const userRef = dbRef(rtdb, 'users/' + result.user.uid);
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
      forceRefreshUser
  };
};

export default useAuth;
