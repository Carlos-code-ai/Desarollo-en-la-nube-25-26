
import { useState, useEffect } from 'react';
import { rtdb } from '../firebase.js';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { adaptSuitData } from '../utils/dataAdapter.js'; // <-- IMPORT THE ADAPTER

const useUserItems = (user) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);

    const dbRef = ref(rtdb, 'trajes');
    const { uid, displayName } = user;

    const queries = [
      query(dbRef, orderByChild('ownerId'), equalTo(uid)),
      query(dbRef, orderByChild('propietarioId'), equalTo(uid))
    ];

    if (displayName) {
      queries.push(query(dbRef, orderByChild('usuario'), equalTo(displayName.toUpperCase())));
    }

    let results = {};
    const listeners = [];
    let queriesFinished = 0;

    const processSnapshot = (snapshot) => {
        const rawData = snapshot.val();
        if (rawData) {
            Object.keys(rawData).forEach(key => {
                // Use the item key as the definitive ID, preventing duplicates.
                // Adapt the data before it's merged into the results.
                results[key] = adaptSuitData(rawData[key], key); 
            });
        }
        queriesFinished++;

        if (queriesFinished === queries.length) {
            const dataArray = Object.values(results).filter(item => item !== null);
            dataArray.sort((a, b) => b.createdAt - a.createdAt);
            setItems(dataArray);
            setLoading(false);
        }
    };
    
    const handleError = (err) => {
        console.error("Error fetching user items:", err);
        setError(err);
        queriesFinished++;
        if(queriesFinished === queries.length) {
            setLoading(false);
        }
    };

    queries.forEach(q => {
        listeners.push(onValue(q, processSnapshot, handleError));
    });

    return () => {
      listeners.forEach(unsubscribe => unsubscribe());
    };
  }, [user]);

  return { items, loading, error };
};

export default useUserItems;
