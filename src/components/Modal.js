import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    // El portal del modal que ocupa toda la pantalla
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose} // Cierra el modal al hacer clic en el fondo
    >
      <div
        // Detiene la propagación del clic para que no se cierre al interactuar con el contenido
        onClick={(e) => e.stopPropagation()}
        // El contenido del modal con animación de entrada
        className="relative animate-scale-in"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
