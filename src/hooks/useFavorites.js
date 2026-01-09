
import { useState, useEffect } from 'react';
import { rtdb } from '../firebase';
import { ref, onValue, set, remove } from 'firebase/database';
import useAuth from './useAuth';

const useFavorites = () => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setFavorites(new Set());
            setLoading(false);
            return;
        }

        const favoritesRef = ref(rtdb, `users/${user.uid}/favorites`);
        const unsubscribe = onValue(favoritesRef, (snapshot) => {
            const favoritesData = snapshot.val();
            setFavorites(new Set(favoritesData ? Object.keys(favoritesData) : []));
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const onToggleFavorite = (suitId) => {
        if (!user) return;

        const newFavorites = new Set(favorites);
        const favoriteRef = ref(rtdb, `users/${user.uid}/favorites/${suitId}`);

        if (newFavorites.has(suitId)) {
            remove(favoriteRef);
        } else {
            set(favoriteRef, true);
        }
    };

    return { favorites, onToggleFavorite, loadingFavorites: loading };
};

export default useFavorites;
