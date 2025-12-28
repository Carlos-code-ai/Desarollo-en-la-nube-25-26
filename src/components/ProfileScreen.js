import React, { useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import HangerIcon from '@mui/icons-material/Checkroom'; // Using Checkroom for hanger
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { motion } from 'framer-motion';

// Import the real data components we already fixed
import MyItemsPage from './MyItemsPage.js';
import MyFavoritesPage from './MyFavoritesPage.js';
import MyRentalsPage from './MyRentalsPage.js';

// --- Reusable Components ---
const ProfileHeader = ({ user, onLogout }) => {
    const navigate = useNavigate();
    return (
        <header className="relative flex justify-center items-center flex-col w-full text-center p-6 bg-surface-container-lowest">
            <button onClick={onLogout} className="absolute top-4 right-4 p-2 rounded-full hover:bg-on-surface/10 transition-colors" aria-label="Cerrar sesión">
                <span className="material-icons">logout</span>
            </button>
            <div className="relative w-28 h-28">
                <img 
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'U'}&background=random`}
                    alt="Foto de perfil" 
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                />
            </div>
            <div className="mt-4 flex items-center gap-2">
                <h1 className="text-2xl font-bold text-on-surface">{user?.displayName || 'Nombre de Usuario'}</h1>
            </div>
            <p className="text-on-surface-variant">{user?.email}</p>
        </header>
    );
};

const ProfileTabs = ({ activeTab, setActiveTab }) => {
    const iconVariants = {
        inactive: {
            scale: 1,
            rotate: 0
        },
        active: {
            scale: 1.2,
            rotate: [0, -10, 10, -10, 10, 0],
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <nav className="w-full border-b border-outline/20 flex justify-around sticky top-0 bg-surface z-10">
            <motion.div
                animate={activeTab === 'wardrobe' ? 'active' : 'inactive'}
                variants={iconVariants}
            >
                <IconButton onClick={() => setActiveTab('wardrobe')} color={activeTab === 'wardrobe' ? 'primary' : 'default'} aria-label="inventory_2">
                    <HangerIcon />
                </IconButton>
            </motion.div>
            <motion.div
                animate={activeTab === 'favorites' ? 'active' : 'inactive'}
                variants={iconVariants}
            >
                <IconButton onClick={() => setActiveTab('favorites')} color={activeTab === 'favorites' ? 'primary' : 'default'} aria-label="favorite">
                    <FavoriteIcon />
                </IconButton>
            </motion.div>
            <motion.div
                animate={activeTab === 'orders' ? 'active' : 'inactive'}
                variants={iconVariants}
            >
                <IconButton onClick={() => setActiveTab('orders')} color={activeTab === 'orders' ? 'primary' : 'default'} aria-label="local_shipping">
                    <LocalShippingIcon />
                </IconButton>
            </motion.div>
        </nav>
    );
};


// --- Main Profile Screen Component (Now a Container) ---

const ProfileScreen = ({ favorites, onToggleFavorite, onSuitSelect }) => {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('wardrobe');

  const handleLogout = async () => {
      await logout(); 
      navigate('/');
  };

  const renderTabContent = () => {
      switch(activeTab) {
          case 'wardrobe':
              return <MyItemsPage />;
          case 'favorites':
              // MyFavoritesPage needs the list of favorite IDs and the toggle function
              return <MyFavoritesPage favorites={favorites} onToggleFavorite={onToggleFavorite} onSuitSelect={onSuitSelect} />;
          case 'orders':
              return <MyRentalsPage />;
          default:
              return <MyItemsPage />;
      }
  }

  if (authLoading) {
    return <div className="w-full flex-grow flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div></div>;
  }

  if (!user) {
      // This should ideally not happen if routes are protected, but as a fallback:
      navigate('/login');
      return null; 
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center pb-12 min-h-screen bg-surface-container-low">
        <ProfileHeader user={user} onLogout={handleLogout} />
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="w-full p-4 sm:p-6">
            {renderTabContent()}
        </main>
    </div>
  );
};

export default ProfileScreen;
