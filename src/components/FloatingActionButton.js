import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingActionButton = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    const handleClick = () => {
        navigate('/add-suit');
    };

    useEffect(() => {
        const handleScroll = () => {
            // Show icon-only button if user has scrolled more than 50px
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.button
            onClick={handleClick}
            className="fixed bottom-8 right-8 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg focus:outline-none z-40"
            aria-label="Añadir nuevo traje"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
            style={{ overflow: 'hidden' }} // Prevents content from spilling out during animation
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={isScrolled ? 'icon' : 'extended'}
                    className="flex items-center justify-center px-6 h-16"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    {isScrolled ? (
                        <span className="material-icons text-3xl">add</span>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="material-icons">add</span>
                            <span className="font-semibold whitespace-nowrap">Añadir traje</span>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.button>
    );
};

export default FloatingActionButton;
