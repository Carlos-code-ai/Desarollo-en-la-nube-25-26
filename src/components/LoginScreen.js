
import React, { useRef, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import { gsap } from 'gsap';

const VideoBackground = () => {
    const videos = [
        "/Aspiracional_un_hombre_1080p_202512241651.mp4",
        "/Primer_plano_elegante_1080p_202512241650.mp4",
        "/Visual_un_primer_1080p_202512241703.mp4"
    ];

    const videoRefs = [useRef(null), useRef(null), useRef(null)];

    useEffect(() => {
        const players = videoRefs.map(ref => ref.current);

        const playNext = (current) => {
            const next = (current + 1) % videos.length;

            gsap.to(players[current], { opacity: 0, duration: 1 });
            gsap.fromTo(players[next], { opacity: 0 }, { opacity: 1, duration: 1 });
            if (players[next]) {
                players[next].play();
            }
        };

        players.forEach((player, index) => {
            if (player) {
                player.addEventListener('ended', () => playNext(index));
                // Set initial opacity for animation
                gsap.set(player, { opacity: index === 0 ? 1 : 0 });
            }
        });

        // Start the first video
        if (players[0]) {
            players[0].play().catch(error => console.error("Video autoplay was prevented:", error));
        }

        return () => {
            players.forEach((player, index) => {
                if (player) {
                    player.removeEventListener('ended', () => playNext(index));
                }
            });
        };
    }, [videoRefs, videos.length]);

    return (
        <div className="absolute top-0 left-0 w-full h-full -z-1 overflow-hidden bg-black">
            {videos.map((src, index) => (
                <video key={src} ref={videoRefs[index]} src={src} muted playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
            ))}
        </div>
    );
}


// --- Componentes de la Interfaz ---

const GoogleIcon = () => (
    <svg className="h-6 w-6" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
);

const FloatingLabelInput = ({ label, type = 'text' }) => (
    <div className="relative w-full">
        <input 
            type={type}
            id={label}
            className="block w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all peer"
            placeholder={label}
        />
        <label 
            htmlFor={label} 
            className="absolute left-4 top-3 text-white/70 transition-all duration-300 pointer-events-none 
                       peer-placeholder-shown:text-base peer-placeholder-shown:top-3 
                       peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary 
                       -top-2.5 text-xs"
        >
            {label}
        </label>
    </div>
);


// --- Pantalla de Login Principal ---

const LoginScreen = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const buttonRef = useRef(null);

  const handleLogin = async () => {
    gsap.fromTo(buttonRef.current, { scale: 1 }, { scale: 1.05, yoyo: true, repeat: 1, duration: 0.1, ease: 'power1.inOut' });
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900"><div className="text-white text-xl">Cargando...</div></div>;
  }

  if (user) {
    return null; // No renderizar nada si el usuario ya está logueado
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4 relative'>
        <VideoBackground />
        <div className="w-full max-w-md p-8 md:p-12 space-y-8 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl text-white">
          
          <div className="text-center animate-fade-in-down-1">
            <img src="/logo.png" alt="Ready2Wear Logo" className="mx-auto mb-4 h-32 filter-none" />
            <h1 className="text-3xl font-bold tracking-tighter text-shadow">Ready<span className="text-primary">2</span>Wear</h1>
          </div>

          <div className="space-y-6 animate-fade-in-down-2">
              <FloatingLabelInput label="Correo Electrónico" type="email" />
              <FloatingLabelInput label="Contraseña" type="password" />
          </div>
          
          <div className="space-y-4 animate-fade-in-down-3">
              <button 
                  className='w-full bg-primary text-on-primary font-bold py-3 px-6 rounded-full transition-transform hover:scale-105 active:scale-100 shadow-lg'
              >
                  Iniciar Sesión
              </button>

              <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-white/20"></div>
                  <span className="flex-shrink mx-4 text-sm text-white/70">O continua con</span>
                  <div className="flex-grow border-t border-white/20"></div>
              </div>

              <button 
                ref={buttonRef}
                onClick={handleLogin} 
                className='w-full bg-white/90 text-gray-800 font-bold py-3 px-6 rounded-full flex items-center justify-center space-x-3 transition-transform hover:scale-105 active:scale-100 shadow-lg'
              >
                <GoogleIcon />
                <span>Continuar con Google</span>
              </button>
          </div>

          <p className="text-center text-xs text-white/50 animate-fade-in-down-4">
              ¿Aún no tienes cuenta? <a href="#" className="font-semibold text-primary hover:underline">Regístrate</a>
          </p>
        </div>
    </div>
  );
};

export default LoginScreen;
