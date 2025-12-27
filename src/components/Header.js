import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useUnreadCount from '../hooks/useUnreadCount.js';
import { gsap } from 'gsap';
import SearchScreen from './SearchScreen.js';

const SearchIcon = ({ onClick }) => (
    <button onClick={onClick} className="p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors" aria-label="Buscar">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        </div>
    </button>
);

const Logo = () => {
    const h1Ref = useRef(null);
    const spanRef = useRef(null);

    const handleMouseEnter = () => {
        gsap.to(spanRef.current, { 
            scale: 1.4, 
            y: -2,
            rotate: -10,
            duration: 0.3, 
            ease: 'back.out(2)' 
        });
        gsap.to(h1Ref.current, { 
            scale: 1.05, 
            duration: 0.3, 
            ease: 'power2.out' 
        });
    };

    const handleMouseLeave = () => {
        gsap.to(spanRef.current, { 
            scale: 1, 
            y: 0,
            rotate: 0,
            duration: 0.3, 
            ease: 'power2.inOut' 
        });
        gsap.to(h1Ref.current, { 
            scale: 1, 
            duration: 0.3, 
            ease: 'power2.inOut' 
        });
    };

    return (
        <Link to="/" className="-m-1.5 p-1.5" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <h1 ref={h1Ref} className="text-2xl font-bold text-on-surface select-none">
                Ready<span ref={spanRef} className='text-primary inline-block'>2</span>Wear
            </h1>
        </Link>
    );
}

const NavIcon = ({ to, iconName, ariaLabel, badgeCount }) => {
    const iconRef = useRef(null);
    const badgeRef = useRef(null);

    useEffect(() => {
        if (badgeCount > 0) {
            gsap.fromTo(badgeRef.current, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
        }
    }, [badgeCount]);

    const handleMouseEnter = () => {
        gsap.to(iconRef.current, { y: -5, duration: 0.2, ease: 'power2.out' });
    };
    const handleMouseLeave = () => {
        gsap.to(iconRef.current, { y: 0, duration: 0.2, ease: 'power2.in' });
    };

    return (
        <Link 
            to={to} 
            className="relative p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors"
            aria-label={ariaLabel}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <span ref={iconRef} className="material-icons">{iconName}</span>
            {badgeCount > 0 && (
                <span ref={badgeRef} className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold">
                    {badgeCount < 10 ? badgeCount : '9+'}
                </span>
            )}
        </Link>
    );
}

const ProfileAvatar = ({ user }) => {
    const avatarRef = useRef(null);

    const getInitials = (name) => {
        if (!name) return '?';
        const initials = name
            .split(' ')
            .map(n => n[0])
            .filter(Boolean)
            .slice(0, 2)
            .join('')
            .toUpperCase();
        return initials || '?';
    };

    const handleMouseEnter = () => {
        gsap.to(avatarRef.current, { scale: 1.15, duration: 0.3, ease: 'back.out(1.7)' });
    };

    const handleMouseLeave = () => {
        gsap.to(avatarRef.current, { scale: 1, duration: 0.2, ease: 'power2.out' });
    };

    return (
        <Link to="/profile" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div
                ref={avatarRef}
                className="h-9 w-9 rounded-full border-2 border-transparent hover:border-primary transition-all"
            >
                {user.photoURL ? (
                    <img
                        className="h-full w-full rounded-full object-cover"
                        src={user.photoURL}
                        alt="Ver perfil"
                    />
                ) : (
                    <div className="h-full w-full rounded-full flex items-center justify-center bg-primary text-on-primary font-bold text-sm">
                        {getInitials(user.displayName)}
                    </div>
                )}
            </div>
        </Link>
    );
};

const Header = ({ favoritesCount }) => {
  const { user } = useAuth();
  const unreadMessagesCount = useUnreadCount(user?.uid);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleOpenSearch = () => setIsSearchOpen(true);
  const handleCloseSearch = () => setIsSearchOpen(false);

  return (
    <>
        <header className="fixed top-0 left-0 w-full z-40 transition-all duration-300">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 md:px-6 lg:px-8 backdrop-blur-lg bg-surface/90 border-b border-outline/20">
                
                <div className="flex lg:flex-1">
                    <Logo />
                </div>

                {user && (
                <div className="flex items-center gap-x-2 sm:gap-x-3">
                    <SearchIcon onClick={handleOpenSearch} />
                    <NavIcon to="/messages" iconName="chat_bubble_outline" ariaLabel="Mensajes" badgeCount={unreadMessagesCount} />
                    <ProfileAvatar user={user} />
                </div>
                )}
            </nav>
        </header>
        <SearchScreen isOpen={isSearchOpen} onClose={handleCloseSearch} />
    </>
  );
};

export default Header;
