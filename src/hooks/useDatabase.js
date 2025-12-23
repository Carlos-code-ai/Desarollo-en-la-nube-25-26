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
          const dataArray = Object.keys(val).map(key => ({ ...val[key], id: key }));
          setData(dataArray);
        } else {
          setData([]);
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
  }, [path, Date.now()]);

  return { data, loading, error };
};

export default useDatabase;
