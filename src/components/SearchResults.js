
import React from 'react';
import SuitCard from './SuitCard'; // Corrected import
import { motion, AnimatePresence } from 'framer-motion';

const SearchResults = ({ results, loading, onResultClick }) => {

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {[...Array(8)].map((_, i) => <SuitCard.Skeleton key={i} />) /* Corrected usage */}
            </div>
        );
    }

    if (results.length === 0) {
        return <div className="text-center py-10 text-on-surface-variant">No se encontraron resultados.</div>;
    }

    return (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            <AnimatePresence>
                {results.map(suit => (
                    <SuitCard key={suit.id} suit={suit} />
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export default SearchResults;
