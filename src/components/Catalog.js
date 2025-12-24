
import React, { useState, useMemo } from 'react';
import useRealtimeDB from '../hooks/useRealtimeDB.js';
import useSuitAnimations from '../hooks/useSuitAnimations.js';
import SuitCard, { SuitCardSkeleton } from './SuitCard.js';

const SortDropdown = ({ sortOption, setSortOption }) => {
    const [isOpen, setIsOpen] = useState(false);
    const options = {
        newest: 'Novedades',
        priceAsc: 'Precio: Menor a Mayor',
        priceDesc: 'Precio: Mayor a Menor',
    };

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-surface-container px-4 py-2.5 text-sm font-semibold text-on-surface shadow-sm ring-1 ring-inset ring-outline hover:bg-surface-container-high transition-all duration-200"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {options[sortOption]}
                    <span className="material-icons -mr-1 h-5 w-5 text-on-surface-variant" aria-hidden="true">expand_more</span>
                </button>
            </div>

            {isOpen && (
                <div
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-surface-container-low shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-down-fast"
                    role="menu"
                    aria-orientation="vertical"
                >
                    <div className="py-1">
                        {Object.keys(options).map((key) => (
                            <button
                                key={key}
                                onClick={() => { setSortOption(key); setIsOpen(false); }}
                                className={`${(key === sortOption) ? 'bg-primary/20 text-primary' : 'text-on-surface-variant'} group flex items-center w-full px-4 py-2 text-sm text-left hover:bg-primary/10 hover:text-primary transition-colors`}
                                role="menuitem"
                            >
                                {options[key]}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

const Catalog = ({ onSuitSelect }) => {
  const { docs: suits, loading, error } = useRealtimeDB('trajes');
  const { containerRef } = useSuitAnimations();
  const [sortOption, setSortOption] = useState('newest');

  const sortedSuits = useMemo(() => {
    let sorted = [...suits];
    switch (sortOption) {
      case 'priceAsc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }
    return sorted;
  }, [suits, sortOption]);

  const renderContent = () => {
    if (error) return <p>Error al cargar.</p>;
    if (loading) return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => <SuitCardSkeleton key={index} />)}
        </div>
    );
    if (suits.length === 0) return <p>No hay trajes disponibles.</p>;
    
    return (
      <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedSuits.map(suit => (
          <SuitCard key={suit.id} suit={suit} onSelect={onSuitSelect} />
        ))}
      </div>
    );
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-on-surface sm:text-5xl">
            Catálogo
            </h2>
            <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
        </div>
        {renderContent()}
      </div>
    </section>
  );
};

export default Catalog;
