
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

// --- Data Adapter for Suit Objects ---
const suitAdapter = (suit, id) => {
    const name = suit.name || suit.nombre;
    const description = suit.description || suit.descripcion || 'Descripción no disponible.';
    const price = suit.price || suit.precioDia || 0;
    const size = suit.size || suit.talla || 'No especificada';

    let imageUrls = [];
    if (Array.isArray(suit.imageUrls)) {
        imageUrls = suit.imageUrls;
    } else if (typeof suit.imageUrl === 'string') {
        imageUrls = [suit.imageUrl];
    }

    const createdAt = suit.createdAt || suit.timestamp || new Date(2000, 0, 1).getTime();

    return {
        id,
        name,
        description,
        price: Number(price),
        size,
        imageUrls,
        location: suit.location || suit.ciudad || 'Ubicación no disponible',
        availability: suit.availability || [],
        userId: suit.userId || null,
        createdAt: Number(createdAt),
    };
};

// --- Custom Hook to Fetch All Items ---
const useAllItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const db = getDatabase();
        const itemsRef = ref(db, 'trajes');

        const unsubscribe = onValue(itemsRef, (snapshot) => {
            try {
                const data = snapshot.val();
                if (data) {
                    const allItems = Object.keys(data).map(key => suitAdapter(data[key], key));
                    
                    // Filter out items that are clearly placeholders or invalid
                    const validItems = allItems.filter(item => {
                        return item.name && item.name !== 'Traje sin Nombre' && item.imageUrls.length > 0;
                    });

                    setItems(validItems);
                } else {
                    setItems([]);
                }
            } catch (err) {
                console.error("Failed to process items:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }, (err) => {
            console.error("Firebase read failed:", err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { items, loading, error };
};

export default useAllItems;
