
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// The main filter panel component, simplified to match HomePage's state
const FilterPanel = ({ filters, onFilterChange, onClearFilters, onClose }) => {

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onFilterChange(prev => ({ ...prev, [name]: value }));
    };

    const handleClear = () => {
        onClearFilters();
    };

    const handleApply = () => {
        onClose(); // Just close the panel, filters are applied live
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 flex justify-end"
                onClick={onClose}
            >
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="w-full max-w-sm h-full bg-surface-container-low text-on-surface flex flex-col shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center p-4 border-b border-outline/20">
                        <h2 className="text-xl font-bold">Filtros</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
                            <span className="material-icons-outlined">close</span>
                        </button>
                    </div>

                    <div className="flex-grow p-6 overflow-y-auto space-y-6">
                        <div>
                            <label htmlFor="size" className="block text-sm font-medium text-on-surface-variant mb-2">Talla</label>
                            <input
                                type="text"
                                id="size"
                                name="size"
                                value={filters.size || ''}
                                onChange={handleInputChange}
                                placeholder="Ej: 48, L, etc."
                                className="w-full px-3 py-2 rounded-lg bg-surface-container-high border-2 border-transparent focus:border-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-on-surface-variant mb-2">Ciudad</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={filters.city || ''}
                                onChange={handleInputChange}
                                placeholder="Ej: Madrid"
                                className="w-full px-3 py-2 rounded-lg bg-surface-container-high border-2 border-transparent focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="p-4 border-t border-outline/20 grid grid-cols-2 gap-4">
                        <button
                            onClick={handleClear}
                            className="w-full bg-surface-container-high text-on-surface font-bold py-3 rounded-full hover:bg-primary/10 transition-colors"
                        >
                            Limpiar
                        </button>
                        <button
                            onClick={handleApply}
                            className="w-full bg-primary text-on-primary font-bold py-3 rounded-full hover:opacity-90 transition-opacity"
                        >
                            Aplicar
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FilterPanel;
