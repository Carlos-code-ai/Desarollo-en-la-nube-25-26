import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase.js';

const useDatabase = (path) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dbRef = ref(db, path);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      try {
        const val = snapshot.val();
        if (val) {
          // Convert the object of objects into an array of objects
          const dataArray = Object.keys(val).map(key => ({ ...val[key], id: key }));
          setData(dataArray);
        } else {
          setData([]); // Handle case where there is no data
        }
      } catch (err) {
        setError(err);
        console.error("Error processing data: ", err);
      }
      setLoading(false);
    }, (err) => {
      // This is the error callback for onValue
      setError(err);
      setLoading(false);
      console.error("Error fetching data: ", err);
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [path]);

  return { data, loading, error };
};

export default useDatabase;
