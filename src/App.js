
import React, { useState } from 'react';
import Catalog from './components/Catalog.js';
import Footer from './components/Footer.js';
import AuthButton from './components/AuthButton.js';
import SuitDetailPage from './components/SuitDetailPage.js'; // Crearemos esta página

function App() {
  const [selectedSuitId, setSelectedSuitId] = useState(null);

  // Función para volver al catálogo
  const handleBackToCatalog = () => {
    setSelectedSuitId(null);
  };

  return (
    <div className="bg-neutral-50 min-h-screen flex flex-col font-sans">
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 
              className="text-3xl font-bold text-neutral-900 tracking-tight cursor-pointer"
              onClick={handleBackToCatalog} // Clic en el logo te lleva al catálogo
            >
              READY2WEAR
            </h1>
            <AuthButton />
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        {
          selectedSuitId ? (
            // --- Vista de Detalle del Traje ---
            <SuitDetailPage suitId={selectedSuitId} onBack={handleBackToCatalog} />
          ) : (
            // --- Vista de Catálogo ---
            <Catalog onSuitSelect={setSelectedSuitId} /> // Pasamos la función para seleccionar un traje
          )
        }
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
