
import React from 'react';
import SuitCard from './SuitCard.js';
import useSuitAnimations from '../hooks/useSuitAnimations.js';
import useFirestore from '../hooks/useFirestore.js';

const Catalog = ({ onSuitSelect }) => { // Recibimos la prop onSuitSelect
  const { docs: suits, loading, error } = useFirestore('suits');
  useSuitAnimations();

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl text-center mb-10">
          Nuestro Catálogo
        </h2>
        {loading && <div className="text-center text-neutral-600">Cargando trajes...</div>}
        {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {suits.map(suit => (
              <SuitCard 
                key={suit.id}
                suit={suit} // Pasamos el objeto de traje completo
                onSelect={() => onSuitSelect(suit.id)} // Llamamos a onSuitSelect con el ID
              />
            ))}
          </div>
        )}
        {!loading && !error && suits.length === 0 && (
            <div className="text-center text-neutral-600">No hay trajes disponibles en este momento.</div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
