import React, { useMemo } from 'react';
import useRealtimeDB from '../hooks/useRealtimeDB.js';
import SuitCard, { SuitCardSkeleton } from './SuitCard.js';
import useSuitAnimations from '../hooks/useSuitAnimations.js';

const MyFavoritesPage = ({ favorites, onSuitSelect, onToggleFavorite }) => {
  const { docs: allSuits, loading, error } = useRealtimeDB('trajes');
  const { containerRef } = useSuitAnimations();

  const favoriteSuits = useMemo(() => {
    if (!favorites || allSuits.length === 0) {
      return [];
    }
    return allSuits.filter(suit => favorites.has(suit.id));
  }, [allSuits, favorites]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => <SuitCardSkeleton key={index} />)}
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-error">Error al cargar tus favoritos.</p>;
    }

    if (favoriteSuits.length === 0) {
      return (
        <div className="text-center py-16 px-6 bg-surface-container rounded-3xl">
          <h2 className="text-xl font-semibold text-on-surface">Aún no tienes favoritos</h2>
          <p className="text-on-surface-variant mt-2">Haz clic en el corazón de los trajes que te gusten para guardarlos aquí.</p>
        </div>
      );
    }

    return (
      <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {favoriteSuits.map(suit => (
          <SuitCard 
            key={suit.id} 
            suit={suit} 
            onSelect={onSuitSelect} 
            isFavorite={true} // Siempre es favorito en esta página
            onToggleFavorite={onToggleFavorite} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-on-background">Mis Favoritos</h1>
        <p className="mt-1 text-lg text-on-surface-variant">Los trajes que más te han gustado, todos en un mismo lugar.</p>
      </header>
      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default MyFavoritesPage;
