
import React from 'react';

const SuitCard = ({ suit, onSelect }) => { // Recibimos el traje completo y la función onSelect
  return (
    <div 
      className="group suit-card bg-white rounded-3xl shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-2xl cursor-pointer" 
      onClick={onSelect} // Hacemos la tarjeta clickeable
    >
      <div className="relative">
        <img 
          src={suit.photos ? suit.photos[0] : ''} 
          alt={suit.title} 
          className="w-full h-80 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-white text-lg font-bold">{suit.title}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-neutral-800">${suit.pricePerDay}<span className="text-sm font-normal text-neutral-500">/día</span></p>
          <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full">★ {suit.averageRating}</span>
        </div>
        <p className="text-sm text-neutral-600 mt-1">Talla: {suit.size}</p>
      </div>
    </div>
  );
};

export default SuitCard;
