
import React, { useState } from 'react';
import useAuth from '../hooks/useAuth.js';
// The hook now takes the entire user object to handle different ID fields
import useUserItems from '../hooks/useUserItems.js'; 
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, remove } from 'firebase/database';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';

// --- Individual Suit Item for the list (Modernized) ---
const MySuitListItem = ({ suit, onEdit, onDelete, isDeleting }) => {
    const { name, price, imageUrl, state } = suit;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className="flex items-center gap-4 p-3 bg-surface-container rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            <img src={Array.isArray(suit.imageUrls) && suit.imageUrls.length > 0 ? suit.imageUrls[0] : suit.imageUrl} alt={name} className="w-16 h-20 object-cover rounded-lg" />
            <div className="flex-grow">
                <h3 className="font-bold text-on-surface text-lg">{name}</h3>
                <p className="text-primary font-semibold">€{price}/día</p>
                <p className="text-sm text-on-surface-variant capitalize">{state || 'Disponible'}</p>
            </div>
            <div className="flex items-center space-x-2">
                <button 
                    onClick={onEdit} 
                    aria-label="Editar"
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all duration-300 transform hover:scale-110"
                >
                    <span className="material-icons-outlined text-xl">edit</span>
                </button>
                
                <button 
                    onClick={onDelete} 
                    disabled={isDeleting}
                    aria-label="Eliminar"
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container-high text-error hover:bg-error/10 transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
                >
                    {isDeleting 
                        ? <motion.div animate={{rotate: 360}} transition={{repeat: Infinity, duration: 1, ease: 'linear'}}><span className="material-icons-outlined text-xl">sync</span></motion.div>
                        : <span className="material-icons-outlined text-xl">delete</span>
                    }
                </button>
            </div>
        </motion.div>
    );
};


// --- Main Page Component ---
const MyItemsPage = () => {
    const { user } = useAuth();
    // Pass the entire user object to the hook
    const { items: myItems, loading, error } = useUserItems(user);
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState(null);

    const handleEdit = (suitId) => {
        navigate(`/edit-suit/${suitId}`);
    };

    const handleDelete = async (suit) => {
        if (!suit || !suit.id) return;
        
        const isConfirmed = window.confirm(`¿Estás seguro de que quieres eliminar "${suit.name}"? Esta acción no se puede deshacer.`);
        if (!isConfirmed) return;

        setDeletingId(suit.id);
        try {
            const storage = getStorage();
            const imageUrls = suit.imageUrls || (suit.imageUrl ? [suit.imageUrl] : []);
            
            for (const url of imageUrls) {
                 if (url && url.includes('firebasestorage.googleapis.com')) {
                    const imageRef = storageRef(storage, url);
                    await deleteObject(imageRef).catch(err => console.warn("Could not delete image.", err));
                }
            }

            const db = getDatabase();
            const suitRef = ref(db, `trajes/${suit.id}`);
            await remove(suitRef);

        } catch (error) {
            console.error("Error deleting suit:", error);
            alert("Hubo un problema al eliminar el traje. Por favor, inténtalo de nuevo.");
        } finally {
            setDeletingId(null);
        }
    };
    
    if (error) {
        return <div className="text-center py-10 text-error">Error al cargar tus artículos. Por favor, recarga la página.</div>
    }

    if (loading) {
        return <div className="text-center py-10 text-on-surface-variant">Cargando tus trajes...</div>;
    }

    if (myItems.length === 0) {
        return (
             <div className="text-center py-12 px-6">
                <h2 className="text-2xl font-bold text-on-surface mb-4">Tu armario está vacío</h2>
                <p className="text-on-surface-variant mb-6">Añade tu primer traje y empieza a compartir tu estilo.</p>
                <button onClick={() => navigate('/add-suit')} className="px-6 py-3 bg-primary text-on-primary rounded-full font-bold shadow-lg hover:bg-opacity-90 transition-all">
                    Añadir Traje
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-on-surface">Tu Armario ({myItems.length})</h2>
                 <button onClick={() => navigate('/add-suit')} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-full font-semibold hover:bg-opacity-90 transition-colors">
                    <span className="material-icons-outlined">add</span>
                    <span>Añadir Traje</span>
                </button>
            </div>
            <div className="space-y-4">
                <AnimatePresence>
                    {myItems.map(item => (
                        <MySuitListItem 
                            key={item.id} 
                            suit={item} 
                            onEdit={() => handleEdit(item.id)}
                            onDelete={() => handleDelete(item)}
                            isDeleting={deletingId === item.id}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MyItemsPage;
