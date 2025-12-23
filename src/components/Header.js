import React from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown.js'; // Importar el nuevo componente
import useAuth from '../hooks/useAuth.js';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 md:px-6 lg:px-8 backdrop-blur-lg bg-surface/80 border-b border-outline/50">
        
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 text-left">
            <span className="text-2xl font-bold tracking-tight text-on-surface">
              Ready<span className="text-primary">2</span>Wear
            </span>
          </Link>
        </div>

        {user && (
          <div className="flex items-center gap-x-2 sm:gap-x-4">
            {/* Menú de Perfil Desplegable */}
            <ProfileDropdown />
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
