import React, { useState } from 'react';
import { db } from '../firebase.js';
import { ref, remove, update } from 'firebase/database';
import useAuth from '../hooks/useAuth.js';
import useRealtimeDB from '../hooks/useRealtimeDB.js';

import Modal from './Modal.js';
import AddSuitForm from './AddSuitForm.js';

// --- Iconos ---
const EditIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;
const DeleteIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;


const MyItemsPage = () => {
  const { user } = useAuth(); // Hook para obtener el usuario actual
  
  // Hook para obtener los trajes, filtrados por el ID del propietario
  const { docs: myItems, loading, error } = useRealtimeDB('trajes', 'ownerId', user ? user.uid : null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSuit, setEditingSuit] = useState(null); // Estado para el traje que se está editando

  // --- Handlers ---

  const handleEdit = (suit) => {
    setEditingSuit(suit); // Guarda el traje completo
    setIsModalOpen(true);
  };

  const handleDelete = async (suitId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este artículo? Esta acción no se puede deshacer.')) {
        try {
            const suitRef = ref(db, `trajes/${suitId}`);
            await remove(suitRef);
            // Los datos se actualizarán automáticamente gracias al hook useRealtimeDB
        } catch (error) {
            console.error("Error al eliminar el artículo:", error);
            alert('Hubo un error al eliminar el artículo. Por favor, inténtalo de nuevo.');
        }
    }
  };

  const handleUpdate = async (suitId, updatedData) => {
    try {
        const suitRef = ref(db, `trajes/${suitId}`);
        await update(suitRef, updatedData);
        setIsModalOpen(false);
        setEditingSuit(null);
    } catch (error) {
        console.error("Error al actualizar el artículo:", error);
        alert('Hubo un error al guardar los cambios. Por favor, inténtalo de nuevo.');
    }
  };

  // --- Renderizado ---

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col space-y-6">
      <h1 className="text-3xl font-bold text-on-surface">Mis Artículos</h1>

      {loading && <p>Cargando tus artículos...</p>}
      {error && <p className="text-error">Error al cargar los artículos.</p>}

      <div className="space-y-4">
        {!loading && myItems.length === 0 ? (
          <div className="text-center py-16 px-6 bg-surface-container rounded-3xl">
            <h2 className="text-xl font-semibold text-on-surface">Aún no has publicado nada</h2>
            <p className="text-on-surface-variant mt-2">¡Añade tu primer traje y empieza a ganar dinero!</p>
          </div>
        ) : (
          myItems.map(item => (
            <div key={item.id} className="flex items-center space-x-4 bg-surface p-3 rounded-2xl shadow-sm transition-shadow hover:shadow-md">
              <img src={item.imageUrl} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
              <div className="flex-grow">
                <h2 className="font-bold text-lg text-on-surface">{item.name}</h2>
                <p className="text-on-surface-variant">€{item.price}/día</p>
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
          ))
        )}
      </div>

      {/* Modal para Editar */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddSuitForm 
          onUpdate={handleUpdate}
          onCancel={() => { setIsModalOpen(false); setEditingSuit(null); }}
          suitToEdit={editingSuit}
        />
      </Modal>
    </div>
  );
};

export default MyItemsPage;

