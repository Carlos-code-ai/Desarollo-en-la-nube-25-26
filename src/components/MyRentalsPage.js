import React from 'react';
import useAuth from '../hooks/useAuth.js'; // <-- CORREGIDO
import useRealtimeDB from '../hooks/useRealtimeDB.js'; // <-- CORREGIDO
import { db } from '../firebase.js';
import { ref, update } from 'firebase/database';

const RentalCard = ({ rental, isOwnerView = false, onUpdateStatus }) => {
  const { suitName, suitImageUrl, startDate, endDate, totalPrice, status, renterName, renterPhotoURL } = rental;

  const handleAccept = () => onUpdateStatus(rental.id, 'accepted');
  const handleReject = () => onUpdateStatus(rental.id, 'rejected');

  const getStatusChipStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-200 text-yellow-800';
      case 'accepted': return 'bg-green-200 text-green-800';
      case 'rejected': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="flex items-center gap-4 bg-surface p-3 rounded-2xl shadow-sm">
      <img src={suitImageUrl} alt={suitName} className="h-24 w-24 rounded-lg object-cover" />
      <div className="flex-grow">
        <h3 className="font-bold text-lg text-on-surface">{suitName}</h3>
        <p className="text-sm text-on-surface-variant">{startDate} al {endDate}</p>
        <p className="font-semibold text-primary">€{totalPrice}</p>
         {isOwnerView && (
          <div className="flex items-center gap-2 mt-1">
            <img src={renterPhotoURL} alt={renterName} className="w-6 h-6 rounded-full"/>
            <p className="text-xs text-on-surface-variant">Solicitado por {renterName}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusChipStyle(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        {isOwnerView && status === 'pending' && (
          <div className="flex gap-2 mt-2">
            <button onClick={handleAccept} className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-full hover:bg-green-700">Aceptar</button>
            <button onClick={handleReject} className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-full hover:bg-red-700">Rechazar</button>
          </div>
        )}
      </div>
    </div>
  );
};


const MyRentalsPage = () => {
  const { user } = useAuth();

  // Mis solicitudes de alquiler a otros
  const { docs: myRentals, loading: loadingMyRentals } = useRealtimeDB('alquileres', 'renterId', user ? user.uid : null);

  // Solicitudes de alquiler para mis trajes
  const { docs: receivedRequests, loading: loadingReceived } = useRealtimeDB('alquileres', 'ownerId', user ? user.uid : null);
  
  const handleUpdateStatus = async (rentalId, newStatus) => {
      const rentalRef = ref(db, `alquileres/${rentalId}`);
      try {
          await update(rentalRef, { status: newStatus });
      } catch (error) {
          console.error("Error actualizando el estado del alquiler:", error);
          alert('No se pudo actualizar la solicitud.');
      }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-on-surface">Mis Alquileres</h1>

      <section>
        <h2 className="text-xl font-semibold text-on-surface mb-4">Mis Alquileres</h2>
        <div className="space-y-4">
          {loadingMyRentals ? <p>Cargando...</p> : 
            myRentals.length > 0 ? 
              myRentals.map(rental => <RentalCard key={rental.id} rental={rental} />) : 
              <p className="text-on-surface-variant p-4 bg-surface-container rounded-lg">No has alquilado ningún traje todavía.</p>
          }
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-on-surface mb-4">Solicitudes Recibidas</h2>
        <div className="space-y-4">
          {loadingReceived ? <p>Cargando...</p> : 
            receivedRequests.length > 0 ? 
              receivedRequests.map(req => <RentalCard key={req.id} rental={req} isOwnerView={true} onUpdateStatus={handleUpdateStatus} />) : 
              <p className="text-on-surface-variant p-4 bg-surface-container rounded-lg">Nadie ha solicitado alquilar tus trajes todavía.</p>
          }
        </div>
      </section>
    </div>
  );
};

export default MyRentalsPage;
