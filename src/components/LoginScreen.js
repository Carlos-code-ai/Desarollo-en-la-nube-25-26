import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, rtdb } from '../firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile, 
    GoogleAuthProvider, 
    signInWithPopup 
} from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';

const videos = [
    "/Aspiracional_un_hombre_1080p_202512241651.mp4",
    "/Primer_plano_elegante_1080p_202512241650.mp4",
    "/Visual_un_primer_1080p_202512241703.mp4"
];

const LoginScreen = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [currentVideo, setCurrentVideo] = useState(0);
    const [nextVideo, setNextVideo] = useState(1);
    const [isPrimaryVideoVisible, setIsPrimaryVideoVisible] = useState(true);
    
    const videoRef1 = useRef(null);
    const videoRef2 = useRef(null);

    const handleVideoEnded = () => {
        setIsPrimaryVideoVisible(!isPrimaryVideoVisible);
    };

    useEffect(() => {
        if (isPrimaryVideoVisible) {
            setNextVideo((currentVideo + 1) % videos.length);
        } else {
            setCurrentVideo((nextVideo + 1) % videos.length);
        }
    }, [isPrimaryVideoVisible, currentVideo, nextVideo]);

    useEffect(() => {
        videoRef1.current?.play().catch(e => console.log("Autoplay 1 failed", e));
        videoRef2.current?.play().catch(e => console.log("Autoplay 2 failed", e));
    }, [isPrimaryVideoVisible]);
    
    const videoClasses = "absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000";

    const updateUserProfile = async (user) => {
        const userRef = ref(rtdb, 'users/' + user.uid);
        const snapshot = await get(userRef);
        const updates = {};

        if (snapshot.exists()) {
            const existingData = snapshot.val();
            if (!existingData.email && user.email) updates.email = user.email;
            if (!existingData.displayName && user.displayName) updates.displayName = user.displayName;
            if (!existingData.photoURL && user.photoURL) updates.photoURL = user.photoURL;
            if (Object.keys(updates).length > 0) await update(userRef, updates);
        } else {
            await set(userRef, {
                displayName: user.displayName || name,
                email: user.email,
                photoURL: user.photoURL || '',
            });
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            let userCredential;
            if (isSignUp) {
                if (!name) {
                    setError('Por favor, introduce tu nombre.');
                    setLoading(false);
                    return;
                }
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
                await updateUserProfile(userCredential.user);
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                await updateUserProfile(userCredential.user);
            }
            navigate('/');
        } catch (err) {
            handleAuthError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            await updateUserProfile(result.user);
            navigate('/');
        } catch (err) {
            handleAuthError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthError = (err) => {
        let friendlyMessage = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
        switch (err.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                friendlyMessage = 'El correo electrónico o la contraseña son incorrectos.';
                break;
            case 'auth/email-already-in-use':
                friendlyMessage = 'Este correo electrónico ya está registrado. Por favor, inicia sesión.';
                break;
            case 'auth/weak-password':
                friendlyMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
                break;
            case 'auth/invalid-email':
                friendlyMessage = 'El formato del correo electrónico no es válido.';
                break;
            case 'auth/popup-closed-by-user':
                friendlyMessage = 'El proceso de inicio de sesión fue cancelado.';
                break;
            default:
                console.error("Auth error:", err);
                break;
        }
        setError(friendlyMessage);
    };
    
    return (
        <div className="w-full h-screen flex items-center justify-center bg-black">
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <video 
                    ref={videoRef1} 
                    src={videos[currentVideo]} 
                    className={`${videoClasses} ${isPrimaryVideoVisible ? 'opacity-50' : 'opacity-0'}`} 
                    muted 
                    playsInline 
                    onEnded={handleVideoEnded} 
                />
                <video 
                    ref={videoRef2} 
                    src={videos[nextVideo]} 
                    className={`${videoClasses} ${!isPrimaryVideoVisible ? 'opacity-50' : 'opacity-0'}`} 
                    muted 
                    playsInline 
                    onEnded={handleVideoEnded} 
                />
            </div>
            
            <div className="relative z-10 w-full max-w-md p-8 space-y-4 bg-surface/75 dark:bg-surface-dark/75 backdrop-blur-lg rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-on-surface dark:text-on-surface-dark">
                    {isSignUp ? 'Crear Cuenta' : 'Bienvenido'}
                </h1>
                <form onSubmit={handleAuth} className="space-y-4">
                    {isSignUp && (
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 text-on-surface bg-surface-container-highest rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 text-on-surface bg-surface-container-highest rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 text-on-surface bg-surface-container-highest rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {error && <p className="text-sm text-center text-error">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full py-3 font-bold text-on-primary bg-primary rounded-full hover:bg-primary/90 disabled:bg-on-surface/20">
                        {loading ? 'Cargando...' : (isSignUp ? 'Registrarse' : 'Entrar')}
                    </button>
                </form>
                
                <div className="flex items-center justify-center space-x-2">
                    <hr className="w-full border-outline-variant"/>
                    <span className="px-2 text-sm text-on-surface-variant">O</span>
                    <hr className="w-full border-outline-variant"/>
                </div>

                <button onClick={handleGoogleSignIn} disabled={loading} className="w-full py-3 font-bold text-primary bg-primary-container rounded-full hover:bg-primary-container/90 disabled:bg-on-surface/20 flex items-center justify-center">
                     <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.251,44,30.423,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    Continuar con Google
                </button>

                <p className="text-sm text-center text-on-surface-variant">
                    {isSignUp ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
                    <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(!isSignUp); setError(''); }} className="font-bold text-primary hover:underline ml-1">
                        {isSignUp ? 'Inicia sesión' : 'Regístrate'}
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;
