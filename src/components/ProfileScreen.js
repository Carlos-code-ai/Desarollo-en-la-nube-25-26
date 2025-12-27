
import React, { useState, useMemo, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth.js';
import { useNavigate, Link } from 'react-router-dom';
import { db, storage } from '../firebase.js';
import { ref as dbRef, onValue } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { format, isPast, isFuture, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';


const ProfileImage = ({ user, onImageUpdate, isUploading }) => {
    const fileInputRef = useRef(null);
    const handleImageClick = () => fileInputRef.current?.click();

    return (
        <div className="relative w-32 h-32 cursor-pointer group" onClick={handleImageClick} aria-label="Cambiar foto de perfil">
            <img 
                src={user.photoURL} 
                alt="Foto de perfil" 
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg group-hover:brightness-90 transition-all"
            />
            <div className="absolute bottom-1 right-1 flex items-center justify-center w-8 h-8 bg-primary rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                {isUploading 
                    ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    : <span className="material-icons text-white text-lg">edit</span>
                }
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={onImageUpdate} className="hidden" />
        </div>
    );
};

const EditableUserName = ({ user, onNameUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.displayName || '');
    const inputRef = useRef(null);

    useEffect(() => { if (isEditing) inputRef.current?.focus(); }, [isEditing]);

    const handleSave = () => {
        if (name.trim() && name !== user.displayName) onNameUpdate(name.trim());
        setIsEditing(false);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') { setName(user.displayName || ''); setIsEditing(false); }
    };

    return isEditing ? (
        <input 
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="text-2xl font-bold mt-4 bg-transparent border-b-2 border-primary text-center focus:outline-none"
        />
    ) : (
        <div className="flex items-center gap-2 mt-4 cursor-pointer group" onClick={() => setIsEditing(true)} aria-label="Editar nombre">
            <h2 className="text-2xl font-bold">{user.displayName || 'Nombre de Usuario'}</h2>
            <span className="material-icons text-gray-400 group-hover:text-primary transition-colors">edit</span>
        </div>
    );
};

const TabButton = ({ icon, label, onClick, isActive }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-3 rounded-xl w-32 h-24 transition-all duration-300 ${isActive ? 'bg-primary/10 scale-105 text-primary' : 'hover:bg-on-surface/5 active:bg-on-surface/10 text-on-surface-variant'}`}
        aria-label={label}
    >
        <span className="material-icons text-3xl">{icon}</span>
        <span className="text-xs font-medium tracking-wide mt-1">{label}</span>
    </button>
);

const SuitGridItem = ({ item }) => (
    <Link to={`/suit/${item.id}`} className="relative aspect-[4/5] w-full bg-surface-container-high overflow-hidden group rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
        <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-white text-sm font-semibold truncate">{item.name}</p>
        </div>
    </Link>
);

const WardrobeOrderItem = ({ item, isOwnerView }) => {
    const { bookingInfo } = item;
    const formatRange = (start, end) => `${format(new Date(start), "d MMM", { locale: es })} - ${format(new Date(end), "d MMM", { locale: es })}`;

    const getStatus = () => {
        const now = new Date();
        const start = new Date(bookingInfo.startDate);
        const end = new Date(bookingInfo.endDate);

        if (bookingInfo.status === 'pending') return { label: 'Pendiente', style: 'bg-yellow-400 text-yellow-900' };
        if (isPast(end)) return { label: 'Finalizado', style: 'bg-gray-400 text-gray-900' };
        if (isWithinInterval(now, { start, end })) return { label: 'En Alquiler', style: 'bg-blue-400 text-blue-900' };
        if (bookingInfo.status === 'accepted' && isFuture(start)) return { label: 'Confirmado', style: 'bg-green-400 text-green-900' };
        return null; 
    };

    const status = isOwnerView ? getStatus() : null;

    return (
        <div className="w-full bg-surface-container rounded-2xl shadow-sm overflow-hidden border border-outline/20 flex gap-4 p-4">
            <Link to={`/suit/${item.id}`} className="w-24 h-full flex-shrink-0 rounded-lg overflow-hidden">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </Link>
            <div className="flex-grow flex flex-col">
                <div className="flex justify-between items-start">
                    <p className="font-bold text-on-surface text-left pr-2">{item.name}</p>
                    {status && <span className={`py-1 px-2.5 rounded-full text-xs font-semibold ${status.style}`}>{status.label}</span>}
                </div>
                <p className="text-sm text-on-surface-variant text-left mt-1">Talla: {item.size}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-on-surface-variant">
                    <span className="material-icons text-base">calendar_today</span>
                    <span>{formatRange(bookingInfo.startDate, bookingInfo.endDate)}</span>
                </div>
                <div className={`flex items-center gap-2 mt-1 text-sm font-semibold text-on-surface-variant`}>
                    <span className="material-icons text-base">payments</span>
                    <span>Total = {isOwnerView ? '' : '−'}{bookingInfo.totalPrice}€</span>
                </div>
                <div className="flex-grow" />
                 <div className="flex items-center justify-end gap-2 mt-2">
                    {isOwnerView && status?.label === 'Pendiente' && (
                        <button className="px-3 py-1 rounded-lg font-semibold text-red-600 bg-red-100 hover:bg-red-200 text-sm">Cancelar Pedido</button>
                    )}
                    <Link to={`/suit/${item.id}`} className="px-3 py-1 rounded-lg font-semibold text-white bg-primary hover:bg-primary-dark text-sm">Ver Detalles</Link>
                 </div>
            </div>
        </div>
    );
};


const ProfileScreen = () => {
  const { user, loading: authLoading, logout, favorites, forceRefreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-wardrobe');
  
  const [allSuits, setAllSuits] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }

    setDataLoading(true);
    
    const suitsRef = dbRef(db, 'trajes');
    const bookingsRef = dbRef(db, 'bookings');

    const unsubscribeSuits = onValue(suitsRef, (snap) => {
        const suitsData = [];
        snap.forEach(c => suitsData.push({ id: c.key, ...c.val() }));
        setAllSuits(suitsData);
        if (bookings.length > 0) setDataLoading(false);
    });

    const unsubscribeBookings = onValue(bookingsRef, (snap) => {
        const bookingsData = [];
        snap.forEach(c => bookingsData.push({ id: c.key, ...c.val() }));
        setBookings(bookingsData);
        if (allSuits.length > 0) setDataLoading(false);
    });

    // Initial check in case data is already in cache
    setTimeout(() => setDataLoading(false), 1000);

    return () => { unsubscribeSuits(); unsubscribeBookings(); };
  }, [user, authLoading, navigate]);

  const myWardrobeItems = useMemo(() => {
      if (!user) return [];
      const mySuitIds = new Set(allSuits.filter(s => s.ownerId === user.uid).map(s => s.id));
      return bookings
          .filter(b => mySuitIds.has(b.suitId))
          .map(b => ({ ...allSuits.find(s => s.id === b.suitId), bookingInfo: b }))
          .filter(item => item.id && item.bookingInfo)
          .sort((a, b) => new Date(b.bookingInfo.createdAt) - new Date(a.bookingInfo.createdAt));
  }, [allSuits, bookings, user]);

  const favoriteItems = useMemo(() => allSuits.filter(s => favorites?.has(s.id)), [allSuits, favorites]);

  const myOrders = useMemo(() => {
      if (!user) return [];
      return bookings
          .filter(b => b.renterId === user.uid)
          .map(b => ({ ...allSuits.find(s => s.id === b.suitId), bookingInfo: b }))
          .filter(item => item.id && item.bookingInfo)
          .sort((a, b) => new Date(b.bookingInfo.createdAt) - new Date(a.bookingInfo.createdAt));
  }, [allSuits, bookings, user]);

  const handleLogout = async () => { await logout(); navigate('/login'); }
  const handleUpdateName = async (newName) => {
      try { await updateProfile(user, { displayName: newName }); await forceRefreshUser(); } 
      catch (error) { console.error("Error al actualizar el nombre:", error); }
  };
  const handleUpdateImage = async (e) => {
      const file = e.target.files?.[0];
      if (!file || !user) return;
      setIsUploading(true);
      const imageRef = storageRef(storage, `profile-images/${user.uid}/${Date.now()}_${file.name}`);
      try {
          const snapshot = await uploadBytes(imageRef, file);
          const photoURL = await getDownloadURL(snapshot.ref);
          await updateProfile(user, { photoURL });
          await forceRefreshUser();
      } catch (error) { console.error("Error al actualizar la imagen:", error); } 
      finally { setIsUploading(false); }
  };

  if (authLoading || dataLoading || !user) {
    return <div className="w-full h-screen grid place-items-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div></div>;
  }

  const renderTabContent = () => {
      let items, emptyMsg, Renderer, isOwnerView, Layout;
      
      switch (activeTab) {
          case 'favorites':
              items = favoriteItems;
              emptyMsg = "Guarda trajes en tus favoritos para verlos aquí.";
              Renderer = SuitGridItem;
              Layout = ({children}) => <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">{children}</div>;
              break;
          case 'my-orders':
              items = myOrders;
              emptyMsg = "Aquí aparecerán los pedidos que realices.";
              Renderer = WardrobeOrderItem;
              isOwnerView = false;
              Layout = ({children}) => <div className="flex flex-col gap-4">{children}</div>;
              break;
          default: // 'my-wardrobe'
              items = myWardrobeItems;
              emptyMsg = "Cuando alquilen uno de tus trajes, aparecerá aquí.";
              Renderer = WardrobeOrderItem;
              isOwnerView = true;
              Layout = ({children}) => <div className="flex flex-col gap-4">{children}</div>;
      }
      
      if (!items?.length) return <p className='col-span-full text-center p-12 text-on-surface-variant'>{emptyMsg}</p>;
      
      return <Layout>{items.map(item => <Renderer item={item} isOwnerView={isOwnerView} key={item.bookingInfo?.id || item.id} />)}</Layout>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-8">
        <header className="relative flex justify-end items-center h-14 pt-4">
             <button onClick={handleLogout} className="p-2 rounded-full hover:bg-on-surface/10 active:bg-on-surface/20 transition-colors" aria-label="Cerrar sesión">
                <span className="material-icons text-on-surface-variant">logout</span>
            </button>
        </header>
        
        <div className="flex flex-col items-center -mt-12 text-center">
            <ProfileImage user={user} onImageUpdate={handleUpdateImage} isUploading={isUploading} />
            <EditableUserName user={user} onNameUpdate={handleUpdateName} />
            <p className="text-sm text-on-surface-variant mt-1">{user.email}</p>
        </div>
        
        <div className="flex justify-center items-center my-8 p-1.5 rounded-2xl bg-surface-container gap-2">
            <TabButton icon="hanger" label="Mi Armario" isActive={activeTab === 'my-wardrobe'} onClick={() => setActiveTab('my-wardrobe')} />
            <TabButton icon="favorite" label="Favoritos" isActive={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} />
            <TabButton icon="local_shipping" label="Mis Pedidos" isActive={activeTab === 'my-orders'} onClick={() => setActiveTab('my-orders')} />
        </div>
      
        <main className="w-full py-4">
            {renderTabContent()}
        </main>
    </div>
  );
};

export default ProfileScreen;
