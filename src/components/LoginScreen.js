import React from 'react';
import { auth, googleProvider } from '../firebase.js';
import { signInWithPopup } from 'firebase/auth';

const LoginScreen = () => {
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center p-8">
        <h1 className="text-5xl font-bold tracking-tight text-on-surface mb-4">
          Ready<span className="text-primary">2</span>Wear
        </h1>
        <p className="text-lg text-on-surface-variant mb-8">
          Tu guardarropa de lujo, a un solo clic.
        </p>
        <button
          onClick={handleSignIn}
          className="rounded-full bg-primary px-8 py-3 text-lg font-semibold text-on-primary shadow-lg hover:scale-105 transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Empezar con Google
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
