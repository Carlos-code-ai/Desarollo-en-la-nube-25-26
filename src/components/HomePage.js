
import React, { useState, useMemo } from 'react';
import useAllItems from '../hooks/useAllItems.js';
import SuitCard from './SuitCard.js';
import SortBy from './SortBy.js';
import FilterPanel from './FilterPanel.js';
import { AnimatePresence, motion } from 'framer-motion';

const HomePage = ({ searchQuery, onSearchClear }) => {
    const [sortOrder, setSortOrder] = useState('newest');
    const [filters, setFilters] = useState({});
    const [isFilterPanelOpen, setFilterPanelOpen] = useState(false);
    const { items: allSuits, loading, error } = useAllItems();

    const handleClearSearch = () => {
        onSearchClear();
        setFilters({});
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        setFilterPanelOpen(false);
    };

    const handleClearFilters = () => {
        setFilters({});
    };

    const processedSuits = useMemo(() => {
        let filtered = [...allSuits];

        // Combined text search
        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(suit => 
                Object.values(suit).some(val => 
                    String(val).toLowerCase().includes(lowercasedQuery)
                )
            );
        }

        // Advanced filters
        Object.entries(filters).forEach(([key, value]) => {
            if (!value) return;
            
            if (key === 'price' && Array.isArray(value)) {
                filtered = filtered.filter(suit => suit.price >= value[0] && suit.price <= value[1]);
            } else if (typeof value === 'string') {
                 filtered = filtered.filter(suit => 
                    suit[key]?.toString().toLowerCase().includes(value.toLowerCase())
                );
            }
        });

        // Sorting
        const sorted = filtered.sort((a, b) => {
            switch (sortOrder) {
                case 'priceAsc': return a.price - b.price;
                case 'priceDesc': return b.price - a.price;
                case 'newest':
                default:
                    const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : 0;
                    const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : 0;
                    return dateB - dateA;
            }
        });

        return sorted;
    }, [allSuits, searchQuery, sortOrder, filters]);

    if (error) return <div className="text-center py-10 text-error">Error al cargar. Por favor, intenta de nuevo.</div>;

    return (
        <div className="w-full min-h-screen bg-surface-container-lowest">
             <div className="h-24 md:h-28"></div> 
             <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end gap-3 mb-6">
                    <button 
                        onClick={() => setFilterPanelOpen(!isFilterPanelOpen)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-surface-container-high text-on-surface-variant rounded-full hover:bg-surface-variant active:bg-surface-container-highest transition-all duration-200 shadow-sm"
                    >
                        <span className="material-icons text-base">filter_list</span>
                        Filtros
                    </button>
                    <SortBy sortOrder={sortOrder} onSortChange={setSortOrder} />
                </div>

                <AnimatePresence>
                    {isFilterPanelOpen && (
                        <FilterPanel 
                            onApply={handleApplyFilters} 
                            onClear={handleClearFilters} 
                            initialFilters={filters}
                            onClose={() => setFilterPanelOpen(false)}
                        />
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                        {[...Array(12)].map((_, i) => <SuitCard.Skeleton key={i} />)}
                    </div>
                ) : (
                    <motion.div 
                        layout 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 pb-24"
                    >
                        <AnimatePresence>
                            {processedSuits.length > 0 ? (
                                processedSuits.map(suit => <SuitCard key={suit.id} suit={suit} />)
                            ) : (
                                <div className="col-span-full text-center py-20">
                                    <h3 className="text-2xl font-semibold text-on-surface">No se encontraron resultados</h3>
                                    <p className="text-on-surface-variant mt-4">Intenta ajustar tu búsqueda o filtros.</p>
                                     <button onClick={handleClearSearch} className="mt-8 px-8 py-3 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:bg-primary/90 active:scale-95 transform transition-all duration-200">
                                        Limpiar Todo
                                    </button>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
