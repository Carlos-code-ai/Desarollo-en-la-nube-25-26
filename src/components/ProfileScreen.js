
import React, { useState, useMemo, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth.js';
import { useNavigate, Link } from 'react-router-dom';
import useRealtimeDB from '../hooks/useRealtimeDB.js';
import { gsap } from 'gsap';

// --- Componente de Rejilla de Imágenes ---
const ImageGrid = ({ items, emptyMessage }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-surface-container rounded-3xl mt-6 animate-fade-in">
        <span className="material-icons text-5xl text-on-surface-variant/50">{emptyMessage.icon}</span>
        <h2 className="text-xl font-semibold text-on-surface mt-4">{emptyMessage.title}</h2>
        <p className="text-on-surface-variant mt-2">{emptyMessage.description}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-1 mt-4 animate-fade-in">
      {items.map(item => (
        <Link to={`/suit/${item.id}`} key={item.id} className="aspect-square w-full bg-surface-container-high overflow-hidden group">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        </Link>
      ))}
    </div>
  );
};

// --- Icono de Edición Animado ---
const EditIcon = ({ onClick, className }) => {
    const iconRef = useRef(null);
    const handleMouseEnter = () => gsap.to(iconRef.current, { scale: 1.2, color: '#A8C7FA', duration: 0.2 });
    const handleMouseLeave = () => gsap.to(iconRef.current, { scale: 1, color: '#C3C6CF', duration: 0.2 });
    return (
        <button onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`p-2 rounded-full ${className}`}>
            <span ref={iconRef} className="material-icons text-on-surface-variant/90" style={{ fontSize: '20px' }}>edit</span>
        </button>
    );
};

// --- Icono de Navegación (Percha/Corazón) ---
const NavIcon = ({ icon, label, isActive, onClick }) => {
    const iconRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        gsap.to(iconRef.current, { 
            scale: isActive ? 1.1 : 1,
            color: isActive ? '#D0BCFF' : '#CAC4D0',
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
        gsap.to(textRef.current, { 
            color: isActive ? '#EADDFF' : '#CAC4D0',
            duration: 0.3,
        });
    }, [isActive]);

    return (
        <button onClick={onClick} className="flex flex-col items-center justify-center gap-1 p-3 w-24 rounded-xl transition-colors hover:bg-primary/10" aria-label={label}>
             <span ref={iconRef} className="material-icons" style={{ fontSize: '28px' }}>{icon}</span>
             <span ref={textRef} className="text-xs font-medium tracking-wide">{label}</span>
        </button>
    );
}

// --- Icono de Cerrar Sesión ---
const LogoutIcon = ({ onClick }) => {
    const iconRef = useRef(null);
    const handleMouseEnter = () => gsap.to(iconRef.current, { scale: 1.2, color: '#F2B8B5', duration: 0.2 });
    const handleMouseLeave = () => gsap.to(iconRef.current, { scale: 1, color: '#938F99', duration: 0.2 });
    return (
        <button onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="p-2 rounded-full" aria-label="Cerrar sesión">
            <span ref={iconRef} className="material-icons">logout</span>
        </button>
    )
}


const ProfileScreen = () => {
  const { user, loading, logout, favorites } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('wardrobe');
  
  const { docs: allSuits, loading: suitsLoading } = useRealtimeDB('trajes');

  const wardrobeItems = useMemo(() => allSuits.filter(s => s.ownerId === user?.uid), [allSuits, user]);
  const favoriteItems = useMemo(() => allSuits.filter(s => favorites && favorites.has(s.id)), [allSuits, favorites]);
  
  const handleLogout = async () => {
      try { await logout(); navigate('/'); } catch (error) { console.error("Error al cerrar sesión:", error); }
  };

  useEffect(() => { if (!loading && !user) navigate('/login'); }, [user, loading, navigate]);

  if (loading || suitsLoading || !user) {
    return <div className="w-full h-screen grid place-items-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col animate-fade-in font-sans">

        {/* -- Cabecera de Perfil -- */}
        <header className="w-full flex justify-between items-center mb-6 py-2">
            {/* Bloque Izquierdo: Usuario */}
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <img src={user.photoURL} alt="Foto de perfil" className="w-20 h-20 rounded-full object-cover border-2 border-surface-container-high" />
                    <EditIcon 
                        onClick={() => navigate('/edit-profile')} 
                        className="absolute bottom-0 right-0 bg-surface/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                    />
                </div>
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-on-surface">{user.displayName}</h1>
                    <EditIcon onClick={() => navigate('/edit-profile')} />
                </div>
            </div>

            {/* Bloque Derecho: Logout */}
            <LogoutIcon onClick={handleLogout} />
        </header>

        {/* -- Navegación de Pestañas -- */}
        <nav className="flex justify-around items-center bg-surface-container rounded-full p-1.5 shadow-inner">
             <NavIcon 
                icon="hanger" 
                label="Mis Trajes" 
                isActive={activeTab === 'wardrobe'} 
                onClick={() => setActiveTab('wardrobe')} 
             />
             <NavIcon 
                icon={activeTab === 'favorites' ? 'favorite' : 'favorite_border'} 
                label="Favoritos" 
                isActive={activeTab === 'favorites'} 
                onClick={() => setActiveTab('favorites')} 
             />
        </nav>
        
        {/* -- Contenido de las Pestañas -- */}
        <main className="w-full overflow-y-auto pt-4 pb-24">
            {activeTab === 'wardrobe' && (
                <ImageGrid 
                    items={wardrobeItems} 
                    emptyMessage={{
                        icon: 'hanger',
                        title: "Tu armario está vacío", 
                        description: "Añade tu primera prenda para empezar a alquilar."
                    }}
                />
            )} 
            {activeTab === 'favorites' && (
                <ImageGrid 
                    items={favoriteItems} 
                    emptyMessage={{
                        icon: 'favorite_border',
                        title: "Aún no tienes favoritos", 
                        description: "Guarda trajes que te gusten para verlos aquí."
                    }}
                />
            )} 
        </main>

    </div>
  );
};

export default ProfileScreen;
