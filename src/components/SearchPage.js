import React from 'react';

// --- Iconos ---
const SearchIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);
const FilterIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
  </svg>
);
const SortIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
  </svg>
);


const SearchPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col space-y-6">
      
      {/* --- Barra de Búsqueda y Filtros --- */}
      <div className="space-y-4">
        {/* Campo de búsqueda */}
        <div className="relative">
          <input 
            type="text"
            placeholder="Buscar por palabra clave, tipo, talla..."
            className="w-full h-12 pl-12 pr-4 rounded-full bg-surface-container-high text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
             <SearchIcon className="h-6 w-6 text-on-surface-variant" />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end space-x-3">
           <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors">
             <FilterIcon className="h-5 w-5 text-on-surface-variant"/>
             <span className="font-medium text-sm text-on-surface">Filtros</span>
           </button>
           <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors">
             <SortIcon className="h-5 w-5 text-on-surface-variant"/>
             <span className="font-medium text-sm text-on-surface">Ordenar</span>
           </button>
        </div>
      </div>

      {/* --- Espacio para Resultados --- */}
      <div className="text-center py-16 px-6 bg-surface-container rounded-3xl">
        <h2 className="text-xl font-semibold text-on-surface">Comienza tu búsqueda</h2>
        <p className="text-on-surface-variant mt-2">Los resultados de los trajes disponibles aparecerán aquí.</p>
        <p className="text-on-surface-variant mt-1">Próximamente: ¡Búsqueda en mapa y scroll infinito!</p>
      </div>

    </div>
  );
};

export default SearchPage;
