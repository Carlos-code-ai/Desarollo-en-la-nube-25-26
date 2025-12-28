import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useUnreadCount from '../hooks/useUnreadCount.js';
import useRealtimeDB from '../hooks/useRealtimeDB.js';
import SearchResults from './SearchResults.js';
import { AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

// --- Reusable Components (unchanged) ---
const Logo = () => {
    const h1Ref = useRef(null);
    const spanRef = useRef(null);

    const handleMouseEnter = () => {
        gsap.to(spanRef.current, { scale: 1.4, y: -2, rotate: -10, duration: 0.3, ease: 'back.out(2)' });
        gsap.to(h1Ref.current, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
        gsap.to(spanRef.current, { scale: 1, y: 0, rotate: 0, duration: 0.3, ease: 'power2.inOut' });
        gsap.to(h1Ref.current, { scale: 1, duration: 0.3, ease: 'power2.inOut' });
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

    return (
        <Link to={to} className="relative p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors" aria-label={ariaLabel}>
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
    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';
    };

    return (
        <Link to="/profile">
            <div className="h-9 w-9 rounded-full border-2 border-transparent hover:border-primary transition-all">
                {user.photoURL ? (
                    <img className="h-full w-full rounded-full object-cover" src={user.photoURL} alt="Ver perfil" />
                ) : (
                    <div className="h-full w-full rounded-full flex items-center justify-center bg-primary text-on-primary font-bold text-sm">
                        {getInitials(user.displayName)}
                    </div>
                )}
            </div>
        </Link>
    );
};


// --- Live Search Bar Component ---
const LiveSearchBar = ({ searchQuery, setSearchQuery, allSuits }) => {
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef(null);

    const searchResults = useMemo(() => {
        if (!searchQuery) return [];
        const lowerCaseQuery = searchQuery.toLowerCase();
        return allSuits.filter(suit => 
            suit.name?.toLowerCase().includes(lowerCaseQuery) ||
            suit.description?.toLowerCase().includes(lowerCaseQuery)
        ).slice(0, 5); // Show top 5 results
    }, [searchQuery, allSuits]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleResultClick = () => {
        setSearchQuery('');
        setIsFocused(false);
    };

    return (
        <div className="relative w-full" ref={searchRef}>
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant z-10">search</span>
            <input
                type="text"
                placeholder="Buscar trajes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-surface-container-high border-2 border-transparent focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface transition-all duration-300"
            />
            <AnimatePresence>
                {isFocused && searchQuery && (
                    <SearchResults results={searchResults} onResultClick={handleResultClick} />
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Main Header Component ---
const Header = ({ searchQuery, setSearchQuery }) => {
  const { user } = useAuth();
  const unreadMessagesCount = useUnreadCount(user?.uid);
  const location = useLocation();
  const { docs: allSuits } = useRealtimeDB('trajes');

  const showSearchBar = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 w-full z-40 transition-all duration-300">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 md:px-6 lg:px-8 backdrop-blur-lg bg-surface/90 border-b border-outline/20">
            
            <div className="flex items-center">
                <Logo />
            </div>

            {user && (
                <div className="flex flex-1 items-center justify-end gap-x-2 sm:gap-x-4">
                    {showSearchBar && (
                        <div className="hidden md:block w-80">
                            <LiveSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} allSuits={allSuits} />
                        </div>
                    )}
                    <NavIcon to="/messages" iconName="chat_bubble_outline" ariaLabel="Mensajes" badgeCount={unreadMessagesCount} />
                    <ProfileAvatar user={user} />
                </div>
            )}
        </nav>

        {user && showSearchBar && (
            <div className="max-w-7xl mx-auto px-4 md:hidden pb-3 pt-1 bg-surface/90 backdrop-blur-lg border-b border-outline/20">
                <LiveSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} allSuits={allSuits} />
            </div>
        )}
    </header>
  );
};

export default Header;
