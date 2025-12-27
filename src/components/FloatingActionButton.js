
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const FloatingActionButton = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const buttonRef = useRef(null);
    const textRef = useRef(null);
    const iconRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);

    // Scroll handler to collapse button
    useEffect(() => {
        const handleScroll = () => {
            // Set state based on scroll position
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check in case the page loads already scrolled
        handleScroll();

        // Cleanup listener on component unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []); // Empty dependency array ensures this runs only once

    // GSAP Animations for scroll-based collapse
    useEffect(() => {
        gsap.to(buttonRef.current, { 
            width: isScrolled ? '56px' : '170px',
            duration: 0.4, 
            ease: 'power3.inOut' 
        });
        gsap.to(textRef.current, { 
            opacity: isScrolled ? 0 : 1,
            x: isScrolled ? -10 : 0,
            duration: 0.3,
            ease: 'power2.out' 
        });
        gsap.to(iconRef.current, {
            rotation: isScrolled ? 180 : 0,
            duration: 0.4,
            ease: 'power3.inOut'
        });
    }, [isScrolled]);

    const handleClick = () => {
        // Elastic animation on click
        gsap.fromTo(buttonRef.current, 
            { scale: 0.95 }, 
            { 
                scale: 1, 
                duration: 0.6, 
                ease: 'elastic.out(1, 0.4)',
                onComplete: () => navigate('/add-suit') 
            }
        );
    };

    // Hide the button on specific pages where it's not needed
    if ([`/add-suit`].includes(location.pathname)) {
        return null;
    }

    return (
        <div 
            // The FAB is now fixed at the bottom-center of the screen for all devices
            className="fixed bottom-10 right-10 md:right-16 z-40"
        >
            <button
                ref={buttonRef}
                onClick={handleClick}
                className="flex items-center justify-center h-14 bg-primary text-on-primary shadow-2xl rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/30 overflow-hidden"
                // Initial state is expanded
                style={{ width: '170px' }} 
                aria-label="Añadir nuevo traje"
            >
                {/* Icon is absolutely positioned to stay centered when collapsed */}
                <div ref={iconRef} className="absolute left-4 top-1/2 -translate-y-1/2">
                     <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>
                {/* Text is positioned to the right of the icon */}
                <span 
                    ref={textRef}
                    className="font-semibold whitespace-nowrap pl-8"
                    style={{ opacity: 1 }} // Initially visible
                >
                    Añadir traje
                </span>
            </button>
        </div>
    );
};

export default FloatingActionButton;
