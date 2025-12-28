
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

// --- HeartIcon Component (for favoriting) ---
const HeartIcon = ({ isFavorite, onToggle }) => {
    const iconRef = useRef(null);
    const pathRef = useRef(null);
    const isFirstRun = useRef(true);

    useEffect(() => {
        // Set initial state without animation
        if (isFirstRun.current) {
            gsap.set(pathRef.current, { fill: isFavorite ? '#EF4444' : 'none', stroke: isFavorite ? '#dc2626' : 'white' });
            isFirstRun.current = false;
            return;
        }

        // Animate on subsequent changes
        const tl = gsap.timeline();
        if (isFavorite) {
            tl.to(iconRef.current, { scale: 1.2, ease: 'power1.in', duration: 0.1 })
              .set(pathRef.current, { fill: '#EF4444', stroke: '#dc2626' })
              .to(iconRef.current, { scale: 1, ease: 'elastic.out(1, 0.4)', duration: 0.4 });
        } else {
            tl.to(iconRef.current, { scale: 0.8, ease: 'power1.in', duration: 0.1 })
              .set(pathRef.current, { fill: 'none', stroke: 'white' })
              .to(iconRef.current, { scale: 1, ease: 'power1.out', duration: 0.1 });
        }
    }, [isFavorite]);

    // Stop propagation to prevent card click when favoriting and check if onToggle exists
    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onToggle) {
            onToggle();
        }
    };

    return (
        <button onClick={handleToggle} className="absolute top-4 right-4 h-10 w-10 grid place-items-center bg-black/50 backdrop-blur-sm rounded-full cursor-pointer z-20 focus:outline-none">
            <div ref={iconRef}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} className={'w-6 h-6'}>
                    <path ref={pathRef} strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            </div>
        </button>
    );
};


// --- SuitCard Component ---
const SuitCard = ({ suit, isFavorite, onToggleFavorite, onSelect }) => {
    const { id, name, price, size, imageUrl, availability } = suit;
    const isRented = availability && availability.includes('rented');
    const cardRef = useRef(null);

    const handleCardClick = () => {
        if (onSelect) {
            onSelect(id);
        }
    };

    // GSAP animation for hover effect
    const handleMouseEnter = () => {
        gsap.to(cardRef.current, { y: -8, scale: 1.03, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.2, ease: 'power2.in' });
    };

    return (
        <div 
            onClick={handleCardClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="block w-full rounded-2xl overflow-hidden shadow-lg bg-surface-container-high transition-transform duration-300 ease-in-out cursor-pointer"
            style={{ willChange: 'transform' }}
        >
            <div ref={cardRef} className="relative flex flex-col h-full">
                {/* Image Container with new aspect ratio */}
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    {isRented && <div className="absolute top-3 left-3 bg-error text-on-error px-2.5 py-1 text-xs font-bold rounded-full z-10">ALQUILADO</div>}
                    <HeartIcon isFavorite={isFavorite} onToggle={onToggleFavorite ? () => onToggleFavorite(id) : null} />
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
        </div>
    );
};

// --- Skeleton Loader for SuitCard ---
export const SuitCardSkeleton = () => (
    <div className="relative rounded-2xl overflow-hidden shadow-lg bg-surface-container-high">
        {/* Adjusted height to match the new image aspect ratio */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface-container-highest animate-pulse"></div>
        <div className="p-4">
            <div className="h-5 bg-surface-container-highest rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-surface-container-highest rounded w-1/2 animate-pulse"></div>
        </div>
    </div>
);

export default SuitCard;
