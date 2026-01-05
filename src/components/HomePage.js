import React, { useState } from 'react';
import useAllItems from '../hooks/useAllItems.js';
import SuitCard from './SuitCard.js';
import SortBy from './SortBy.js';
import FilterPanel from './FilterPanel.js';
import { AnimatePresence, motion } from 'framer-motion';

const HomePage = ({ searchQuery }) => {
    const [sortOrder, setSortOrder] = useState('newest');
    const [filters, setFilters] = useState({ size: '', status: '', eventType: '', priceRange: [0, 500] });
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    const { items: allSuits, loading, error } = useAllItems();

    const handleClearFilters = () => {
        setFilters({ size: '', status: '', eventType: '', priceRange: [0, 500] });
    };

    const processedSuits = React.useMemo(() => {
        let filtered = allSuits;

        // Text search
        if (searchQuery) {
            const lowerCaseSearch = searchQuery.toLowerCase();
            filtered = filtered.filter(suit =>
                suit.name.toLowerCase().includes(lowerCaseSearch) ||
                suit.description.toLowerCase().includes(lowerCaseSearch)
            );
        }

        // Filter by properties
        Object.keys(filters).forEach(key => {
            if (key === 'priceRange') {
                if (filters.priceRange) {
                    filtered = filtered.filter(suit => suit.price >= filters.priceRange[0] && suit.price <= filters.priceRange[1]);
                }
            } else if (filters[key]) {
                filtered = filtered.filter(suit => suit[key] && suit[key].toLowerCase() === filters[key].toLowerCase());
            }
        });

        // Sorting
        const sorted = [...filtered].sort((a, b) => {
            switch (sortOrder) {
                case 'priceAsc': return a.price - b.price;
                case 'priceDesc': return b.price - a.price;
                case 'newest':
                default: return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        return sorted;
    }, [allSuits, searchQuery, sortOrder, filters]);

    if (error) return <div className="text-center py-10 text-error">Error al cargar. Por favor, intenta de nuevo.</div>;

    return (
    <div className="w-full min-h-screen bg-surface-container-lowest">
        <div className="h-24 md:h-28"></div> 

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <SortBy sortOrder={sortOrder} onSortChange={setSortOrder} />
                    
                    <motion.button
                        onClick={() => setIsFilterPanelOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-outline/30 rounded-full shadow-sm font-semibold text-on-surface-variant"
                        whileHover={{ scale: 1.05, y: -2, shadow: "md" }}
                        whileTap={{ scale: 0.98, y: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                        <motion.span 
                            className="material-icons-outlined"
                            animate={{ rotate: isFilterPanelOpen ? 45 : 0}}
                            transition={{duration: 0.3}}
                        >
                            tune
                        </motion.span>
                        <span>Filtros</span>
                    </motion.button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                    {[...Array(9)].map((_, i) => <SuitCard.Skeleton key={i} />)}
                </div>
            ) : (
                <motion.div 
                    layout 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 pb-24"
                >
                    <AnimatePresence>
                        {processedSuits.map(suit => (
                            <SuitCard key={suit.id} suit={suit} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>

        <AnimatePresence>
            {isFilterPanelOpen && (
                <FilterPanel 
                    filters={filters} 
                    onFilterChange={setFilters} 
                    onClearFilters={handleClearFilters} 
                    onClose={() => setIsFilterPanelOpen(false)} 
                />
            )}
        </AnimatePresence>
    </div>
);
};

export default HomePage;
