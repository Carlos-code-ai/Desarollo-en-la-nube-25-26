
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import useFavorites from '../hooks/useFavorites'; // Importamos el hook

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNnB4IiBmaWxsPSIjY2NjIj5TaW4gSW1hZ2VuPC90ZXh0Pjwvc3ZnPg==";

const HeartIcon = ({ suitId }) => {
    // El HeartIcon ahora maneja su propio estado de favoritos
    const { favorites, onToggleFavorite } = useFavorites();
    const isFavorite = favorites.has(suitId);

    const handleClick = (e) => {
        e.preventDefault(); // Evita la navegación al hacer clic en el corazón
        e.stopPropagation();
        onToggleFavorite(suitId);
    };

    return (
        <button 
            onClick={handleClick} 
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-200 focus:outline-none"
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-all duration-300 ${isFavorite ? 'text-red-500' : 'text-white/80'}`} 
                 viewBox="0 0 24 24" 
                 fill={isFavorite ? 'currentColor' : 'none'} 
                 stroke="currentColor" 
                 strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
            </svg>
        </button>
    );
};

const SuitCard = ({ suit }) => {
    const { id, name = 'Traje sin Nombre', price = 0, size = 'N/A', imageUrls = [], availability } = suit || {};
    const cardRef = useRef(null);

    const isRented = typeof availability === 'string' && availability.toLowerCase() === 'rented';

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, { y: -8, scale: 1.03, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.2, ease: 'power2.in' });
    };

    const displayImage = imageUrls?.[0] || placeholderImage;

    if (!id || name === 'Traje sin Nombre') return null;

    return (
        <div 
            ref={cardRef} 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-surface-container-high transition-transform duration-300 ease-in-out" 
            style={{ willChange: 'transform' }}>
            <Link to={`/suit/${id}`} className="block w-full h-full">
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <img 
                        src={displayImage} 
                        alt={name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    {isRented && <div className="absolute top-3 left-3 bg-error text-on-error px-2.5 py-1 text-xs font-bold rounded-full z-10">ALQUILADO</div>}
                     <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-lg font-bold leading-tight">{name}</h3>
                                <p className="text-sm text-white/80">Talla: {size}</p>
                            </div>
                            <p className="text-xl font-bold text-white">{price}€<span className="text-sm font-normal text-white/80">/día</span></p>
                        </div>
                    </div>
                </div>
            </Link>
            {/* El HeartIcon ahora es inteligente y solo necesita el ID */}
            <HeartIcon suitId={id} />
        </div>
    );
};

const SuitCardSkeleton = () => (
    <div className="relative rounded-2xl overflow-hidden shadow-lg bg-surface-container-high">
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container-highest animate-pulse"></div>
        <div className="p-4">
            <div className="h-5 bg-surface-container-highest rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-surface-container-highest rounded w-1/2 animate-pulse"></div>
        </div>
    </div>
);

SuitCard.Skeleton = SuitCardSkeleton;

export default SuitCard;
