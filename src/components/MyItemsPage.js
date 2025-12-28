
import React, { useState, useMemo } from 'react';
import { rtdb, storage } from '../firebase.js';
import { ref, remove, update } from 'firebase/database';
import { ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage';
import useAuth from '../hooks/useAuth.js';
import useRealtimeDB from '../hooks/useRealtimeDB.js';

import Modal from './Modal.js';
import AddSuitForm from './AddSuitForm.js';

const EditIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;
const DeleteIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;

const MyItemsPage = () => {
  const { user } = useAuth();
  const { docs: allSuits, loading, error } = useRealtimeDB('trajes');

  // More robust filtering to handle legacy data structures.
  const myFilteredItems = useMemo(() => {
    if (!user) return [];
    return allSuits.filter(suit => {
        const isOwnerByUID = suit.ownerId === user.uid;
        const isOwnerByLegacyUsuario = suit.usuario === user.uid || (user.displayName && suit.usuario === user.displayName);
        const isOwnerByLegacyPublicadoPor = user.displayName && suit.publicadoPor === user.displayName;
        return isOwnerByUID || isOwnerByLegacyUsuario || isOwnerByLegacyPublicadoPor;
    });
  }, [allSuits, user]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSuit, setEditingSuit] = useState(null);

  const handleEdit = (suit) => {
    setEditingSuit(suit);
    setIsModalOpen(true);
  };

  const handleDelete = async (suitId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este artículo? Esta acción no se puede deshacer.')) {
      try {
        await remove(ref(rtdb, `trajes/${suitId}`));
      } catch (error) {
        console.error("Error al eliminar el artículo:", error);
        alert('Hubo un error al eliminar el artículo.');
      }
    }
  };

  // When updating, migrate the data to the new structure.
  const handleUpdateSuit = async (updatedData) => {
    if (!editingSuit?.id) return;

    try {
      const uploadedImageUrls = await Promise.all(
        (updatedData.imageUrls || []).map(async (url) => {
          if (url.startsWith('data:image')) {
            const fileRef = storageRef(storage, `suits/${user.uid}/${Date.now()}`);
            const uploadResult = await uploadString(fileRef, url, 'data_url');
            return await getDownloadURL(uploadResult.ref);
          }
          return url;
        })
      );

      const finalData = {
        ...updatedData,
        ownerId: user.uid, // Set the modern ownerId
        imageUrls: uploadedImageUrls,
        imageUrl: uploadedImageUrls[0] || '',
        price: Number(updatedData.price) || 0,
        usuario: null, // Remove legacy field
        publicadoPor: null, // Remove legacy field
      };

      await update(ref(rtdb, `trajes/${editingSuit.id}`), finalData);

      setIsModalOpen(false);
      setEditingSuit(null);
    } catch (error) {
      console.error("Error al actualizar el artículo:", error);
      alert('Hubo un error al guardar los cambios.');
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-16"><p>Cargando tus artículos...</p></div>;
    }
    if (error) {
      return <div className="text-center py-16 text-error"><p>Error al cargar los artículos.</p></div>;
    }
    if (myFilteredItems.length === 0) {
      return (
        <div className="text-center py-16 px-6 bg-surface-container rounded-3xl">
          <h2 className="text-xl font-semibold text-on-surface">Aún no has publicado nada</h2>
          <p className="text-on-surface-variant mt-2">Usa el botón de <span className="font-semibold text-primary">"Añadir traje"</span> para empezar a ganar dinero.</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {myFilteredItems.map(item => {
          const displayImage = (item.imageUrls && item.imageUrls[0]) || item.imageUrl;
          return (
            <div key={item.id} className="flex items-center space-x-4 bg-surface p-3 rounded-2xl shadow-sm transition-shadow hover:shadow-md">
              <img src={displayImage} alt={item.name} className="h-24 w-24 rounded-lg object-cover bg-surface-container" />
              <div className="flex-grow">
                <h2 className="font-bold text-lg text-on-surface">{item.name}</h2>
                <p className="text-on-surface-variant">€{item.price}/día</p>
                <p className={`text-sm font-semibold mt-1 ${item.isAvailable === false ? 'text-error' : 'text-tertiary'}`}>
                  {item.isAvailable === false ? 'Alquilado' : 'Disponible'}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <button onClick={() => handleEdit(item)} className="flex items-center justify-center space-x-2 w-24 px-3 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors">
                  <EditIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Editar</span>
                </button>
                <button onClick={() => handleDelete(item.id)} className="flex items-center justify-center space-x-2 w-24 px-3 py-2 rounded-lg bg-error-container text-on-error-container hover:bg-error-container/80 transition-colors">
                  <DeleteIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Eliminar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col space-y-6">
      {renderContent()}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddSuitForm
          onSubmit={handleUpdateSuit}
          onCancel={() => { setIsModalOpen(false); setEditingSuit(null); }}
          suitToEdit={editingSuit}
        />
      </Modal>
    </div>
  );
};

export default MyItemsPage;
