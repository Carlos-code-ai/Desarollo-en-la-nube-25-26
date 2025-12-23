import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebase.js';

const EditSuitPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [traje, setTraje] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const trajeRef = ref(db, `trajes/${id}`);
        onValue(trajeRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Ensure imagenes is a string for the input field
                data.imagenes = Array.isArray(data.imagenes) ? data.imagenes.join(', ') : '';
                setTraje(data);
            } else {
                setError('Suit not found.');
            }
            setLoading(false);
        });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTraje(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const trajeRef = ref(db, `trajes/${id}`);
            const imagenesArray = traje.imagenes.split(',').map(item => item.trim());

            await update(trajeRef, {
                ...traje,
                imagenes: imagenesArray,
                precioPorDia: Number(traje.precioPorDia),
            });
            navigate('/');
        } catch (error) {
            setError('Failed to update suit.');
            console.error("Error updating suit: ", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Edit Suit</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="nombre" placeholder="Nombre" value={traje.nombre} onChange={handleChange} required />
                <textarea name="descripcion" placeholder="Descripcion" value={traje.descripcion} onChange={handleChange} required />
                <input type="text" name="talla" placeholder="Talla" value={traje.talla} onChange={handleChange} required />
                <input type="text" name="color" placeholder="Color" value={traje.color} onChange={handleChange} required />
                <input type="number" name="precioPorDia" placeholder="Precio por dia" value={traje.precioPorDia} onChange={handleChange} required />
                <input type="text" name="imagenes" placeholder="Image URLs (comma-separated)" value={traje.imagenes} onChange={handleChange} />
                <input type="text" name="disponibilidad" placeholder="Disponibilidad" value={traje.disponibilidad} onChange={handleChange} />
                <button type="submit" disabled={loading}>Update Suit</button>
            </form>
        </div>
    );
};

export default EditSuitPage;
