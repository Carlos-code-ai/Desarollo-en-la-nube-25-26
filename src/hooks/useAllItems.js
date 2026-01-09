import { useState, useEffect } from 'react';
import { rtdb } from '../firebase';
import { ref, onValue } from "firebase/database";
import { adaptSuitData } from '../utils/dataAdapter';

const useAllItems = (user) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const itemsRef = ref(rtdb, 'trajes');
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      // --- LOG SOLICITADO ---
      console.log('[useAllItems] Raw data from Firebase:', data);
      if (data) {
        const allItems = Object.keys(data).map(key => {
          return adaptSuitData(data[key], key);
        }).filter(item => item !== null);

        setItems(allItems);
      } else {
        setItems([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase read failed: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { items, loading };
};

export default useAllItems;
