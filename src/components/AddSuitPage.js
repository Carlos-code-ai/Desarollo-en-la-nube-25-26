import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { ref, push } from 'firebase/database';
import useAuth from '../hooks/useAuth';

const AddSuitPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [suitData, setSuitData] = useState({
        name: '',
        size: '',
        price: '',
        imageUrl: '',
        eventType: '',
        condition: '',
        colors: '',
        description: '',
        materials: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuitData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Debes iniciar sesión para añadir un traje.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const suitsRef = ref(db, 'trajes');
            await push(suitsRef, {
                ...suitData,
                ownerId: user.uid,
                ownerName: user.displayName,
                ownerPhotoURL: user.photoURL,
                createdAt: new Date().toISOString(),
            });
            alert('¡Traje añadido con éxito!');
            navigate('/my-items');
        } catch (err) {
            console.error("Error al añadir el traje:", err);
            setError('Hubo un problema al añadir el traje. Por favor, inténtalo de nuevo.');
        }

        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-6">Añadir Nuevo Traje</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Nombre del Traje */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-on-surface-variant">Nombre del Traje</label>
                        <input type="text" name="name" id="name" required value={suitData.name} onChange={handleChange} className="mt-1 block w-full rounded-md bg-surface-container border-outline/50 shadow-sm focus:border-primary focus:ring-primary" />
                    </div>

                    {/* Precio por día */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-on-surface-variant">Precio por día (€)</label>
                        <input type="number" name="price" id="price" required value={suitData.price} onChange={handleChange} className="mt-1 block w-full rounded-md bg-surface-container border-outline/50 shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                </div>

                 {/* URL de la Imagen */}
                 <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-on-surface-variant">URL de la Imagen</label>
                    <input type="url" name="imageUrl" id="imageUrl" required value={suitData.imageUrl} onChange={handleChange} className="mt-1 block w-full rounded-md bg-surface-container border-outline/50 shadow-sm focus:border-primary focus:ring-primary" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Talla */}
                    <div>
                        <label htmlFor="size" className="block text-sm font-medium text-on-surface-variant">Talla</label>
                        <input type="text" name="size" id="size" required value={suitData.size} onChange={handleChange} className="mt-1 block w-full rounded-md bg-surface-container border-outline/50 shadow-sm focus:border-primary focus:ring-primary" />
                    </div>

                    {/* Tipo de Evento */}
                    <div>
                        <label htmlFor="eventType" className="block text-sm font-medium text-on-surface-variant">Tipo de Evento</label>
                        <select name="eventType" id="eventType" value={suitData.eventType} onChange={handleChange} className="mt-1 block w-full rounded-md bg-surface-container border-outline/50 shadow-sm focus:border-primary focus:ring-primary">
                            <option value="">Selecciona un tipo</option>
                            <option value="boda">Boda</option>
                            <option value="gala">Gala</option>
                            <option value="negocios">Negocios</option>
                            <option value="fiesta">Fiesta</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Estado */}
                    <div>
                        <label htmlFor="condition" className="block text-sm font-medium text-on-surface-variant">Estado</label>
                        <select name="condition" id="condition" value={suitData.condition} onChange={handleChange} className="mt-1 block w-full rounded-md bg-surface-container border-outline/50 shadow-sm focus:border-primary focus:ring-primary">
                            <option value="">Selecciona el estado</option>
                            <option value="nuevo">Nuevo</option>
                            <option value="como-nuevo">Como nuevo</option>
                            <option value="bueno">Bueno</option>
                            <option value="usado">Usado</option>
                        </select>
                    </div>
                     {/* Colores */}
                     <div>
                        <label htmlFor="colors" className="block text-sm font-medium text-on-surface-variant">Colores</label>
                        <input type="text" name="colors" id="colors" value={suitData.colors} onChange={handleChange} placeholder="Ej: Negro, Azul marino" className="mt-1 block w-full rounded-md bg-surface-container border-outline/50 shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-on-surface-variant">Descripción</label>
                    <textarea name="description" id="description" rows="4" value={suitData.description} onChange={handleChange} className="mt-1 block w-full rounded-md bg-surface-container border-outline/50 shadow-sm focus:border-primary focus:ring-primary"></textarea>
                </div>

                {/* Materiales */}
                <div>
                    <label htmlFor="materials" className="block text-sm font-medium text-on-surface-variant">Materiales</label>
                    <input type="text" name="materials" id="materials" value={suitData.materials} onChange={handleChange} placeholder="Ej: Lana, Seda, Algodón" className="mt-1 block w-full rounded-md bg-surface-container border-outline/50 shadow-sm focus:border-primary focus:ring-primary" />
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex justify-end gap-4 pt-4">
                     <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 rounded-full border-2 border-outline text-on-surface font-semibold hover:bg-surface-container transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading} className="px-8 py-2 rounded-full bg-primary text-on-primary font-bold hover:scale-105 transition-transform disabled:bg-surface-container-high disabled:text-on-surface-variant">
                        {loading ? 'Añadiendo...' : 'Añadir Traje'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddSuitPage;
