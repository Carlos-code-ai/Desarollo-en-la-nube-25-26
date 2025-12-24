import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useRealtimeDB from '../hooks/useRealtimeDB.js';
import { db } from '../firebase.js';
import { ref, update } from 'firebase/database';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const RentalCard = ({ rental }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { suitName, suitImageUrl, startDate, endDate, totalPrice, status, renterName, renterPhotoURL, chatId, ownerId } = rental;

  const isOwnerView = user && user.uid === ownerId;
  const handleGoToChat = () => navigate(`/messages/${chatId}`);

  const getStatusChipStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-400/30 text-yellow-700';
      case 'accepted': return 'bg-green-400/30 text-green-700';
      case 'rejected': return 'bg-red-400/30 text-red-700';
      default: return 'bg-gray-400/30 text-gray-700';
    }
  };

  const formattedStartDate = format(new Date(startDate), "d MMM yyyy", { locale: es });
  const formattedEndDate = format(new Date(endDate), "d MMM yyyy", { locale: es });

  return (
    <div onClick={handleGoToChat} className="flex items-start sm:items-center gap-4 bg-surface p-4 rounded-2xl shadow-sm hover:bg-surface-container transition-colors duration-200 cursor-pointer">
      <img src={suitImageUrl} alt={suitName} className="h-28 w-24 sm:h-32 sm:w-28 rounded-lg object-cover" />
      <div className="flex-grow">
        <h3 className="font-bold text-base sm:text-lg text-on-surface">{suitName}</h3>
        <p className="text-sm text-on-surface-variant font-medium mt-1">{formattedStartDate} - {formattedEndDate}</p>
        <p className="font-semibold text-base sm:text-lg text-primary mt-1">{totalPrice.toFixed(2)}€</p>
        {isOwnerView && (
          <div className="flex items-center gap-2 mt-2">
            <img src={renterPhotoURL} alt={renterName} className="w-6 h-6 rounded-full object-cover" />
            <p className="text-xs text-on-surface-variant">Solicitado por {renterName}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end justify-between self-stretch py-1">
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusChipStyle(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <div className="flex-grow" />
        <button onClick={handleGoToChat} className="h-9 px-4 flex items-center gap-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm font-bold">
            <span className="material-icons text-lg">chat</span>
            <span>Ver Chat</span>
        </button>
      </div>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="text-center py-12 px-6 bg-surface-container rounded-3xl">
    <p className="text-on-surface-variant">{message}</p>
  </div>
);

const MyRentalsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'made'

  const { docs: receivedRequests, loading: loadingReceived } = useRealtimeDB('bookings', 'ownerId', user ? user.uid : null);
  const { docs: myRentals, loading: loadingMyRentals } = useRealtimeDB('bookings', 'renterId', user ? user.uid : null);
  
  const TabButton = ({ label, tabName }) => (
    <button 
      onClick={() => setActiveTab(tabName)} 
      className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === tabName ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
        {label}
    </button>
  );

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 p-4 animate-fade-in">
      <header className="flex justify-between items-center">
         <h1 className="text-3xl font-bold text-on-surface">Mis Alquileres</h1>
         <div className="p-1.5 bg-surface-container rounded-full flex gap-2">
            <TabButton label="Solicitudes Recibidas" tabName="received" />
            <TabButton label="Mis Peticiones" tabName="made" />
         </div>
      </header>

      <main>
        {activeTab === 'received' && (
            <div className="space-y-4">
                {loadingReceived ? <p>Cargando...</p> : 
                    receivedRequests.length > 0 ? 
                    receivedRequests.map(req => <RentalCard key={req.id} rental={req} />) : 
                    <EmptyState message="Nadie ha solicitado alquilar tus trajes todavía." />
                }
            </div>
        )}

        {activeTab === 'made' && (
            <div className="space-y-4">
            {loadingMyRentals ? <p>Cargando...</p> : 
                myRentals.length > 0 ? 
                myRentals.map(rental => <RentalCard key={rental.id} rental={rental} />) : 
                <EmptyState message="No has alquilado ningún traje todavía." />
            }
            </div>
        )}
      </main>
    </div>
  );
};

export default MyRentalsPage;