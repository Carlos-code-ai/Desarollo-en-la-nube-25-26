
import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useUnreadCount from '../hooks/useUnreadCount.js';
import SearchBar from './SearchBar'; 
import { gsap } from 'gsap';

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

const NavIcon = ({ to, iconName, badgeCount }) => (
    <Link to={to} className="relative p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors">
        <span className="material-icons">{iconName}</span>
        {badgeCount > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center h-4 w-4 rounded-full bg-error text-on-error text-xs font-bold">
                {badgeCount < 10 ? badgeCount : '9+'}
            </span>
        )}
    </Link>
);

const ProfileAvatar = ({ user }) => {
    const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
    return (
        <Link to="/profile">
            <div className="h-9 w-9 rounded-full border-2 border-transparent hover:border-primary transition-all">
                {user.photoURL ? (
                    <img className="h-full w-full rounded-full object-cover" src={user.photoURL} alt="Perfil" />
                ) : (
                    <div className="h-full w-full rounded-full flex items-center justify-center bg-primary text-on-primary font-bold text-sm">
                        {getInitials(user.displayName)}
                    </div>
                )}
            </div>
        </Link>
    );
};

// Header component now receives search state from App.js
const Header = ({ user, searchQuery, onSearch }) => {
  const location = useLocation();
  const unreadMessagesCount = useUnreadCount(user?.uid);

  // Only show the search bar on the homepage
  const showSearchBar = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 w-full z-40 transition-all duration-300">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 md:px-6 lg:px-8 backdrop-blur-lg bg-surface/90 border-b border-outline/20">
            
            <div className="flex items-center">
                <Logo />
            </div>
            
            {/* Centered SearchBar, only on homepage */}
            {user && showSearchBar && (
                <div className="flex-1 flex justify-center px-2 sm:px-8">
                    <div className="w-full max-w-lg">
                        <SearchBar onSearch={onSearch} initialValue={searchQuery} />
                    </div>
                </div>
            )}

            {/* User navigation icons */}
            {user ? (
                <div className="flex items-center justify-end gap-x-2 sm:gap-x-4">
                    <NavIcon to="/messages" iconName="chat_bubble_outline" badgeCount={unreadMessagesCount} />
                    <ProfileAvatar user={user} />
                </div>
            ) : (
                <Link to="/login" className="px-4 py-2 text-sm font-bold bg-primary text-on-primary rounded-full hover:bg-primary-dark transition-colors">
                    Iniciar Sesión
                </Link>
            )}
        </nav>
    </header>
  );
};

export default Header;
