import React, { useState } from 'react';

// Firebase and Auth
import { auth, googleProvider, db } from './firebase.js';
import { signInWithPopup, signOut } from 'firebase/auth';
import { ref, push } from 'firebase/database';
import useAuth from './hooks/useAuth.js';

// --- Main Components ---
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import BottomNavBar from './components/BottomNavBar.js';

// --- Page/View Components ---
import Catalog from './components/Catalog.js';
import SuitDetailPage from './components/SuitDetailPage.js';
import SearchPage from './components/SearchPage.js';
import MessagesPage from './components/MessagesPage.js';
import ProfilePage from './components/ProfilePage.js';
import MyItemsPage from './components/MyItemsPage.js';
import MyRentalsPage from './components/MyRentalsPage.js'; // <-- 1. IMPORTAR

// --- Helper Components ---
import Modal from './components/Modal.js';
import AddSuitForm from './components/AddSuitForm.js';

// Login Screen Component
const LoginScreen = ({ onLogin }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-background">
    <div className="text-center p-8">
      <h1 className="text-5xl font-bold tracking-tight text-on-surface mb-4">
        Ready<span className="text-primary">2</span>Wear
      </h1>
      <p className="text-lg text-on-surface-variant mb-8">
        Tu guardarropa de lujo, a un solo clic.
      </p>
      <button
        onClick={onLogin}
        className="rounded-full bg-primary px-8 py-3 text-lg font-semibold text-on-primary shadow-lg hover:scale-105 transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Empezar con Google
      </button>
    </div>
  </div>
);

// Main App Component
function App() {
  const { user, loading } = useAuth();
  
  // --- State Management ---
  const [activeView, setActiveView] = useState('home');
  const [selectedSuitId, setSelectedSuitId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // --- Handlers ---
  const handleSignIn = async () => {
    try { await signInWithPopup(auth, googleProvider); } catch (error) { console.error("Error signing in:", error); }
  };

  const handleSignOut = async () => {
    try { 
      await signOut(auth);
      setSelectedSuitId(null);
      setActiveView('home');
    } catch (error) { console.error("Error signing out:", error); }
  };

  const handleAddSuit = async (suitData) => {
    if (!user) {
        console.error("Error: El usuario debe estar autenticado para añadir un traje.");
        return;
    }
    try {
      const suitsRef = ref(db, 'trajes');
      const newSuitData = {
        ...suitData,
        ownerId: user.uid, 
        ownerName: user.displayName,
        ownerPhotoURL: user.photoURL,
        createdAt: new Date().toISOString(),
      };
      await push(suitsRef, newSuitData);
      setIsModalOpen(false); 
      setActiveView('home');
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleNavClick = (view) => {
    setSelectedSuitId(null);
    setActiveView(view);
  }
  
  const handleSuitSelect = (suitId) => {
    setSelectedSuitId(suitId);
    setActiveView('detail');
  }

  const handleBackToCatalog = () => {
    setSelectedSuitId(null);
    setActiveView('home');
  }

  // --- Render Logic ---
  const renderContent = () => {
    if (activeView === 'detail' && selectedSuitId) {
      return <SuitDetailPage suitId={selectedSuitId} onBack={handleBackToCatalog} />;
    }
    switch (activeView) {
      case 'home':
        return <Catalog onSuitSelect={handleSuitSelect} />;
      case 'search':
        return <SearchPage />;
      case 'messages':
        return <MessagesPage />;
      case 'profile':
        return <ProfilePage onNavClick={handleNavClick} />;
      case 'my-items':
        return <MyItemsPage />;
      case 'my-rentals': // <-- 2. AÑADIR CONDICIÓN
        return <MyRentalsPage />;
      default:
        return <Catalog onSuitSelect={handleSuitSelect} />;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleSignIn} />;
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header 
        user={user} 
        onLogout={handleSignOut} 
        onAddSuitClick={() => setIsModalOpen(true)}
      />
      
      <main className="flex-grow container mx-auto p-4 pt-24 md:pt-28 pb-20">
        {renderContent()}
      </main>
      
      <Footer />

      <BottomNavBar 
        activeView={activeView} 
        onNavClick={handleNavClick}
        onAddClick={() => setIsModalOpen(true)}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddSuitForm 
          onAdd={handleAddSuit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default App;
