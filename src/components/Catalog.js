import React from 'react';
import useRealtimeDB from '../hooks/useRealtimeDB.js';
import useSuitAnimations from '../hooks/useSuitAnimations.js';
import SuitCard, { SuitCardSkeleton } from './SuitCard.js';

const Catalog = ({ onSuitSelect }) => {
  const { docs: suits, loading, error } = useRealtimeDB('trajes');

  // El hook de animación ahora también nos devuelve la referencia para el contenedor
  const { containerRef } = useSuitAnimations();

  // --- Render Logic ---

  const renderContent = () => {
    // 1. Estado de Error
    if (error) {
      return (
        <div className="text-center text-error bg-error/10 p-6 rounded-2xl">
          <p className="font-bold mb-2">¡Ups! Algo salió mal.</p>
          <p className="text-sm">No pudimos cargar el catálogo. Por favor, intenta de nuevo más tarde.</p>
        </div>
      );
    }

    // 2. Estado de Carga (Skeletons)
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => <SuitCardSkeleton key={index} />)}
        </div>
      );
    }
    
    // 3. Estado Vacío
    if (suits.length === 0) {
      return (
        <div className="text-center py-16 px-6 bg-surface rounded-3xl border border-dashed border-outline">
            <h3 className="text-xl font-semibold text-on-surface">El catálogo está vacío</h3>
            <p className="text-on-surface-variant mt-2 mb-6">¡Sé el primero en añadir un nuevo traje a nuestra colección!</p>
            {/* Aquí podríamos agregar un botón para añadir un traje en el futuro */}
            <button className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary shadow-sm hover:scale-105 transition-transform duration-200">
                Añadir Traje
            </button>
        </div>
      );
    }
    
    // 4. Contenido Principal (Grid de Trajes)
    return (
      <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {suits.map(suit => (
          <SuitCard 
            key={suit.id}
            suit={suit}
            onSelect={onSuitSelect} // Pasamos la función directamente
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-4xl font-bold tracking-tight text-on-surface sm:text-5xl mb-12">
          Nuestro Catálogo
        </h2>
        {renderContent()}
      </div>
    </section>
  );
};

export default Catalog;
