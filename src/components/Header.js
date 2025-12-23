import React from 'react';

// El Header ahora acepta una nueva prop: onAddSuitClick
const Header = ({ user, onLogout, onAddSuitClick }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 md:px-6 lg:px-8 backdrop-blur-lg bg-surface/80 border-b border-outline/50">
        
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold tracking-tight text-on-surface">
              Ready<span className="text-primary">2</span>Wear
            </span>
          </a>
        </div>

        {user && (
          <div className="flex items-center gap-x-2 sm:gap-x-4">
            {/* Botón para abrir el modal de añadir traje */}
            <button
              onClick={onAddSuitClick} // Llama a la función pasada por props
              className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-primary/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Añadir
            </button>

            <span className="text-sm text-on-surface-variant hidden sm:inline">
              Hola, {user.displayName?.split(' ')[0] || 'Usuario'}
            </span>
            
            <button
              onClick={onLogout}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-sm hover:scale-105 transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Salir
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
