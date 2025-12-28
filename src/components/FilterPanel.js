
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'rc-slider'; // CORRECTED: Import the default Slider component
import 'rc-slider/assets/index.css'; // CORRECTED: Use the correct CSS path

// A single filter chip component
const FilterChip = ({ label, isSelected, onClick }) => (
    <motion.button
        onClick={onClick}
        className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors duration-200 ${isSelected ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-high border-outline/30 text-on-surface'}`}
        whileTap={{ scale: 0.95 }}
    >
        {label}
    </motion.button>
);

// The main filter panel component
const FilterPanel = ({ isOpen, onClose, availableFilters, activeFilters: initialActiveFilters, priceFilter: initialPriceFilter, onApplyFilters }) => {
    
    const [activeFilters, setActiveFilters] = useState(initialActiveFilters || {});
    const [currentPrice, setCurrentPrice] = useState(initialPriceFilter || 500);

    useEffect(() => {
        setActiveFilters(initialActiveFilters || {});
    }, [initialActiveFilters]);

    useEffect(() => {
        setCurrentPrice(initialPriceFilter || 500);
    }, [initialPriceFilter]);

    const handleToggleFilter = (category, value) => {
        setActiveFilters(prev => {
            const currentCategoryFilters = prev[category] || [];
            const newCategoryFilters = currentCategoryFilters.includes(value)
                ? currentCategoryFilters.filter(item => item !== value)
                : [...currentCategoryFilters, value];
            return { ...prev, [category]: newCategoryFilters };
        });
    };

    const handleApply = () => {
        onApplyFilters(activeFilters, currentPrice);
        onClose();
    };

    const minPrice = 0;
    const maxPrice = availableFilters.maxPrice > 0 ? availableFilters.maxPrice : 500;
    const safeCurrentPrice = Math.min(currentPrice, maxPrice);

    return (
        <AnimatePresence>
            {isOpen && (
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

                        <div className="flex-grow p-6 overflow-y-auto space-y-8">
                            <div>
                                <h3 className="font-semibold mb-4">Precio Máximo</h3>
                                <div className="px-2">
                                    {/* CORRECTED: Use Slider component with the 'range' prop */}
                                    <Slider
                                        range // Use the range prop to create a range slider
                                        min={minPrice}
                                        max={maxPrice}
                                        value={[minPrice, safeCurrentPrice]}
                                        onChange={value => setCurrentPrice(value[1])}
                                        allowCross={false}
                                        trackStyle={[{ backgroundColor: '#6750A4' }]}
                                        handleStyle={[{ borderColor: '#6750A4' }, { borderColor: '#6750A4' }]}
                                    />
                                </div>
                                <p className="text-center mt-3 font-medium">Hasta {safeCurrentPrice}€</p>
                            </div>

                            {renderFilterSection('Tallas', 'sizes', availableFilters.sizes, activeFilters, handleToggleFilter)}
                            {renderFilterSection('Colores', 'colors', availableFilters.colors, activeFilters, handleToggleFilter)}
                            {renderFilterSection('Tipo de Evento', 'eventTypes', availableFilters.eventTypes, activeFilters, handleToggleFilter)}
                            {renderFilterSection('Estado', 'states', availableFilters.states, activeFilters, handleToggleFilter)}
                        </div>

                        <div className="p-4 border-t border-outline/20">
                            <button 
                                onClick={handleApply} 
                                className="w-full bg-primary text-on-primary font-bold py-3 rounded-full hover:opacity-90 transition-opacity"
                            >
                                Aplicar Filtros
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const renderFilterSection = (title, categoryKey, options, activeFilters, onToggle) => {
    if (!options || options.length === 0) return null;

    return (
        <div>
            <h3 className="font-semibold mb-4">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {options.map(option => (
                    <FilterChip 
                        key={option}
                        label={option}
                        isSelected={(activeFilters[categoryKey] || []).includes(option)}
                        onClick={() => onToggle(categoryKey, option)}
                    />
                ))}
            </div>
        </div>
    );
};

export default FilterPanel;
