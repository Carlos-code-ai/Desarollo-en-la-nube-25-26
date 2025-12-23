import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signup = (email, password) => {
        const auth = getAuth();
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email, password) => {
        const auth = getAuth();
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        const auth = getAuth();
        return signOut(auth);
    };

    return { user, loading, signup, login, logout };
};

export default useAuth;
