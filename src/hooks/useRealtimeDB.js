
import { useState, useEffect } from 'react';
import { ref, onValue } from "firebase/database";
import { db } from '../firebase.js'; // db es ahora la instancia de Realtime Database

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

    // onValue escucha los cambios en la ruta especificada
    const unsubscribe = onValue(dbRef, (snapshot) => {
      try {
        setLoading(true);
        const data = snapshot.val();
        if (data) {
          // Convertimos el objeto de objetos en un array de objetos
          const documents = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setDocs(documents);
        } else {
          setDocs([]); // No hay datos en esa ruta
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error al procesar los datos. Por favor, inténtelo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    }, (err) => {
        // Manejo de errores de la propia subscripción (ej. permisos denegados)
        console.error(err);
        setError("Error al acceder a los datos. Verifique su conexión y los permisos de la base de datos.");
        setLoading(false);
    });

    // La función de limpieza que devuelve useEffect se encarga de cancelar la subscripción
    // cuando el componente se desmonta.
    return () => unsubscribe();

  }, [path]); // El efecto se ejecuta cada vez que la ruta cambia

  return { docs, loading, error };
};

export default useRealtimeDB;
