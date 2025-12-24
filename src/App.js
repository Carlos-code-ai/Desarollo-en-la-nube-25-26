
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';

// Firebase and Auth
import { db } from './firebase.js';
import { ref, onValue, set, remove } from 'firebase/database';
import useAuth from './hooks/useAuth.js';

// --- Main Components ---
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import LoginScreen from './components/LoginScreen.js';
import FloatingActionButton from './components/FloatingActionButton.js';

// --- Page/View Components ---
import SearchPage from './components/SearchPage.js';
import SuitDetailPage from './components/SuitDetailPage.js';
import MessagesPage from './components/MessagesPage.js';
import ProfileScreen from './components/ProfileScreen.js';
import MyItemsPage from './components/MyItemsPage.js';
import MyRentalsPage from './components/MyRentalsPage.js';
import MyFavoritesPage from './components/MyFavoritesPage.js';
import AddSuitPage from './components/AddSuitPage.js';
import EditProfilePage from './components/EditProfilePage.js';
import PublicProfilePage from './components/PublicProfilePage.js';

// Wrapper component to correctly pass route params as props to SuitDetailPage
const SuitDetailPageWrapper = (props) => {
    const { suitId } = useParams();
    const navigate = useNavigate();
    return <SuitDetailPage suitId={suitId} {...props} onBack={() => navigate(-1)} />;
};

// Main App Component
function App() {
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();

  // --- Firebase Listener for Favorites ---
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
    if (suitId) {
        navigate(`/suit/${suitId}`);
    } else {
        console.error("handleSuitSelect called with an invalid suitId:", suitId);
    }
  };

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

  const suitListProps = {
      onSuitSelect: handleSuitSelect,
      favorites: favorites,
      onToggleFavorite: handleToggleFavorite,
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header favoritesCount={favorites.size} />
      
      <main className="flex-grow container mx-auto p-4 pt-24 md:pt-28">
        <Routes>
          <Route path="/" element={<SearchPage {...suitListProps} />} />
          <Route path="/search" element={<SearchPage {...suitListProps} />} />
          <Route 
            path="/suit/:suitId" 
            element={<SuitDetailPageWrapper favorites={favorites} onToggleFavorite={handleToggleFavorite} />} 
          />
          <Route path="/add-suit" element={<AddSuitPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:chatId" element={<MessagesPage />} />
          <Route path="/my-items" element={<MyItemsPage />} />
          <Route path="/my-rentals" element={<MyRentalsPage />} />
          <Route path="/favorites" element={<MyFavoritesPage {...suitListProps} />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/user/:userId" element={<PublicProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
        </Routes>
      </main>
      
      <div className="fixed bottom-16 right-16 z-40">
        <FloatingActionButton />
      </div>
      
      <Footer />
    </div>
  );
}

export default App;
