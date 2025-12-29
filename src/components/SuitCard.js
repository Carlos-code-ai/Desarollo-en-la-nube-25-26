
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

// --- Placeholder Image ---
// Using an inline SVG to avoid external network requests and CSP issues.
const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNnB4IiBmaWxsPSIjY2NjIj5TaW4gSW1hZ2VuPC90ZXh0Pjwvc3ZnPg==";

// --- SuitCard Component ---
const SuitCard = ({ suit }) => {
    const { id, name, price, size, imageUrls, availability } = suit;
    const isRented = availability && availability.includes('rented');
    const cardRef = useRef(null);

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, { y: -8, scale: 1.03, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.2, ease: 'power2.in' });
    };

    // Use the first available image or the inline SVG placeholder
    const displayImage = imageUrls?.[0] || placeholderImage;

    return (
        <Link
            to={`/suit/${id}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="block w-full rounded-2xl overflow-hidden shadow-lg bg-surface-container-high transition-transform duration-300 ease-in-out"
            style={{ willChange: 'transform' }}
        >
            <div ref={cardRef} className="relative flex flex-col h-full">
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <img src={displayImage} alt={name} className="w-full h-full object-cover" />
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
            </div>
        </Link>
    );
};

// --- Skeleton Loader for SuitCard ---
const SuitCardSkeleton = () => (
    <div className="relative rounded-2xl overflow-hidden shadow-lg bg-surface-container-high">
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface-container-highest animate-pulse"></div>
        <div className="p-4">
            <div className="h-5 bg-surface-container-highest rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-surface-container-highest rounded w-1/2 animate-pulse"></div>
        </div>
    </div>
);

// Attach the Skeleton as a static property to the main component
SuitCard.Skeleton = SuitCardSkeleton;

export default SuitCard;
