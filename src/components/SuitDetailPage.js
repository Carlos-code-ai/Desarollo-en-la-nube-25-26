import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { ref, onValue, push } from 'firebase/database';
import useAuth from '../hooks/useAuth.js'; // <-- 1. IMPORTAR useAuth

// --- Sub-componentes (sin cambios) ---
const SizeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h16.5M3.75 12h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" /></svg>;
const EventIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345h5.518a.562.562 0 01.321.988l-4.204 3.055a.563.563 0 00-.182.557l1.528 4.7-3.976-2.888a.563.563 0 00-.64 0L7.02 21.03l1.528-4.7a.563.563 0 00-.182-.557l-4.204-3.055a.563.563 0 01.321-.988h5.518a.563.563 0 00.475-.345L11.48 3.5z" /></svg>;
const ConditionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 00-1.622 3.385m-5.043-.025a15.998 15.998 0 01-3.388-1.62m-1.622 3.385a15.998 15.998 0 01-3.388 1.62m16.5 0a48.11 48.11 0 00-16.5 0" /></svg>;
const ColorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402a3.75 3.75 0 00-.625-6.25l-6.402-6.401a3.75 3.75 0 00-5.304 0 3.75 3.75 0 000 5.304l6.402 6.401a3.75 3.75 0 006.25.625" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>

const DetailItem = ({ icon, title, value }) => (
    <div className="flex flex-col items-center text-center p-3 bg-surface-container rounded-2xl">
        <div className="text-primary mb-1">{icon}</div>
        <p className="text-xs text-on-surface-variant font-medium">{title}</p>
        <p className="text-sm font-semibold text-on-surface mt-0.5">{value}</p>
    </div>
);

// --- Componente Principal ---
const SuitDetailPage = ({ suitId, onBack }) => {
  const { user } = useAuth(); // <-- 2. OBTENER USUARIO ACTUAL
  const [suit, setSuit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const suitRef = ref(db, `trajes/${suitId}`);
    setLoading(true);
    const unsubscribe = onValue(suitRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setSuit({...data, id: suitId });
      else setError('No se pudo encontrar el traje.');
      setLoading(false);
    }, (err) => {
      console.error(err); 
      setError('Error al cargar el traje.');
      setLoading(false);
    });
    return () => unsubscribe();
  }, [suitId]);

  useEffect(() => {
    if (startDate && endDate && suit.price) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setTotalPrice(diffDays * suit.price);
    } else {
        setTotalPrice(0);
    }
  }, [startDate, endDate, suit]);

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  
  // --- 3. LÓGICA DE ALQUILER ACTUALIZADA ---
  const handleRental = async () => {
      if (!user) {
          alert('Debes iniciar sesión para alquilar un traje.');
          return;
      }
      if (!startDate || !endDate) {
          alert('Por favor, selecciona un rango de fechas válido.');
          return;
      }

      const rentalData = {
          suitId: suit.id,
          suitName: suit.name,
          suitImageUrl: suit.imageUrl,
          ownerId: suit.ownerId,
          renterId: user.uid,
          renterName: user.displayName,
          renterPhotoURL: user.photoURL,
          startDate,
          endDate,
          totalPrice,
          status: 'pending', // El propietario deberá confirmar
          createdAt: new Date().toISOString(),
      };

      try {
          const rentalsRef = ref(db, 'alquileres');
          await push(rentalsRef, rentalData);
          alert(`¡Solicitud de alquiler enviada!\nRecibirás una notificación cuando ${suit.ownerName} confirme la reserva.`);
          // Opcional: Redirigir o limpiar fechas
          setStartDate(null);
          setEndDate(null);
      } catch (error) {
          console.error("Error al crear la reserva:", error);
          alert("Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.");
      }
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <button onClick={onBack}>Volver</button>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      {suit && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
            <div className="aspect-[3/4] bg-surface-container rounded-3xl shadow-lg overflow-hidden animate-scale-in">
              <img src={suit.imageUrl} alt={suit.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <DetailItem icon={<SizeIcon />} title="Talla" value={suit.size || 'N/A'} />
                <DetailItem icon={<EventIcon />} title="Evento" value={capitalize(suit.eventType) || 'N/A'} />
                <DetailItem icon={<ConditionIcon />} title="Estado" value={capitalize(suit.condition) || 'N/A'} />
                <DetailItem icon={<ColorIcon />} title="Color" value={suit.colors || 'N/A'} />
            </div>
          </div>
          <div className="flex flex-col pt-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">{suit.name}</h1>
            <p className="text-3xl font-light text-primary mt-2">€{suit.price}<span className="text-lg font-normal text-on-surface-variant">/día</span></p>
            <div className="flex items-center gap-3 my-6 p-3 bg-surface-container rounded-2xl">
                <img src={suit.ownerPhotoURL || 'https://i.pravatar.cc/150?u=a042f81f4e29026704d'} alt={suit.ownerName} className="w-12 h-12 rounded-full"/>
                <div>
                    <p className="text-sm text-on-surface-variant">Propietario</p>
                    <p className="font-bold text-on-surface">{suit.ownerName || 'Usuario Anónimo'}</p>
                </div>
            </div>
            <div className="bg-surface-container p-4 rounded-2xl mb-6">
              <h3 className="font-bold text-on-surface flex items-center mb-3"><CalendarIcon /> Selecciona las fechas</h3>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="start-date" className="text-sm font-medium text-on-surface-variant">Desde</label>
                      <input type="date" id="start-date" value={startDate || ''} onChange={e => setStartDate(e.target.value)} className="w-full p-2 mt-1 rounded-lg bg-surface border border-outline focus:border-primary focus:ring-0" />
                  </div>
                  <div>
                      <label htmlFor="end-date" className="text-sm font-medium text-on-surface-variant">Hasta</label>
                      <input type="date" id="end-date" value={endDate || ''} onChange={e => setEndDate(e.target.value)} min={startDate} className="w-full p-2 mt-1 rounded-lg bg-surface border border-outline focus:border-primary focus:ring-0" />
                  </div>
              </div>
              {totalPrice > 0 && (
                <div className="mt-4 text-center bg-surface-container-high p-3 rounded-lg">
                  <p className="font-bold text-on-surface">Precio Total Estimado: <span className="text-primary">€{totalPrice}</span></p>
                </div>
              )}
            </div>
            <div className="border-b border-outline/50 mb-4">
              <nav className="-mb-px flex gap-6"><button onClick={() => setActiveTab('description')} className={`shrink-0 px-1 pb-4 text-sm font-medium ${activeTab === 'description' ? 'border-b-2 border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}>Descripción</button><button onClick={() => setActiveTab('materials')} className={`shrink-0 px-1 pb-4 text-sm font-medium ${activeTab === 'materials' ? 'border-b-2 border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}>Materiales</button></nav>
            </div>
            <div className="text-on-surface-variant text-sm leading-relaxed min-h-[4rem]">
              {activeTab === 'description' && <p>{suit.description || "No hay descripción."}</p>}
              {activeTab === 'materials' && <p>{suit.materials || "No se especificaron materiales."}</p>}
            </div>
            <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-4">
                <button onClick={handleRental} disabled={!startDate || !endDate} className="w-full h-12 rounded-full bg-primary text-on-primary font-bold hover:scale-105 transition-transform disabled:bg-surface-container-high disabled:text-on-surface-variant disabled:scale-100">
                    Solicitar Alquiler
                </button>
                <button className="w-full h-12 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/10 transition-colors">Enviar Mensaje</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuitDetailPage;
