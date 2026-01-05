
import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { AnimatePresence } from 'framer-motion';
import useAuth from './hooks/useAuth.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import HomePage from './components/HomePage.js';
import SearchResults from './components/SearchResults.js';
import SuitDetailPage from './components/SuitDetailPage.js';
import LoginScreen from './components/LoginScreen.js';
import ProfileScreen from './components/ProfileScreen.js';
import AddSuitPage from './components/AddSuitPage.js';
import EditSuitPage from './components/EditSuitPage.js';
import MyItemsPage from './components/MyItemsPage.js';
import MyFavoritesPage from './components/MyFavoritesPage.js';
import MyRentalsPage from './components/MyRentalsPage.js';
import MessagesPage from './components/MessagesPage.js';
import PublicProfilePage from './components/PublicProfilePage.js';
import FloatingActionButton from './components/FloatingActionButton.js';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ user, children }) => {
    if (!user) {
        // Si no hay usuario, redirige a la página de login
        return <Navigate to="/login" replace />;
    }
    return children;
};

const App = () => {
    const { user, loading } = useAuth(getAuth());
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

    if (loading) {
        return (
            <div className="w-screen h-screen bg-surface grid place-items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // El botón flotante solo es visible si el usuario ha iniciado sesión
    const fabVisible = user && ['/', '/search', '/profile', '/my-items', '/my-rentals', '/favorites'].includes(location.pathname);

    return (
        <div className="bg-background text-on-background min-h-screen flex flex-col font-sans">
            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} user={user} />
            <main className="flex-grow w-full pt-20">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        {/* --- Rutas Públicas --- */}
                        <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/suit/:suitId" element={<SuitDetailPage />} />
                        <Route path="/user/:userId" element={<PublicProfilePage />} />
                        <Route path="/login" element={<LoginScreen />} />

                        {/* --- Rutas Protegidas --- */}
                        <Route path="/profile" element={<ProtectedRoute user={user}><ProfileScreen /></ProtectedRoute>} />
                        <Route path="/add-suit" element={<ProtectedRoute user={user}><AddSuitPage /></ProtectedRoute>} />
                        <Route path="/edit-suit/:suitId" element={<ProtectedRoute user={user}><EditSuitPage /></ProtectedRoute>} />
                        <Route path="/my-items" element={<ProtectedRoute user={user}><MyItemsPage /></ProtectedRoute>} />
                        <Route path="/my-rentals" element={<ProtectedRoute user={user}><MyRentalsPage /></ProtectedRoute>} />
                        <Route path="/favorites" element={<ProtectedRoute user={user}><MyFavoritesPage /></ProtectedRoute>} />
                        <Route path="/messages" element={<ProtectedRoute user={user}><MessagesPage /></ProtectedRoute>}>
                            <Route path=":chatId" element={<ProtectedRoute user={user}><MessagesPage /></ProtectedRoute>} />
                        </Route>
                    </Routes>
                </AnimatePresence>
            </main>
            {fabVisible && <FloatingActionButton />}
            <Footer />
        </div>
    );
};

export default App;
