
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAllItems from '../hooks/useAllItems';
import SuitCard from './SuitCard';
import SortBy from './SortBy';
import { motion, AnimatePresence } from 'framer-motion';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
    const { items: suits, loading, error } = useAllItems();
    const navigate = useNavigate();
    const query = useQuery();
    const searchTerm = query.get('q') || '';

    useEffect(() => {
        if (!searchTerm) {
            navigate('/');
        }
    }, [searchTerm, navigate]);

    const [sort, setSort] = useState('price-asc');

    const searchedSuits = useMemo(() => {
        let results = [];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = suits.filter(suit => {
                const inName = suit.name.toLowerCase().includes(term);
                const inBrand = suit.brand?.toLowerCase().includes(term);
                const inDescription = suit.description?.toLowerCase().includes(term);
                return inName || inBrand || inDescription;
            });
        }
        
        return results.sort((a, b) => {
            switch (sort) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                default: return 0;
            }
        });
    }, [suits, searchTerm, sort]);

    if (error) {
        return <div className="text-center py-10 text-error">Error: {error}</div>;
    }
    
    if (!searchTerm) {
        return null; // No renderizar nada mientras se redirige
    }

    return (
        <div className="container mx-auto px-4 py-8">
             <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-bold text-on-surface">
                    Resultados para \"{searchTerm}\"
                </h1>
                <SortBy sort={sort} onSortChange={setSort} />
            </div>

            <main>
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(12)].map((_, i) => <SuitCard.Skeleton key={i} />)}
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {searchedSuits.length > 0 ? (
                                searchedSuits.map(suit => (
                                    <SuitCard key={suit.id} suit={suit} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 text-on-surface-variant">
                                    <p>No se encontraron trajes que coincidan con tu búsqueda.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default SearchResults;
