import React, { useState } from 'react';
import useAllItems from '../hooks/useAllItems.js';
import SuitCard from './SuitCard.js';
import SortBy from './SortBy.js';
import FilterPanel from './FilterPanel.js';
import { AnimatePresence, motion } from 'framer-motion';

const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [filters, setFilters] = useState({ size: '', city: '' });
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    const { items: allSuits, loading, error } = useAllItems();

    const handleClearFilters = () => {
        setFilters({ size: '', city: '' });
    };

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
                default: return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        return sorted;
    }, [allSuits, searchTerm, sortOrder, filters]);


    if (error) return <div className="text-center py-10 text-error">Error al cargar. Por favor, intenta de nuevo.</div>;

    return (
    <div className="w-full min-h-screen bg-[#f8f9fa]">
        {/* 1. ESPACIADOR: Esto empuja el contenido debajo del Navbar fijo */}
        <div className="h-24 md:h-28"></div> 

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* 2. CABECERA: Título y botones bien alineados */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Todos los Trajes
                </h1>
                
                <div className="flex items-center gap-3">
                    <SortBy sortOrder={sortOrder} onSortChange={setSortOrder} />
                    
                    <button
                        onClick={() => setIsFilterPanelOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all font-medium text-gray-700"
                    >
                        <span className="material-icons-outlined text-gray-500 text-[20px]">tune</span>
                        <span>Filtros</span>
                    </button>
                </div>
            </div>

            {/* 3. GRID: Asegúrate de que tenga suficiente margen inferior */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, i) => <SuitCard.Skeleton key={i} />)}
                </div>
            ) : (
                <motion.div 
                    layout 
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-24"
                >
                    <AnimatePresence>
                        {processedSuits.map(suit => (
                            <SuitCard key={suit.id} suit={suit} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>

        {/* Panel de Filtros */}
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
