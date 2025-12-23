
import React from 'react';
import useFirestore from '../hooks/useFirestore.js';
import BookingCalendar from './BookingCalendar.js';

const SuitDetailPage = ({ suitId, onBack }) => {
  // Usamos el hook para obtener solo el documento del traje seleccionado
  const { docs: suits, loading, error } = useFirestore(`suits/${suitId}`);
  const suit = suits && suits.length > 0 ? suits[0] : null;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
      {loading && <div className="text-center text-neutral-600">Cargando detalles del traje...</div>}
      {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
      {suit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {/* Columna de Imagen */}
          <div>
            <img 
              src={suit.imageUrl} 
              alt={suit.name} 
              className="w-full h-auto object-cover rounded-xl shadow-md"
            />
          </div>
          
          {/* Columna de Detalles y Calendario */}
          <div>
            <button 
              onClick={onBack}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors mb-4"
            >
              &larr; Volver al catálogo
            </button>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">{suit.name}</h2>
            <p className="text-lg text-neutral-600 mt-2">Talla: {suit.size}</p>
            <p className="text-3xl font-light text-neutral-800 mt-4">${suit.price} <span className="text-base font-normal text-neutral-500">/ día</span></p>
            <p className="text-neutral-700 mt-4 text-base leading-relaxed">{suit.description}</p>
            
            <div className="mt-6 pt-6 border-t border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Reserva tus fechas</h3>
                <BookingCalendar suitId={suitId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuitDetailPage;
