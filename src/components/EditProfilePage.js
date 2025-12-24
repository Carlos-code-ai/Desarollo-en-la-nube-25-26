
import React from 'react';
import { Link } from 'react-router-dom';

const EditProfilePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <span className="material-icons text-6xl text-primary mb-4">engineering</span>
        <h1 className="text-4xl font-bold text-on-surface mb-2">¡En Construcción!</h1>
        <p className="text-lg text-on-surface-variant mb-8">Estamos trabajando para que puedas editar tu perfil muy pronto.</p>
        <Link 
            to="/profile"
            className="px-6 py-3 bg-primary text-on-primary font-semibold rounded-full shadow-lg hover:scale-105 transition-transform"
        >
            Volver al Perfil
        </Link>
    </div>
  );
};

export default EditProfilePage;
