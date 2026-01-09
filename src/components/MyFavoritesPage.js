import React, { useMemo } from 'react';
import useRealtimeDB from '../hooks/useRealtimeDB.js';
import SuitCard from './SuitCard.js';
import useSuitAnimations from '../hooks/useSuitAnimations.js';
import useFavorites from '../hooks/useFavorites.js'; // 1. Importar el hook clave

// 2. El componente ya no acepta props relacionados con favoritos
const MyFavoritesPage = () => {
  const { docs: allSuits, loading, error } = useRealtimeDB('trajes');
  const { containerRef } = useSuitAnimations();
  
  // 3. Obtenemos los favoritos directamente desde el hook
  const { favorites } = useFavorites();

  const favoriteSuits = useMemo(() => {
    // La lógica de filtrado ahora usa la variable `favorites` del hook
    if (!favorites || allSuits.length === 0) {
      return [];
    }
    return allSuits.filter(suit => favorites.has(suit.id));
  }, [allSuits, favorites]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(3)].map((_, index) => <SuitCard.Skeleton key={index} />)}
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
      <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoriteSuits.map(suit => (
          // 4. SuitCard se llama de forma limpia, sin props de favoritos
          <SuitCard 
            key={suit.id} 
            suit={suit} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col space-y-8 px-4 sm:px-6 lg:px-8 py-8">
       <h1 className="text-3xl font-bold text-on-surface">Mis Favoritos</h1>
      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default MyFavoritesPage;
