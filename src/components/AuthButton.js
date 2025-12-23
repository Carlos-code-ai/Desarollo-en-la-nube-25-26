
import { auth, googleProvider } from '../firebase.js';
import { signInWithPopup, signOut } from 'firebase/auth';
import useAuth from '../hooks/useAuth.js';

const AuthButton = () => {
    const { user, loading } = useAuth();

    const handleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error during sign in:", error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error during sign out:", error);
        }
    };

    if (loading) {
        return <div className="w-24 h-9 bg-neutral-200 rounded-full animate-pulse"></div>
    }

    return (
        <>
            {user ? (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-700 hidden sm:inline">Hola, {user.displayName?.split(' ')[0]}</span>
                    <button 
                        onClick={handleSignOut}
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 transition-colors duration-300 ease-in-out active:scale-95"
                    >
                        Salir
                    </button>
                </div>
            ) : (
                <button 
                    onClick={handleSignIn}
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 transition-colors duration-300 ease-in-out active:scale-95"
                >
                    Login
                </button>
            )}
        </>
    );
};

export default AuthButton;
