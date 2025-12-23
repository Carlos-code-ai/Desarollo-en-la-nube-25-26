
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore"; 
import { db } from '../firebase.js';

/**
 * Hook de React para obtener documentos de una colección de Firestore.
 * @param {string} collectionName - El nombre de la colección a consultar.
 */
const useFirestore = (collectionName) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        // Creamos una referencia a la colección que queremos
        const collectionRef = collection(db, collectionName);
        
        // Por ahora, solo traeremos los trajes que están publicados
        const q = query(collectionRef, where("isPublished", "==", true));

        const querySnapshot = await getDocs(q);
        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setDocs(documents);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();

  }, [collectionName]); // El efecto se ejecuta cada vez que el nombre de la colección cambia

  return { docs, loading, error };
};

export default useFirestore;
