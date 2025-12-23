import React from 'react';

// --- Iconos SVG ---
const HomeIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" /></svg>;
const AddIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" /></svg>;
const MessagesIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zM12 11L4 6h16l-8 5z" /></svg>;
const ProfileIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>;


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
    // Fondo más opaco (surface-container) y una sombra superior más pronunciada.
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-container shadow-[0_-2px_5px_rgba(0,0,0,0.1)] grid grid-cols-5 items-center z-50">
      
      {/* -- Ítems de navegación -- */}
      <NavItem icon={HomeIcon} label="Inicio" isActive={activeView === 'home'} onClick={() => onNavClick('home')} />
      <NavItem icon={MessagesIcon} label="Mensajes" isActive={activeView === 'messages'} onClick={() => onNavClick('messages')} />

      {/* -- Botón central flotante -- */}
      <div className="relative w-full flex justify-center items-center">
         <button 
          onClick={onAddClick}
          className="absolute bottom-4 bg-primary text-on-primary rounded-full h-16 w-16 flex items-center justify-center shadow-lg hover:bg-primary-dark transition-transform duration-200 hover:scale-105 ring-4 ring-surface-container">
          <AddIcon className="h-8 w-8" />
        </button>
      </div>
      
      <NavItem icon={ProfileIcon} label="Perfil" isActive={activeView === 'profile'} onClick={() => onNavClick('profile')} />

      {/* Platzhalter für die fünfte Spalte, um das Layout zu erhalten */}
      <div />

    </nav>
  );
};


export default BottomNavBar;
