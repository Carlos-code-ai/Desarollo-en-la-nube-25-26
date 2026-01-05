import React from 'react';
import { motion } from 'framer-motion';
import ReactSlider from 'react-slider';

const FilterPanel = ({ filters, onFilterChange, onClearFilters, onClose }) => {
    const handleOptionChange = (filterName, value) => {
        onFilterChange(prev => ({
            ...prev,
            [filterName]: prev[filterName] === value ? '' : value
        }));
    };

    const handlePriceChange = (value) => {
        onFilterChange(prev => ({ ...prev, priceRange: value }));
    };

    const renderOptions = (filterName, options) => (
        <div className="space-y-3">
            <h3 className="font-semibold text-lg text-on-surface-variant">{filterName.charAt(0).toUpperCase() + filterName.slice(1)}</h3>
            <div className="flex flex-wrap gap-2 justify-center">
                {options.map(option => (
                    <motion.button
                        key={option}
                        type="button"
                        onClick={() => handleOptionChange(filterName, option)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            filters[filterName] === option
                                ? 'bg-primary text-on-primary shadow-md'
                                : 'bg-surface-container-high hover:bg-primary/10'
                        }`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95, y: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                        {option}
                    </motion.button>
                ))}
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end"
            onClick={onClose}
        >
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                className="w-full max-w-sm h-full bg-surface-container-low text-on-surface flex flex-col shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-outline/20">
                    <h2 className="text-xl font-bold">Filtros</h2>
                    <motion.button
                        onClick={onClose}
                        className="p-2 rounded-full"
                        whileHover={{ scale: 1.2, rotate: 90, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        whileTap={{ scale: 0.9, rotate: 0 }}
                    >
                        <span className="material-icons-outlined">close</span>
                    </motion.button>
                </div>

                <div className="flex-grow p-6 overflow-y-auto space-y-8">
                    {renderOptions('size', ['XS', 'S', 'M', 'L', 'XL', 'XXL'])}
                    {renderOptions('Estado', ['Nuevo', 'Usado', 'Casi Nuevo', 'Con Defectos'])}
                    {renderOptions('Tipo de Evento', ['Boda', 'Gala', 'Fiesta', 'Negocios', 'Casual', 'Otros'])}
                    <div>
                        <h3 className="font-semibold text-lg text-on-surface-variant mb-4">Precio</h3>
                        <ReactSlider
                            className="w-full h-5 pr-2.5"
                            thumbClassName="h-5 w-5 bg-primary rounded-full cursor-grab -top-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transform-gpu transition-transform"
                            trackClassName="h-3 bg-surface-container-highest rounded-full top-1/2 -translate-y-1/2"
                            min={0}
                            max={500}
                            value={filters.priceRange}
                            onChange={handlePriceChange}
                            ariaLabel={['Lower thumb', 'Upper thumb']}
                            pearling
                            minDistance={10}
                        />
                        <div className="flex justify-between text-sm text-on-surface-variant mt-2">
                            <span>{filters.priceRange[0]}€</span>
                            <span>{filters.priceRange[1]}€</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-outline/20 grid grid-cols-2 gap-4">
                    <motion.button
                        onClick={onClearFilters}
                        className="w-full bg-surface-container-high text-on-surface font-bold py-3 rounded-full"
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98, y: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                        Limpiar
                    </motion.button>
                    <motion.button
                        onClick={onClose}
                        className="w-full bg-primary text-on-primary font-bold py-3 rounded-full shadow-lg"
                        whileHover={{ scale: 1.03, y: -2, filter: 'brightness(1.1)' }}
                        whileTap={{ scale: 0.98, y: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                        Aplicar
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default FilterPanel;