import React from 'react';

// Iconos SVG para cada sección. Definidos aquí para mantener el componente autocontenido.
const HomeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
  </svg>
);

const SearchIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const AddIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
  </svg>
);

const MessagesIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zM12 11L4 6h16l-8 5z" />
  </svg>
);

const ProfileIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const NavItem = ({ icon: Icon, label, onClick, isActive }) => {
  const activeClasses = 'text-primary';
  const inactiveClasses = 'text-on-surface-variant';
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}>
      <Icon className="h-6 w-6" />
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  );
};

const BottomNavBar = ({ activeView, onNavClick, onAddClick }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-container-low shadow-[0_-1px_3px_rgba(0,0,0,0.1)] flex z-50">
      <NavItem icon={HomeIcon} label="Home" isActive={activeView === 'home'} onClick={() => onNavClick('home')} />
      <NavItem icon={SearchIcon} label="Buscar" isActive={activeView === 'search'} onClick={() => onNavClick('search')} />
      
      {/* Botón central de Añadir */}
      <div className="w-full flex justify-center items-center">
        <button 
          onClick={onAddClick}
          className="-mt-6 bg-primary text-on-primary rounded-full h-16 w-16 flex items-center justify-center shadow-lg hover:bg-primary-dark transition-transform duration-200 hover:scale-105">
          <AddIcon className="h-8 w-8" />
        </button>
      </div>

      <NavItem icon={MessagesIcon} label="Mensajes" isActive={activeView === 'messages'} onClick={() => onNavClick('messages')} />
      <NavItem icon={ProfileIcon} label="Perfil" isActive={activeView === 'profile'} onClick={() => onNavClick('profile')} />
    </nav>
  );
};

export default BottomNavBar;
