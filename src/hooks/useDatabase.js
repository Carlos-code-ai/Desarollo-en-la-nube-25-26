
import { useState, useEffect } from 'react';
import { rtdb } from '../firebase.js';
import { ref, query, onValue, orderByChild, equalTo } from 'firebase/database';

const useDatabase = (path, filterKey = null, filterValue = null) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let dbQuery = ref(rtdb, path);

    if (filterKey && filterValue) {
      dbQuery = query(ref(rtdb, path), orderByChild(filterKey), equalTo(filterValue));
    } else if (filterKey && !filterValue) {
      setDocs([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onValue(dbQuery, (snapshot) => {
      try {
        const val = snapshot.val();
        if (val) {
          const dataArray = Object.keys(val).map(key => {
            const item = val[key];
            
            // --- DEFINITIVE FIX --- 
            // Firebase can return array-like objects. We must sanitize this at the source.
            let images = [];
            if (item.imageUrls) {
                if (Array.isArray(item.imageUrls)) {
                    images = item.imageUrls; // It's already a perfect array
                } else if (typeof item.imageUrls === 'object' && item.imageUrls !== null) {
                    images = Object.values(item.imageUrls); // Convert the object's values to a real array
                }
            } else if (item.imageUrl) {
                // Handle legacy items that only have one imageUrl
                images = [item.imageUrl];
            }

            return {
                ...item,
                id: key,
                imageUrls: images, // Overwrite with the sanitized, real array
            };
          });
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

    return () => unsubscribe();
  }, [path, filterKey, filterValue]);

  return { docs, loading, error };
};

export default useDatabase;
