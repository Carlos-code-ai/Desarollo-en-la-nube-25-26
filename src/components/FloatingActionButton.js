
import React from 'react';

// --- Icono de Añadir (+) ---
const AddIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

/**
 * Un Botón de Acción Flotante (FAB) para acciones primarias.
 * @param {object} props
 * @param {function} props.onClick - La función a ejecutar cuando se hace clic en el botón.
 */
const FloatingActionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 md:bottom-8 right-6 bg-blue-800 text-white rounded-full h-16 w-16 flex items-center justify-center shadow-lg hover:bg-blue-900 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
      aria-label="Añadir nuevo artículo"
    >
      <AddIcon className="h-8 w-8" />
    </button>
  );
};

export default FloatingActionButton;
