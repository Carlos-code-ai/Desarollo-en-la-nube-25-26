import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const EditProfilePage = () => {
  const { user, loading, updateUserProfileAndPhoto } = useAuth();
  const [newName, setNewName] = useState(user?.displayName || '');
  const [imageFile, setImageFile] = useState(null);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserProfileAndPhoto(newName, imageFile);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h1 className="text-4xl font-bold text-on-surface mb-8">Editar Perfil</h1>
      {loading ? (
        <p>Guardando cambios...</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-lg text-on-surface-variant mb-2">Nombre</label>
            <input 
              type="text" 
              id="name" 
              value={newName} 
              onChange={handleNameChange} 
              className="px-4 py-2 bg-surface-variant text-on-surface rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="profile-picture" className="text-lg text-on-surface-variant mb-2">Foto de Perfil</label>
            <input 
              type="file" 
              id="profile-picture" 
              onChange={handleImageChange} 
              className="px-4 py-2 bg-surface-variant text-on-surface rounded-md"
            />
          </div>
          <button 
            type="submit" 
            className="px-6 py-3 bg-primary text-on-primary font-semibold rounded-full shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
            disabled={loading}
          >
            Guardar Cambios
          </button>
        </form>
      )}
      <Link 
        to="/profile"
        className="mt-8 text-lg text-primary hover:underline"
      >
        Volver al Perfil
      </Link>
    </div>
  );
};

export default EditProfilePage;
