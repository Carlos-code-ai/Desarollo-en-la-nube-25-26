import { useState, useEffect } from 'react';
import { ref, onValue } from "firebase/database";
import { db } from '../firebase.js'; // Corrected import

/**
 * Hook de React para obtener datos de una ruta de Realtime Database.
 * @param {string} path - La ruta en la base de datos a consultar (ej. 'trajes').
 */
const useRealtimeDB = (path) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dbRef = ref(db, path);
    
    const unsubscribe = onValue(dbRef, (snapshot) => {
      try {
        const val = snapshot.val();
        if (val) {
          const dataArray = Object.keys(val).map(key => ({ ...val[key], id: key }));
          setDocs(dataArray);
        } else {
          setDocs([]);
        }
      } catch (err) {
        setError(err);
        console.error("Error processing data: ", err);
      }
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
      console.error("Error fetching data: ", err);
    });

    return () => unsubscribe();
  }, [path]);

  return { docs, loading, error };
};

export default useRealtimeDB;
