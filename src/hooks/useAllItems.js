
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { adaptSuitData } from '../utils/dataAdapter.js';

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
                    const allItems = Object.keys(data)
                        .map(key => adaptSuitData(data[key], key))
                        .filter(item => item !== null); // Ensure no null items from adapter

                    // --- Final Production Filtering Logic ---
                    // An item is considered valid for the main page if:
                    // 1. It has a real name (not the default placeholder).
                    // 2. It has at least one valid, absolute URL for an image.
                    // 3. Its availability is explicitly true (boolean) or a recognized available string.
                    const validItems = allItems.filter(item => {
                        const hasRealName = item && item.name && item.name !== 'Traje sin Nombre';
                        const hasValidImage = item && item.imageUrls && item.imageUrls.length > 0 && item.imageUrls[0].startsWith('http');
                        
                        // Robust availability check: accepts boolean `true` or string `"available"`
                        // Explicitly rejects `false`, `"rented"`, `"not available"`, etc.
                        const isAvailable = item.availability === true || 
                                            (typeof item.availability === 'string' && item.availability.toLowerCase() === 'available');

                        return hasRealName && hasValidImage && isAvailable;
                    });

                    setItems(validItems);

                } else {
                    setItems([]);
                }
            } catch (err) {
                console.error("A critical error occurred while processing items:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }, (err) => {
            console.error("Firebase read failed catastrophically:", err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { items, loading, error };
};

export default useAllItems;
