
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useRealtimeDB from '../hooks/useRealtimeDB.js';
import { db } from '../firebase.js';
import { ref, update } from 'firebase/database';
import { format, isPast, isFuture, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';

// This is the new OrderCard component based on your design
const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const {
    id,
    suitName,
    suitImageUrl,
    startDate,
    endDate,
    totalPrice,
    status: initialStatus,
    size // Assuming size is available in the order object
  } = order;

  // --- Status Logic ---
  const getOrderStatus = () => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (initialStatus === 'pending') return { label: 'Pendiente', style: 'bg-yellow-400 text-yellow-900', canCancel: true };
    if (initialStatus === 'rejected') return { label: 'Cancelado', style: 'bg-red-400 text-red-900', canCancel: false };
    if (isPast(end)) return { label: 'Completado', style: 'bg-gray-400 text-gray-900', canReorder: true };
    if (isWithinInterval(now, { start, end })) return { label: 'En Alquiler', style: 'bg-blue-400 text-blue-900' };
    if (initialStatus === 'accepted' && isFuture(start)) return { label: 'Confirmado', style: 'bg-green-400 text-green-900' };
    
    // Default fallback
    return { label: 'En Proceso', style: 'bg-yellow-400 text-yellow-900' };
  };

  const { label: statusLabel, style: statusStyle, canCancel, canReorder } = getOrderStatus();

  // --- Formatting ---
  const formattedStartDate = format(new Date(startDate), "d MMM", { locale: es });
  const formattedEndDate = format(new Date(endDate), "d MMM", { locale: es });
  const orderDate = order.createdAt ? format(new Date(order.createdAt), "d 'de' MMM, yyyy", { locale: es }) : format(new Date(startDate), "d 'de' MMM, yyyy", { locale: es });

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-4">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <p className="font-bold text-gray-800">Pedido #{id.substring(0, 8).toUpperCase()}</p>
          <p className="text-sm text-gray-500">Realizado el {orderDate}</p>
        </div>
        <div className={`px-3 py-1 text-sm font-bold rounded-full ${statusStyle}`}>
          {statusLabel}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex">
        <img src={suitImageUrl} alt={suitName} className="h-32 w-28 rounded-lg object-cover" />
        <div className="ml-4 flex-grow">
          <h3 className="font-bold text-lg text-gray-900">{suitName} - Talla {size || 'M'}</h3>
          <div className="mt-2 text-gray-600">
            <p className="flex items-center"><span className="material-icons text-base mr-2">calendar_today</span> Del {formattedStartDate} al {formattedEndDate}</p>
            <p className="font-semibold text-lg text-gray-800 mt-2">{totalPrice.toFixed(2)}€</p>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 bg-gray-50 flex justify-end items-center space-x-2">
        {canCancel && <button className="px-4 py-2 rounded-lg font-semibold text-red-600 bg-red-100 hover:bg-red-200">Cancelar Pedido</button>}
        {canReorder && <button className="px-4 py-2 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300">Volver a Alquilar</button>}
        <button 
            onClick={() => navigate(`/order-details/${id}`)} 
            className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700">
            Ver Detalles
        </button>
      </div>
    </div>
  );
};


const EmptyState = ({ message }) => (
    <div className="text-center py-20">
      <p className="text-gray-500">{message}</p>
    </div>
);

const MyOrdersPage = () => {
  const { user } = useAuth();
  
  // We only fetch bookings where the current user is the renter.
  const { docs: myOrders, loading: loadingMyOrders } = useRealtimeDB('bookings', 'renterId', user ? user.uid : null);
  
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 p-4 animate-fade-in">
      <header>
         <h1 className="text-3xl font-bold text-gray-800">Mis Pedidos</h1>
      </header>

      <main>
        {loadingMyOrders ? (
            <p>Cargando tus pedidos...</p>
        ) : myOrders.length > 0 ? (
            myOrders.map(order => <OrderCard key={order.id} order={order} />)
        ) : (
            <EmptyState message="Aún no has realizado ningún pedido." />
        )}
      </main>
    </div>
  );
};

export default MyOrdersPage;
