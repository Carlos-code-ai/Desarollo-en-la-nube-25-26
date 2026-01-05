import React, { useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import HangerIcon from '@mui/icons-material/Checkroom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion } from 'framer-motion';

// Import the real data components
import MyItemsPage from './MyItemsPage.js';
import MyFavoritesPage from './MyFavoritesPage.js';
import MyRentalsPage from './MyRentalsPage.js';

// --- Reusable Components ---
const ProfileHeader = ({ user, onLogout }) => {
    // ... (same as before)
    return (
        <header className="relative flex justify-center items-center flex-col w-full text-center p-6 bg-surface-container-lowest pt-20">
            <motion.button 
                onClick={onLogout} 
                className="absolute top-4 right-4 p-2 rounded-full text-error" 
                aria-label="Cerrar sesión"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                <LogoutIcon />
            </motion.button>
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
    // ... (same as before)
    const tabIconProps = (tabName) => ({
        onClick: () => setActiveTab(tabName),
        color: activeTab === tabName ? 'primary' : 'default',
        "aria-label": tabName,
    });

    return (
        <nav className="w-full border-b border-outline/20 flex justify-around sticky top-0 bg-surface z-10">
            <motion.div whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300 } }}>
                <motion.div
                    animate={{ rotate: activeTab === 'wardrobe' ? [0, -10, 10, -5, 5, 0] : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <IconButton {...tabIconProps('wardrobe')}>
                        <HangerIcon />
                    </IconButton>
                </motion.div>
            </motion.div>
            
            <motion.div whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300 } }}>
                 <motion.div
                    animate={{ scale: activeTab === 'favorites' ? [1, 1.2, 1, 1.1, 1] : 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <IconButton {...tabIconProps('favorites')}>
                        <FavoriteIcon />
                    </IconButton>
                </motion.div>
            </motion.div>

            <motion.div whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300 } }}>
                <motion.div
                    animate={{ x: activeTab === 'orders' ? [0, -3, 3, -2, 2, 0] : 0 }}
                    transition={{ duration: 0.5, repeat: 0 }}
                >
                    <IconButton {...tabIconProps('orders')}>
                        <LocalShippingIcon />
                    </IconButton>
                </motion.div>
            </motion.div>
        </nav>
    );
};


// --- Main Profile Screen Component ---

const ProfileScreen = ({ favorites, onToggleFavorite, onSuitSelect }) => {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('wardrobe');

  const handleLogout = async () => {
      await logout(); 
      navigate('/');
  };

  const handleAddSuitClick = () => {
      navigate('/add-suit');
  }

  const renderTabContent = () => {
      switch(activeTab) {
          case 'wardrobe':
              return <MyItemsPage onAddSuitClick={handleAddSuitClick} onSuitSelect={onSuitSelect} />;
          case 'favorites':
              return <MyFavoritesPage favorites={favorites} onToggleFavorite={onToggleFavorite} onSuitSelect={onSuitSelect} />;
          case 'orders':
              return <MyRentalsPage />;
          default:
              return <MyItemsPage onAddSuitClick={handleAddSuitClick} onSuitSelect={onSuitSelect} />;
      }
  }

  if (authLoading) {
    return <div className="w-full flex-grow flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div></div>;
  }

  if (!user) {
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
