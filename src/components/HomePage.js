
import React, { useState } from 'react';
import useAllItems from '../hooks/useAllItems.js';
import SuitCard from './SuitCard.js'; // CORRECTED: Import only the default export
import SearchBar from './SearchBar.js';
import SortBy from './SortBy.js';
import FilterPanel from './FilterPanel.js';
import { AnimatePresence, motion } from 'framer-motion';

const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [filters, setFilters] = useState({ size: '', city: '' });
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    const { items: allSuits, loading, error } = useAllItems();

    const processedSuits = React.useMemo(() => {
        let filtered = allSuits;

        if (searchTerm) {
            filtered = filtered.filter(suit =>
                suit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                suit.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filters.size) {
            filtered = filtered.filter(suit => suit.size.toLowerCase() === filters.size.toLowerCase());
        }

        if (filters.city) {
             filtered = filtered.filter(suit => suit.location.toLowerCase().includes(filters.city.toLowerCase()));
        }

        const sorted = [...filtered].sort((a, b) => {
            switch (sortOrder) {
                case 'priceAsc': return a.price - b.price;
                case 'priceDesc': return b.price - a.price;
                case 'newest':
                default: return b.createdAt - a.createdAt;
            }
        });

        return sorted;
    }, [allSuits, searchTerm, sortOrder, filters]);


    if (error) return <div className="text-center py-10 text-error">Error al cargar. Por favor, intenta de nuevo.</div>;

    return (
        <div className="w-full p-4">
            <div className="mb-6 sticky top-20 md:top-24 bg-background z-10 py-2">
                 <div className="max-w-4xl mx-auto">
                    <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
                    <div className="flex items-center justify-between mt-4 text-sm">
                         <button 
                            onClick={() => setIsFilterPanelOpen(true)} 
                            className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full font-semibold hover:bg-primary/10 transition-colors"
                        >
                            <span className="material-icons-outlined">filter_list</span>
                            Filtros
                        </button>
                        <SortBy sortOrder={sortOrder} onSortChange={setSortOrder} />
                    </div>
                </div>
            </div>

             {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
                    {/* CORRECTED: Use Skeleton as a property of SuitCard */}
                    {[...Array(10)].map((_, i) => <SuitCard.Skeleton key={i} />)}
                </div>
            ) : (
                <motion.div 
                    layout 
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto"
                >
                    <AnimatePresence>
                        {processedSuits.map(suit => (
                            <SuitCard key={suit.id} suit={suit} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
            {processedSuits.length === 0 && !loading && (
                 <div className="text-center py-20">
                    <h3 className="text-xl font-semibold text-on-surface">No se encontraron trajes</h3>
                    <p className="text-on-surface-variant mt-2">Intenta ajustar tu búsqueda o filtros.</p>
                </div>
            )}

            <AnimatePresence>
                {isFilterPanelOpen && (
                    <FilterPanel 
                        filters={filters} 
                        onFilterChange={setFilters} 
                        onClose={() => setIsFilterPanelOpen(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default HomePage;
