import React from 'react';
import useAuth from '../hooks/useAuth.js'; // Corrected import

const LoginScreen = () => {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (user) {
    return null;
  }

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  return (
    <div className='login-screen'>
      <button onClick={handleLogin} className='login-provider-button'>
        <span>Continuar con Google</span>
      </button>
    </div>
  );
};

export default LoginScreen;
