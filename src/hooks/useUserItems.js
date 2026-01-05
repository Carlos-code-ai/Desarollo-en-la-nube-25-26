
import { useState, useEffect } from 'react';
// CORRECT: Import getDatabase directly from the firebase library
import { getDatabase, ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { adaptSuitData } from '../utils/dataAdapter.js';

const useUserItems = (user) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.uid) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // CORRECT: Initialize the database correctly, letting it use the central firebaseConfig.js
    const db = getDatabase();
    const dbRef = ref(db, 'trajes');
    const userItemsQuery = query(dbRef, orderByChild('ownerId'), equalTo(user.uid));

    const unsubscribe = onValue(userItemsQuery, (snapshot) => {
      try {
        const rawData = snapshot.val();
        if (rawData) {
          const dataArray = Object.keys(rawData).map(key => adaptSuitData(rawData[key], key));
          // Sort by creation date to show newest first
          dataArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setItems(dataArray);
        } else {
          setItems([]); // No items found for this user, not an error.
        }
      } catch (err) {
          console.error("Error processing user items:", err);
          setError(err); // Set error if data processing fails
      } finally {
          setLoading(false);
      }
    }, (err) => {
      console.error("Error fetching user items:", err);
      setError(err);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();

  }, [user]); // Rerun when user object changes

  return { items, loading, error };
};

export default useUserItems;
