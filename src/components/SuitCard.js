
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import useAuth from '../hooks/useAuth';

const HeartIcon = ({ isFavorite, onToggle }) => {
    const iconRef = useRef(null);
    const pathRef = useRef(null);
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            gsap.set(pathRef.current, { fill: isFavorite ? '#EF4444' : 'none', stroke: isFavorite ? '#dc2626' : 'white' });
            isFirstRun.current = false;
            return;
        }
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

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
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

const SuitCard = ({ suit, isFavorite, onToggleFavorite }) => {
    const { id, name, price, size, imageUrl, description, availability } = suit;
    const isRented = availability && availability.includes('rented');
    
    const [isPinned, setIsPinned] = useState(false);
    const cardRef = useRef(null);
    const detailsRef = useRef(null);
    const animation = useRef(null);

    useEffect(() => {
        gsap.set(detailsRef.current, { height: 'auto', autoAlpha: 1 });
        animation.current = gsap.from(detailsRef.current, {
            height: 0,
            autoAlpha: 0,
            duration: 0.5,
            ease: 'expo.inOut',
            paused: true
        });
    }, []);

    const handleMouseEnter = () => {
        animation.current.play();
        gsap.to(cardRef.current, { y: -8, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
        if (!isPinned) {
            animation.current.reverse();
        }
        gsap.to(cardRef.current, { y: 0, duration: 0.2, ease: 'power2.in' });
    };

    const handleClick = (e) => {
        if (e.target.closest('a, button')) return;
        setIsPinned(prev => !prev);
    };

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            className="relative flex flex-col rounded-2xl overflow-hidden shadow-lg bg-surface-container-high cursor-pointer"
            style={{ willChange: 'transform' }}
        >
            <div className="relative h-96 w-full overflow-hidden">
                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                {isRented && <div className="absolute top-3 left-3 bg-error text-on-error px-2.5 py-1 text-xs font-bold rounded-full z-10">ALQUILADO</div>}
                <HeartIcon isFavorite={isFavorite} onToggle={() => onToggleFavorite(id)} />
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
            
            <div ref={detailsRef} className="overflow-hidden">
                <div className="p-4 pt-3 border-t border-outline/20">
                    <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">{description || "Este traje no tiene una descripción detallada."}</p>
                    <Link 
                        to={`/suit/${id}`} 
                        onClick={(e) => e.stopPropagation()}
                        className="block text-center w-full px-4 py-2.5 bg-primary text-on-primary font-bold rounded-full hover:bg-primary/80 transition-colors duration-200"
                    >
                        Ver y Alquilar
                    </Link>
                </div>
            </div>
        </div>
    );
};

export const SuitCardSkeleton = () => (
    <div className="relative rounded-2xl overflow-hidden shadow-lg bg-surface-container-high">
        <div className="relative h-96 w-full overflow-hidden bg-surface-container-highest animate-pulse"></div>
        <div className="p-4 flex justify-between items-end">
            <div>
                <div className="h-5 bg-surface-container-highest rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-surface-container-highest rounded w-1/2 animate-pulse"></div>
            </div>
            <div className="h-7 bg-surface-container-highest rounded w-1/4 animate-pulse"></div>
        </div>
    </div>
);

export default SuitCard;
