import React, { useState, useMemo, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth.js';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase.js';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { gsap } from 'gsap';

const LogoutIcon = ({ onLogout }) => {
    const iconRef = useRef(null);
    const handleMouseEnter = () => gsap.to(iconRef.current, { rotation: 15, scale: 1.2, duration: 0.3, ease: 'power2.out' });
    const handleMouseLeave = () => gsap.to(iconRef.current, { rotation: 0, scale: 1, duration: 0.3, ease: 'power2.inOut' });

    return (
        <button onClick={onLogout} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="p-2 rounded-full hover:bg-error-container/50 transition-colors" aria-label="Cerrar sesión">
            <span ref={iconRef} className="material-icons text-on-surface-variant">logout</span>
        </button>
    );
};

const Tab = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex-1 flex flex-col items-center justify-center p-3 text-sm font-medium tracking-wide transition-all duration-300 ${isActive ? 'text-primary' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
    aria-label={label}
  >
    <span className="material-icons mb-1">{icon}</span>
    <span>{label}</span>
  </button>
);

const SuitGridItem = ({ item }) => (
    <Link to={`/suit/${item.id}`} className="relative aspect-square w-full bg-surface-container-high overflow-hidden group rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
        <img 
            src={item.imageUrl} 
            alt={item.marca}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
            <p className="text-white text-xs font-semibold">{item.marca}</p>
        </div>
    </Link>
);

const OrderGridItem = ({ item }) => {
    const { bookingInfo } = item;
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short'});
    };

    return (
        <div className="flex flex-col gap-2 group">
            <Link to={`/suit/${item.id}`} className="relative aspect-square w-full bg-surface-container-high overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
            </Link>
            <div className="text-center">
                 <Link to={`/suit/${item.id}`}>
                    <p className="text-sm font-bold text-on-surface truncate group-hover:text-primary">{item.name || 'Traje sin nombre'}</p>
                 </Link>
                <p className="text-xs text-on-surface-variant font-medium">
                    {formatDate(bookingInfo.startDate)} - {formatDate(bookingInfo.endDate)}
                </p>
            </div>
        </div>
    );
};

const ProfileScreen = () => {
  const { user, loading: authLoading, logout, favorites } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('wardrobe');
  
  const [allSuits, setAllSuits] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setDataLoading(true);
    const suitsRef = ref(db, 'trajes');
    const bookingsQuery = query(ref(db, 'bookings'), orderByChild('renterId'), equalTo(user.uid));

    const unsubscribeSuits = onValue(suitsRef, (snapshot) => {
        const suitsData = [];
        snapshot.forEach(child => {
            suitsData.push({ id: child.key, ...child.val() });
        });
        setAllSuits(suitsData);
        if (!authLoading) setDataLoading(false);
    });

    const unsubscribeBookings = onValue(bookingsQuery, (snapshot) => {
        const bookingsData = [];
        snapshot.forEach(child => {
            bookingsData.push({ id: child.key, ...child.val() });
        });
        setBookings(bookingsData);
    });

    return () => {
        unsubscribeSuits();
        unsubscribeBookings();
    };
  }, [user, authLoading]);

  const wardrobeItems = useMemo(() => allSuits.filter(s => s.ownerId === user?.uid), [allSuits, user]);
  const favoriteItems = useMemo(() => allSuits.filter(s => favorites?.has(s.id)), [allSuits, favorites]);
  const orderItems = useMemo(() => {
    const sortedBookings = [...bookings].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    return sortedBookings.map(booking => {
        const suit = allSuits.find(s => s.id === booking.suitId);
        return suit ? { ...suit, bookingInfo: booking } : null;
    }).filter(item => item !== null);
  }, [allSuits, bookings]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  if (authLoading || dataLoading || !user) {
    return <div className="w-full h-screen grid place-items-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div></div>;
  }

  const getTabContent = () => {
      let items, emptyMessage, renderer;
      switch (activeTab) {
          case 'favorites':
              items = favoriteItems;
              emptyMessage = "Aún no has guardado ningún favorito.";
              renderer = (item) => <SuitGridItem item={item} key={item.id} />;
              break;
          case 'orders':
              items = orderItems;
              emptyMessage = "No tienes ningún pedido activo.";
              renderer = (item) => <OrderGridItem item={item} key={item.bookingInfo.id} />;
              break;
          default:
              items = wardrobeItems;
              emptyMessage = "Añade tu primer traje para empezar a alquilar.";
              renderer = (item) => <SuitGridItem item={item} key={item.id} />;
      }
      if (!items || items.length === 0) {
          return <p className='col-span-full text-center p-8 md:p-12 text-on-surface-variant'>{emptyMessage}</p>;
      }
      return items.map(renderer);
  }

  return (
    <div className="w-full">
        <header className="flex items-center justify-between py-4 border-b border-outline/20">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-surface-container-highest transition-colors" aria-label="Volver atrás">
                <span className="material-icons text-on-surface-variant">arrow_back</span>
            </button>
            <h1 className="font-bold text-lg">Perfil</h1>
            <LogoutIcon onLogout={logout} />
        </header>

        <div className="flex flex-col items-center my-8 md:my-10 text-center">
            <div className="relative w-28 h-28 md:w-32 md:h-32">
                <img src={user.photoURL} alt="Foto de perfil" className="w-full h-full rounded-full object-cover border-4 border-surface-container-high" />
                <Link to="/edit-profile" className="absolute bottom-0 right-0 p-2 bg-primary text-on-primary rounded-full shadow-lg hover:bg-primary-dark transition-transform transform hover:scale-110">
                     <span className="material-icons" style={{ fontSize: '18px' }}>edit</span>
                </Link>
            </div>
            <h2 className="text-2xl font-bold mt-4">{user.displayName || 'Nombre de Usuario'}</h2>
            <p className="text-sm text-on-surface-variant">{user.email}</p>
        </div>
        
        <div className="sticky top-[72px] md:top-[80px] z-30 bg-background/80 backdrop-blur-lg -mx-4">
            <nav className="flex justify-evenly items-center border-y border-outline/30 max-w-4xl mx-auto">
                <Tab icon="style" label="Mi Armario" isActive={activeTab === 'wardrobe'} onClick={() => setActiveTab('wardrobe')} />
                <Tab icon="favorite" label="Favoritos" isActive={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} />
                <Tab icon="local_shipping" label="Mis Pedidos" isActive={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
            </nav>
        </div>
      
        <div className="w-full py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
                {getTabContent()}
            </div>
        </div>
    </div>
  );
};

export default ProfileScreen;
