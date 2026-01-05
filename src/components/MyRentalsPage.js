import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { rtdb } from '../firebase.js';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
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
        <p className="font-semibold text-base sm:text-lg text-primary mt-1">€{totalPrice.toFixed(2)}</p>
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
        <button onClick={(e) => { e.stopPropagation(); handleGoToChat(); }} className="h-9 px-4 flex items-center gap-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm font-bold">
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

// Custom hook to fetch bookings for a user
const useUserBookings = (userId) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            setBookings([]);
            return;
        }

        setLoading(true);

        const bookingsRef = ref(rtdb, 'bookings');
        const receivedQuery = query(bookingsRef, orderByChild('ownerId'), equalTo(userId));
        const madeQuery = query(bookingsRef, orderByChild('renterId'), equalTo(userId));

        let receivedBookings = {};
        let madeBookings = {};
        let listeners = [];

        const onData = (snapshot, target) => {
            const data = snapshot.val() || {};
             Object.keys(data).forEach(key => {
                const booking = { id: key, ...data[key] };
                if (target === 'received') receivedBookings[key] = booking;
                if (target === 'made') madeBookings[key] = booking;
            });
        };
        
        const receivedListener = onValue(receivedQuery, (snap) => onData(snap, 'received'), (err) => setError(err));
        const madeListener = onValue(madeQuery, (snap) => onData(snap, 'made'), (err) => setError(err));
        
        // Combine results after a short delay to allow both queries to complete
        const timer = setTimeout(() => {
            const all = { ...receivedBookings, ...madeBookings }; // Merge results
            const allBookings = Object.values(all).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setBookings(allBookings);
            setLoading(false);
        }, 500); // Adjust delay if needed

        listeners.push(receivedListener, madeListener);

        return () => {
            clearTimeout(timer);
            listeners.forEach(l => l());
        };

    }, [userId]);

    return { bookings, loading, error };
}

const MyRentalsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'made'

  const { bookings: allBookings, loading, error } = useUserBookings(user?.uid);

  const receivedRequests = useMemo(() => {
    if (!user) return [];
    return allBookings.filter(booking => booking.ownerId === user.uid);
  }, [allBookings, user]);

  const myRentals = useMemo(() => {
    if (!user) return [];
    return allBookings.filter(booking => booking.renterId === user.uid);
  }, [allBookings, user]);

  const TabButton = ({ label, tabName }) => (
    <button 
      onClick={() => setActiveTab(tabName)} 
      className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === tabName ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
        {label}
    </button>
  );

  const renderList = (items, emptyMessage) => {
    if (loading) return <p>Cargando...</p>;
    if (error) return <EmptyState message="Error al cargar los datos." />;
    if (items.length > 0) {
        return items.map(item => <RentalCard key={item.id} rental={item} />)
    } 
    return <EmptyState message={emptyMessage} />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 p-4 animate-fade-in">
      <header className="flex justify-between items-center">
         <div className="p-1.5 bg-surface-container rounded-full flex gap-2">
            <TabButton label="Solicitudes Recibidas" tabName="received" />
            <TabButton label="Mis Peticiones" tabName="made" />
         </div>
      </header>

      <main>
        <div className="space-y-4">
            {activeTab === 'received' 
                ? renderList(receivedRequests, "Nadie ha solicitado alquilar tus trajes todavía.")
                : renderList(myRentals, "No has alquilado ningún traje todavía.")
            }
        </div>
      </main>
    </div>
  );
};

export default MyRentalsPage;
