import React from 'react';

// --- Skeleton Card ---
export const SuitCardSkeleton = () => (
  <div className="bg-surface rounded-3xl shadow-lg animate-pulse">
    <div className="aspect-[3/4] bg-surface-variant rounded-t-3xl"></div>
    <div className="p-4">
      <div className="h-6 bg-surface-variant rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-surface-variant rounded w-1/2"></div>
    </div>
  </div>
);

// --- Icono de Corazón ---
const HeartIcon = ({ isFavorite, onToggle }) => (
  <div 
    className="absolute top-3 right-3 h-8 w-8 grid place-items-center bg-background/70 backdrop-blur-sm rounded-full cursor-pointer hover:scale-110 transition-transform"
    onClick={onToggle}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      className={`w-5 h-5 transition-colors duration-200 ${isFavorite ? 'fill-red-500 stroke-red-600' : 'fill-none stroke-currentColor text-on-surface'}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  </div>
);


// --- Main Suit Card Component ---
const SuitCard = ({ suit, onSelect, isFavorite, onToggleFavorite }) => {
  // Confía en que el `suit` objecto viene normalizado del componente padre (SearchPage)
  const { 
    name = 'Traje Elegante', 
    price = 99, 
    size = 'N/A', // Espera `size` directamente
    imageUrl,
    eventType = 'Gala',
  } = suit;

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Evita que el click se propague a la tarjeta
    onToggleFavorite(suit.id);
  };

  return (
    <div 
      className="suit-card group cursor-pointer bg-surface rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      onClick={() => onSelect(suit.id)} 
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-3xl">
        <img
          src={imageUrl || 'https://via.placeholder.com/400x533.png/f0f0f0/333333?text=Ready2Wear'}
          alt={name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        
        {eventType && (
            <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm text-on-primary text-xs font-semibold px-3 py-1 rounded-full">
                {capitalize(eventType)}
            </div>
        )}

        <HeartIcon isFavorite={isFavorite} onToggle={handleFavoriteClick} />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-on-surface leading-tight">{name}</h3>
            <p className="text-sm text-on-surface-variant">Talla: {size}</p>
          </div>
        </div>
        <p className="mt-2 text-lg font-bold text-primary">€{price}<span className="text-sm font-normal text-on-surface-variant">/día</span></p>
      </div>
    </div>
  );
};

export default SuitCard;
