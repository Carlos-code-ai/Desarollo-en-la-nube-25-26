
import { useState, useEffect } from 'react';
import { rtdb } from '../firebase.js';
import { ref, onValue } from 'firebase/database';

// A simplified and cleaner hook for fetching all documents from a path.
// Filtering will now be handled at the component level for more flexibility.
const useRealtimeDB = (path) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!path) {
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);

    const dbRef = ref(rtdb, path);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      try {
        const val = snapshot.val();
        if (val) {
          const dataArray = Object.keys(val).map(key => {
            const item = val[key];
            
            // Sanitize imageUrls to always be an array for consistency
            let images = [];
            if (Array.isArray(item.imageUrls)) {
                images = item.imageUrls;
            } else if (item.imageUrl) {
                images = [item.imageUrl];
            } else if (typeof item.imageUrls === 'object' && item.imageUrls !== null) {
                images = Object.values(item.imageUrls);
            } 

            return {
                ...item,
                id: key,
                imageUrls: images, // Ensure imageUrls is always an array
                imageUrl: images[0] || item.imageUrl || '', // Ensure compatibility
            };
          });
          // Reverse to show newest items first
          setDocs(dataArray.reverse());
        } else {
          setDocs([]);
        }
      } catch (err) {
        setError(err);
        console.error("Error processing data from RealtimeDB: ", err);
      } finally {
        setLoading(false);
      }
    }, (err) => {
      setError(err);
      setLoading(false);
      console.error("Error fetching data from RealtimeDB: ", err);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [path]);

  return { docs, loading, error };
};

export default useRealtimeDB;
