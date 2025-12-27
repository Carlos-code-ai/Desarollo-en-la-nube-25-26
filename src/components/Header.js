import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useUnreadCount from '../hooks/useUnreadCount.js';
import { gsap } from 'gsap';

const AnimatedSearchIcon = () => {
    const iconRef = useRef(null);

    const handleMouseEnter = () => {
        gsap.to(iconRef.current, { scale: 1.2, rotate: 25, duration: 0.3, ease: 'back.out(1.7)'});
    };

    const handleMouseLeave = () => {
        gsap.to(iconRef.current, { scale: 1, rotate: 0, duration: 0.2, ease: 'power2.out'});
    };

    return (
        <button type="submit" className="p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors" aria-label="Buscar"
            onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div ref={iconRef}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </div>
        </button>
    );
};

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
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const unreadMessagesCount = useUnreadCount(user?.uid);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/search?q=${trimmedQuery}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 md:px-6 lg:px-8 backdrop-blur-lg bg-surface/90 border-b border-outline/20">
        
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <h1 className="text-2xl font-bold text-on-surface">Ready2Wear</h1>
          </Link>
        </div>

        {user && (
          <div className="flex items-center gap-x-2 sm:gap-x-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xs hidden sm:flex items-center">
              <input 
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Buscar trajes..."
                className="w-full px-4 py-2 rounded-full bg-surface-container-high text-on-surface placeholder-on-surface-variant outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <AnimatedSearchIcon />
              </div>
            </form>
            
            <NavIcon to="/messages" iconName="chat_bubble_outline" ariaLabel="Mensajes" badgeCount={unreadMessagesCount} />
            <NavIcon to="/favorites" iconName="favorite_border" ariaLabel="Favoritos" badgeCount={favoritesCount} />

            <ProfileAvatar user={user} />
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
