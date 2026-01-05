import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SORT_OPTIONS = {
    newest: 'Más Recientes',
    priceAsc: 'Precio: de Menor a Mayor',
    priceDesc: 'Precio: de Mayor a Menor',
};

const SortBy = ({ sortOrder, onSortChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleOptionClick = (option) => {
        onSortChange(option);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-on-surface-variant rounded-full font-semibold shadow-sm hover:bg-surface-container-highest transition-colors duration-200"
            >
                <span className="material-icons-outlined text-xl">sort</span>
                <span className="hidden md:inline">Ordenar por</span>
                <span className="material-icons-outlined transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    expand_more
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="absolute right-0 md:right-0 mt-2 w-64 bg-surface-container-low rounded-lg shadow-xl z-10 overflow-hidden border border-outline/20"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                    >
                        <ul className="text-on-surface">
                            {Object.entries(SORT_OPTIONS).map(([key, value]) => (
                                <li key={key}>
                                    <button 
                                        onClick={() => handleOptionClick(key)}
                                        className={`w-full text-left px-4 py-3 text-sm flex justify-between items-center transition-colors duration-150 ${sortOrder === key ? 'bg-primary/20 text-primary-dark' : 'hover:bg-primary/10'}`}>
                                        <span>{value}</span>
                                        {sortOrder === key && <span className="material-icons-outlined">check</span>}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SortBy;
