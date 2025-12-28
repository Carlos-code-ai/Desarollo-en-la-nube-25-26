import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useRealtimeDB from '../hooks/useRealtimeDB.js';
import { rtdb } from '../firebase.js';
import { ref, onValue } from 'firebase/database';

const StarIcon = ({ fill = 'currentColor' }) => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>
);

const ProfileSuitCard = ({ suit }) => (
    <Link to={`/suit/${suit.id}`} className="block group">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-xl bg-surface-container-high">
            <img src={suit.imageUrl} alt={suit.name} className="w-full h-full object-cover object-center group-hover:opacity-90 transition-opacity" />
        </div>
        <h3 className="mt-2 text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{suit.name}</h3>
        <p className="mt-1 text-xs text-on-surface-variant">{suit.price}€/día</p>
    </Link>
);

const PublicProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const { docs: allSuits, loading: suitsLoading } = useRealtimeDB('trajes');

    useEffect(() => {
        if (!userId) return;
        const userRef = ref(rtdb, `users/${userId}`);
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

    const averageRating = useMemo(() => {
        const ratings = allSuits.filter(s => s.ownerId === userId && s.rating).map(s => s.rating);
        if (ratings.length === 0) return 0;
        const sum = ratings.reduce((acc, curr) => acc + curr, 0);
        return (sum / ratings.length).toFixed(1);
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
    
    const creationYear = userProfile.creationTime ? new Date(userProfile.creationTime).getFullYear() : 'N/A';

    return (
        <div className="bg-surface min-h-screen animate-fade-in">
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <header className="flex items-center mb-6">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
                         <span className="material-icons">arrow_back</span>
                    </button>
                </header>

                <main className="bg-surface-container rounded-2xl shadow-lg p-6 sm:p-8 max-w-2xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                        <div className="flex-shrink-0">
                            <img src={userProfile.photoURL} alt={`Foto de ${userProfile.displayName}`} className="w-28 h-28 rounded-full object-cover border-4 border-surface-container-high shadow-md" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-on-surface">{userProfile.displayName}</h1>
                            <p className="text-on-surface-variant mt-2 text-sm flex items-center justify-center sm:justify-start gap-3">
                                <span>Miembro desde {creationYear}</span>
                                <span className="font-bold">·</span>
                                <span>{userItems.length} Trajes Publicados</span>
                                {averageRating > 0 && (
                                    <>
                                        <span className="font-bold">·</span>
                                        <span className="flex items-center gap-1"><StarIcon /> {averageRating} Valoración</span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-outline/30">
                        <h2 className="text-xl font-bold text-on-surface mb-4">Colección de {userProfile.displayName.split(' ')[0]}</h2>
                        {userItems.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6">
                                {userItems.map(item => <ProfileSuitCard key={item.id} suit={item} />)}
                            </div>
                        ) : (
                            <div className="text-center py-10 px-6 bg-surface rounded-xl">
                                <h3 className="text-lg font-semibold text-on-surface">Este armario está vacío</h3>
                                <p className="text-on-surface-variant mt-1 text-sm">Este usuario todavía no ha puesto ningún traje en alquiler.</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-8 pt-6 flex flex-col sm:flex-row gap-3 border-t border-outline/30">
                       <button className="w-full h-11 rounded-full bg-primary text-on-primary font-bold hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2">Seguir a {userProfile.displayName.split(' ')[0]}</button>
                       <button className="w-full h-11 rounded-full border border-outline text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors text-sm">Contactar</button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PublicProfilePage;
