
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useRealtimeDB from '../hooks/useRealtimeDB.js';
import { db } from '../firebase.js';
import { ref, onValue } from 'firebase/database';

// --- Componente de Rejilla de Imágenes (Reutilizado) ---
const ImageGrid = ({ items, emptyMessage }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-surface-container rounded-3xl mt-6">
        <h2 className="text-xl font-semibold text-on-surface">{emptyMessage.title}</h2>
        <p className="text-on-surface-variant mt-2">{emptyMessage.description}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-1 mt-4">
      {items.map(item => (
        <Link to={`/suit/${item.id}`} key={item.id} className="aspect-square w-full bg-surface-container-high">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        </Link>
      ))}
    </div>
  );
};


const PublicProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const { docs: allSuits, loading: suitsLoading } = useRealtimeDB('trajes');

  // Cargar datos del perfil del usuario
  useEffect(() => {
    if (!userId) return;
    const userRef = ref(db, `users/${userId}`);
    setLoadingProfile(true);
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserProfile(snapshot.val());
      } else {
        console.log("No user data found");
      }
      setLoadingProfile(false);
    }, () => setLoadingProfile(false));

    return () => unsubscribe();
  }, [userId]);

  const userItems = useMemo(() => {
    if (!userId) return [];
    return allSuits.filter(s => s.ownerId === userId);
  }, [allSuits, userId]);

  if (loadingProfile || suitsLoading) {
    return <div className="w-full h-screen grid place-items-center">Cargando perfil...</div>;
  }
  
  if (!userProfile) {
    return (
        <div className="w-full h-screen grid place-items-center text-center">
            <h2 className='text-xl font-semibold'>Perfil no encontrado</h2>
            <p className='text-on-surface-variant mt-2'>El usuario que buscas no existe.</p>
            <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 rounded-full bg-primary text-on-primary">Volver</button>
        </div>
    );
  }


  return (
    <div className="max-w-md mx-auto p-4 flex flex-col animate-fade-in">

        <header className="w-full flex justify-start">
             <button onClick={() => navigate(-1)} className="p-2 rounded-full">
                <span className="material-icons">arrow_back</span>
             </button>
        </header>

        <main className="flex-grow flex flex-col justify-center">
            {/* -- Bloque de Identidad -- */}
            <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
                <img src={userProfile.photoURL} alt={`Foto de ${userProfile.displayName}`} className="w-32 h-32 rounded-full object-cover border-4 border-surface-container-high" />
                <h1 className="text-3xl font-bold text-on-surface">{userProfile.displayName}</h1>
                {/* Aquí podrías añadir más info pública si la hubiera, como la bio */}
            </div>
        </main>
        
        <section className="w-full overflow-y-auto pb-24"> 
            <h2 className="text-lg font-bold text-on-surface px-4">Trajes de {userProfile.displayName.split(' ')[0]}</h2>
            <ImageGrid 
              items={userItems} 
              emptyMessage={{
                title: "Este armario está vacío",
                description: "Este usuario todavía no ha puesto ningún traje en alquiler."
              }}
            /> 
        </section>

    </div>
  );
};

export default PublicProfilePage;
