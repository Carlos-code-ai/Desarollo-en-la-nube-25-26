import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import { db } from '../firebase.js';
import useAuth from '../hooks/useAuth.js';

const AddSuitPage = () => {
    const [traje, setTraje] = useState({
        nombre: '',
        descripcion: '',
        talla: '',
        color: '',
        precioPorDia: 0,
        imagenes: '',
        disponibilidad: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTraje(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const trajesRef = ref(db, 'trajes');
            const imagenesArray = traje.imagenes.split(',').map(item => item.trim());

            await push(trajesRef, {
                ...traje,
                imagenes: imagenesArray,
                precioPorDia: Number(traje.precioPorDia),
                publicadoPor: user ? user.uid : 'anonymous', // Associate the suit with the logged-in user or anonymous
                // Adding default fields to match data structure
                alquiladoPor: null,
                favoritos: [],
                reportes: [],
                usuario: user ? user.email : "anonimo"
            });
            setSuccess('Traje added successfully!');
            // Reset form
            setTraje({
                nombre: '',
                descripcion: '',
                talla: '',
                color: '',
                precioPorDia: 0,
                imagenes: '',
                disponibilidad: ''
            });
        } catch (error) {
            setError('Error adding traje. Please try again.');
            console.error("Error adding document: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Add a New Traje</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="nombre" placeholder="Nombre" value={traje.nombre} onChange={handleChange} required />
                <textarea name="descripcion" placeholder="Descripcion" value={traje.descripcion} onChange={handleChange} required />
                <input type="text" name="talla" placeholder="Talla" value={traje.talla} onChange={handleChange} required />
                <input type="text" name="color" placeholder="Color" value={traje.color} onChange={handleChange} required />
                <input type="number" name="precioPorDia" placeholder="Precio por dia" value={traje.precioPorDia} onChange={handleChange} required />
                <input type="text" name="imagenes" placeholder="Image URLs (comma-separated)" value={traje.imagenes} onChange={handleChange} />
                <input type="text" name="disponibilidad" placeholder="Disponibilidad" value={traje.disponibilidad} onChange={handleChange} />

                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Traje'}
                </button>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {success && <p style={{color: 'green'}}>{success}</p>}
        </div>
    );
};

export default AddSuitPage;
