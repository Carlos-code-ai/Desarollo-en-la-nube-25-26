import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAllItems from '../hooks/useAllItems';
import SuitCard from './SuitCard';
import FilterPanel from './FilterPanel';
import SearchBar from './SearchBar';
import SortBy from './SortBy';
import { motion, AnimatePresence } from 'framer-motion';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
    const { suits, loading, error } = useAllItems();
    const [filteredSuits, setFilteredSuits] = useState([]);
    
    const navigate = useNavigate();
    const query = useQuery();
    const searchTerm = query.get('q') || '';

    // States for filters
    const [filters, setFilters] = useState({
        size: '',
        color: '',
        priceRange: [0, 500],
        available: false,
    });
    const [sort, setSort] = useState('price-asc');

    useEffect(() => {
        let processedSuits = [...suits];

        // 1. Filter by search term (if it exists)
        if (searchTerm) {
            processedSuits = processedSuits.filter(suit => 
                suit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                suit.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                suit.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Apply advanced filters
        processedSuits = processedSuits.filter(suit => {
            if (filters.size && suit.size !== filters.size) return false;
            if (filters.color && !suit.color.toLowerCase().includes(filters.color.toLowerCase())) return false;
            if (suit.price < filters.priceRange[0] || suit.price > filters.priceRange[1]) return false;
            // `available` filter logic can be added here if availability data is present
            return true;
        });

        // 3. Apply sorting
        processedSuits.sort((a, b) => {
            switch (sort) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                default: return 0;
            }
        });

        setFilteredSuits(processedSuits);

    }, [suits, searchTerm, filters, sort]);

    const handleSearch = (term) => {
        navigate(`/search?q=${encodeURIComponent(term)}`);
    };

    if (error) {
        return <div className="text-center py-10 text-error">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters and Search Column */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-8">
                         <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
                         <FilterPanel filters={filters} onFilterChange={setFilters} />
                         <SortBy sort={sort} onSortChange={setSort} />
                    </div>
                </div>

                {/* Results Column */}
                <div className="lg:col-span-3">
                    <h1 className="text-2xl font-bold text-on-surface mb-4">
                        {searchTerm ? `Resultados para "${searchTerm}"` : 'Explorar todos los trajes'}
                    </h1>
                    
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {[...Array(9)].map((_, i) => <SuitCard.Skeleton key={i} />)}
                        </div>
                    ) : (
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredSuits.length > 0 ? (
                                    filteredSuits.map(suit => (
                                        <SuitCard key={suit.id} suit={suit} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-12 text-on-surface-variant">
                                        <p>No se encontraron trajes que coincidan con tus criterios.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
