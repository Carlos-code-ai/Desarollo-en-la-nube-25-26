
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { gsap } from 'gsap';

const LogoutIcon = () => {
    const navigate = useNavigate();
    const iconRef = React.useRef(null);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const handleMouseEnter = () => {
        gsap.to(iconRef.current, { scale: 1.2, duration: 0.3, ease: 'power1.out' });
    };

    const handleMouseLeave = () => {
        gsap.to(iconRef.current, { scale: 1, duration: 0.3, ease: 'power1.out' });
    };

    const handleClick = (e) => {
        e.preventDefault();
        gsap.to(iconRef.current, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1, onComplete: handleLogout });
    };

    return (
        <button
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="focus:outline-none"
            aria-label="Cerrar sesión"
            ref={iconRef}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-on-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
            </svg>
        </button>
    );
};

export default LogoutIcon;
