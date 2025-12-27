
import React from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';

// Firebase and Auth
import useAuth from './hooks/useAuth.js';

// --- Main Components ---
import Header from './components/Header.js';
import LoginScreen from './components/LoginScreen.js';
import FloatingActionButton from './components/FloatingActionButton.js';
import Footer from './components/Footer.js';

// --- Page/View Components ---
import SearchPage from './components/SearchPage.js';
import SuitDetailPage from './components/SuitDetailPage.js';
import MessagesPage from './components/MessagesPage.js';
import ProfileScreen from './components/ProfileScreen.js';
import MyItemsPage from './components/MyItemsPage.js';
import MyRentalsPage from './components/MyRentalsPage.js';
import MyFavoritesPage from './components/MyFavoritesPage.js';
import AddSuitPage from './components/AddSuitPage.js';
import PublicProfilePage from './components/PublicProfilePage.js';

// Wrapper component to correctly pass route params as props
const SuitDetailPageWrapper = (props) => {
    const { suitId } = useParams();
    const navigate = useNavigate();
    return <SuitDetailPage suitId={suitId} {...props} onBack={() => navigate(-1)} />;
};

// Main App Component
function App() {
  const { user, loading, favorites, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  const handleSuitSelect = (suitId) => {
    if (suitId) {
        navigate(`/suit/${suitId}`);
    } else {
        console.error("handleSuitSelect called with an invalid suitId:", suitId);
    }
  };

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
      onToggleFavorite: toggleFavorite,
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header favoritesCount={favorites.size} />
      
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 pt-24 md:pt-28">
        <Routes>
          <Route path="/" element={<SearchPage {...suitListProps} />} />
          <Route path="/search" element={<SearchPage {...suitListProps} />} />
          <Route 
            path="/suit/:suitId" 
            element={<SuitDetailPageWrapper favorites={favorites} onToggleFavorite={toggleFavorite} />} 
          />
          <Route path="/add-suit" element={<AddSuitPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:chatId" element={<MessagesPage />} />
          <Route path="/my-items" element={<MyItemsPage />} />
          <Route path="/my-rentals" element={<MyRentalsPage />} />
          <Route path="/favorites" element={<MyFavoritesPage {...suitListProps} />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/user/:userId" element={<PublicProfilePage />} />
        </Routes>
      </main>
      
      <FloatingActionButton />
      <Footer />
    </div>
  );
}

export default App;
