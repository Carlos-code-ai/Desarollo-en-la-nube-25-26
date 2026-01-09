
import React, { useRef, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useFavorites from '../hooks/useFavorites';
import { gsap } from 'gsap';

const HeartIcon = ({ suitId }) => {
    const { user } = useAuth();
    // El hook se encarga de todo: sabe si el traje es favorito y cómo cambiarlo.
    const { favorites, onToggleFavorite, loadingFavorites } = useFavorites();

    const isFavorite = favorites.has(suitId);

    const iconRef = useRef(null);
    const pathRef = useRef(null);
    const isFirstRun = useRef(true);

    useEffect(() => {
        // Inicializa el estado sin animación
        if (isFirstRun.current || loadingFavorites) {
            gsap.set(pathRef.current, { 
                fill: isFavorite ? '#EF4444' : 'none', 
                stroke: isFavorite ? '#dc2626' : 'white' 
            });
            isFirstRun.current = false;
            return;
        }

        // Anima los cambios de estado
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
    }, [isFavorite, loadingFavorites]);

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            alert('Debes iniciar sesión para añadir favoritos.');
            return;
        }
        onToggleFavorite(suitId);
    };
    
    // No renderizar el botón si no tenemos el ID del traje
    if (!suitId) return null;

    return (
        <button onClick={handleToggle} className="absolute top-4 right-4 h-10 w-10 grid place-items-center bg-black/50 backdrop-blur-sm rounded-full cursor-pointer z-20 focus:outline-none" aria-label="Añadir a favoritos">
            <div ref={iconRef}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} className={'w-6 h-6'}>
                    <path ref={pathRef} strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            </div>
        </button>
    );
};

export default HeartIcon;
