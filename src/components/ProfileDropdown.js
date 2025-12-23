
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useTheme from '../hooks/useTheme.js';

// --- Iconos ---
const SunIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.95-4.243l-1.59-1.591M3.75 12H6m.386-6.364L7.926 7.23M12 12a6 6 0 100-12 6 6 0 000 12z" /></svg>;
const MoonIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25c0 5.385 4.365 9.75 9.75 9.75 2.572 0 4.92-.99 6.697-2.648z" /></svg>;
const LogoutIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>;
const ChevronDownIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>;

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Redirige a la página de inicio después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null; // No mostrar nada si el usuario no está autenticado

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón del Avatar */}
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 rounded-full hover:bg-surface-container-high transition-colors p-1">
        <img 
          src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=random`}
          alt="Avatar"
          className="h-10 w-10 rounded-full object-cover border-2 border-outline"
        />
        <ChevronDownIcon className={`h-5 w-5 text-on-surface-variant transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-surface-container rounded-lg shadow-xl z-20 animate-fade-in-fast origin-top-right">
          <div className="p-2">
            {/* Info del Usuario */}
            <div className="px-2 py-2 border-b border-outline/50">
              <p className="font-bold text-on-surface text-sm truncate">{user.displayName || 'Usuario'}</p>
              <p className="text-on-surface-variant text-xs truncate">{user.email}</p>
            </div>

            {/* Enlaces de Navegación */}
            <nav className="mt-2">
              <Link to="/my-items" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-md text-sm font-medium">Mis Artículos</Link>
              <Link to="/favorites" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-md text-sm font-medium">Mis Favoritos</Link>
              <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-md text-sm font-medium">Mi Perfil</Link>
            </nav>

            {/* Controles del Tema y Logout */}
            <div className="mt-2 pt-2 border-t border-outline/50">
                {/* Interruptor de Tema */}
                <div className="flex items-center justify-between px-3 py-2 text-on-surface-variant text-sm">
                    <span className="font-medium">Tema</span>
                    <div className="flex items-center space-x-2">
                        <SunIcon className={`h-6 w-6 cursor-pointer ${theme === 'light' ? 'text-primary' : ''}`} onClick={() => theme === 'dark' && toggleTheme()} />
                        <div onClick={toggleTheme} className={`w-10 h-5 flex items-center rounded-full cursor-pointer transition-colors ${theme === 'light' ? 'bg-primary/50' : 'bg-surface-container-highest'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${theme === 'light' ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                        <MoonIcon className={`h-6 w-6 cursor-pointer ${theme === 'dark' ? 'text-primary' : ''}`} onClick={() => theme === 'light' && toggleTheme()} />
                    </div>
                </div>
              {/* Botón de Logout */}
              <button onClick={handleLogout} className="w-full flex items-center space-x-2 px-3 py-2 text-error hover:bg-error-container hover:text-on-error-container rounded-md text-sm font-medium mt-1">
                <LogoutIcon className="h-5 w-5"/>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
