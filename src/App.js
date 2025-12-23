import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Firebase and Auth
import { db } from './firebase.js';
import { ref, onValue, set, remove } from 'firebase/database';
import useAuth from './hooks/useAuth.js';

// --- Main Components ---
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import BottomNavBar from './components/BottomNavBar.js';
import LoginScreen from './components/LoginScreen.js';

// --- Page/View Components ---
import SearchPage from './components/SearchPage.js';
import SuitDetailPage from './components/SuitDetailPage.js';
import MessagesPage from './components/MessagesPage.js';
import ProfilePage from './components/ProfilePage.js';
import MyItemsPage from './components/MyItemsPage.js';
import MyRentalsPage from './components/MyRentalsPage.js';
import MyFavoritesPage from './components/MyFavoritesPage.js';

// Main App Component
function App() {
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();

  // --- Firebase Listener (Favorites) ---
  useEffect(() => {
    if (!user) {
      setFavorites(new Set());
      return;
    }

    const favoritesRef = ref(db, `users/${user.uid}/favorites`);
    const unsubscribe = onValue(favoritesRef, (snapshot) => {
      const data = snapshot.val();
      setFavorites(new Set(data ? Object.keys(data) : []));
    });

    return () => unsubscribe();
  }, [user]);

  // --- Handlers ---
  const handleToggleFavorite = async (suitId) => {
    if (!user) return;
    const favoriteRef = ref(db, `users/${user.uid}/favorites/${suitId}`);
    if (favorites.has(suitId)) {
      await remove(favoriteRef);
    } else {
      await set(favoriteRef, true);
    }
  };

  const handleSuitSelect = (suitId) => {
    navigate(`/suit/${suitId}`);
  }

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  const commonSearchPageProps = {
      onSuitSelect: handleSuitSelect,
      favorites: favorites,
      onToggleFavorite: handleToggleFavorite,
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto p-4 pt-24 md:pt-28 pb-20">
        <Routes>
          <Route path="/" element={<SearchPage {...commonSearchPageProps} />} />
          <Route path="/search" element={<SearchPage {...commonSearchPageProps} />} />
          <Route path="/suit/:suitId" element={<SuitDetailPage favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/my-items" element={<MyItemsPage />} />
          <Route path="/my-rentals" element={<MyRentalsPage />} />
          <Route path="/favorites" element={<MyFavoritesPage {...commonSearchPageProps} />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      
      <Footer />
      <BottomNavBar />
    </div>
  );
}

export default App;
