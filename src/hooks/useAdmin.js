
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === 'cllabresllovet@gmail.com') {
          setIsAdmin(true);
          setLoading(false);
        } else {
          const userRoleRef = ref(db, `users/${user.uid}/role`);
          const unsubscribeRole = onValue(userRoleRef, (snapshot) => {
            const userRole = snapshot.val();
            setIsAdmin(userRole === 'admin');
            setLoading(false);
          }, (error) => {
            console.error("Error fetching admin status:", error);
            setIsAdmin(false);
            setLoading(false);
          });
          return () => unsubscribeRole();
        }
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return { isAdmin, loading };
};

export default useAdmin;
