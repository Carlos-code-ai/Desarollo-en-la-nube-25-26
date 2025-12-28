
import { useState, useEffect } from 'react';
import { rtdb } from '../firebase.js';
import { ref, query, orderByChild, onValue, limitToLast } from 'firebase/database';
import { adaptSuitData } from '../utils/dataAdapter.js'; // <-- IMPORT THE ADAPTER

const useAllItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const dbRef = ref(rtdb, 'trajes');
    const allItemsQuery = query(dbRef, orderByChild('createdAt'), limitToLast(100));

    const unsubscribe = onValue(allItemsQuery, (snapshot) => {
      try {
        const rawData = snapshot.val();
        let adaptedArray = [];
        if (rawData) {
          adaptedArray = Object.keys(rawData)
            .map(key => adaptSuitData(rawData[key], key)) // <-- USE THE ADAPTER
            .filter(item => item !== null); // Filter out any null results from adapter
        }
        
        // The adapter handles data consistency, so we can reliably sort
        adaptedArray.sort((a, b) => b.createdAt - a.createdAt);
        setItems(adaptedArray);

      } catch (err) {
        console.error("Error processing all items: ", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error("Error fetching all items: ", err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { items, loading, error };
};

export default useAllItems;
