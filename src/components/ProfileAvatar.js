
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoutIcon from './LogoutIcon';

const ProfileAvatar = ({ user }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="h-9 w-9 rounded-full border-2 border-transparent hover:border-primary transition-all focus:outline-none">
                {user.photoURL ? (
                    <img className="h-full w-full rounded-full object-cover" src={user.photoURL} alt="Perfil" />
                ) : (
                    <div className="h-full w-full rounded-full flex items-center justify-center bg-primary text-on-primary font-bold text-sm">
                        {getInitials(user.displayName)}
                    </div>
                )}
            </button>
            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container rounded-md shadow-lg py-1 z-50">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high" onClick={() => setDropdownOpen(false)}>
                        Ver Perfil
                    </Link>
                    <div className="border-t border-outline/20"></div>
                    <div className="px-4 py-2">
                        <LogoutIcon />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileAvatar;
