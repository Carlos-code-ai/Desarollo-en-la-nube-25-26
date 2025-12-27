
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const PlusIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const FloatingActionButton = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const buttonRef = React.useRef(null);
    const iconRef = React.useRef(null);

    const handleClick = () => {
        gsap.to(buttonRef.current, { scale: 0.9, duration: 0.2, ease: 'power2.inOut', yoyo: true, repeat: 1, onComplete: () => {
             navigate('/add-suit');
        }});
    };

    const handleMouseEnter = () => {
        gsap.to(iconRef.current, { rotation: "+=90", scale: 1.1, duration: 0.4, ease: 'back.out(2)' });
        gsap.to(buttonRef.current, { scale: 1.1, duration: 0.3, ease: 'power2.out' });
    }

    const handleMouseLeave = () => {
        gsap.to(iconRef.current, { rotation: "-=90", scale: 1, duration: 0.3, ease: 'power2.inOut' });
        gsap.to(buttonRef.current, { scale: 1, duration: 0.2, ease: 'power2.in' });
    }

    if (location.pathname === '/messages') {
        return null;
    }

    return (
        <button
            ref={buttonRef}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="fixed bottom-25 right-100 z-40 flex items-center justify-center h-16 w-16 bg-primary text-on-primary shadow-xl rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/50"
            aria-label="Añadir nuevo traje"
        >
            <div ref={iconRef}>
                <PlusIcon className="h-8 w-8" />
            </div>
        </button>
    );
};

export default FloatingActionButton;
