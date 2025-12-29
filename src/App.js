
import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { AnimatePresence } from 'framer-motion';

import useAuth from './hooks/useAuth.js';

import Header from './components/Header.js';
import Footer from './components/Footer.js';
import HomePage from './components/HomePage.js';
import SuitDetailPage from './components/SuitDetailPage.js';
import LoginScreen from './components/LoginScreen.js';
import ProfileScreen from './components/ProfileScreen.js';
import AddSuitPage from './components/AddSuitPage.js';
import MyItemsPage from './components/MyItemsPage.js';
import MessagesPage from './components/MessagesPage.js';
import FloatingActionButton from './components/FloatingActionButton.js';

const App = () => {
    const { user, loading } = useAuth(getAuth());
    const location = useLocation();

    if (loading) {
        return <div className="w-screen h-screen bg-background grid place-items-center"><div className="loader"></div></div>;
    }

    if (!user) {
        return <LoginScreen />;
    }

    const showFab = location.pathname === '/' || location.pathname === '/profile';

    return (
        <div className="bg-background text-on-background min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-grow w-full">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route 
                            path="/"
                            element={<HomePage />}
                        />
                        <Route path="/suit/:suitId" element={<SuitDetailPage />} />
                        <Route path="/profile" element={<ProfileScreen />} />
                        <Route path="/add-suit" element={<AddSuitPage />} />
                        <Route path="/my-items" element={<MyItemsPage />} />
                        <Route path="/messages" element={<MessagesPage />} />
                    </Routes>
                </AnimatePresence>
            </main>
            {showFab && <FloatingActionButton />}
            <Footer />
        </div>
    );
}

export default App;
