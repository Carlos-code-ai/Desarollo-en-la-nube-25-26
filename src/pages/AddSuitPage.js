
import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import { db } from '../firebase.js';

const AddSuitPage = () => {
    const [traje, setTraje] = useState({
        fotos: '',
        talla: '',
        marca: '',
        color: '',
        tejido: '',
        estilo: '',
        estado: 'Nuevo',
        tipoEvento: '',
        precio: 0,
        disponibilidad: '',
        descripcion: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

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
            // Convert comma-separated strings to arrays
            const fotosArray = traje.fotos.split(',').map(item => item.trim());
            const disponibilidadArray = traje.disponibilidad.split(',').map(item => item.trim());

            await push(trajesRef, {
                ...traje,
                fotos: fotosArray,
                disponibilidad: disponibilidadArray,
                precio: Number(traje.precio),
                reportes: [],
                usuario: "anonimo", // Set to anonymous as requested
                publicadoPor: "anonimo", // Set to anonymous as requested
                alquiladoPor: null,
                favoritos: []
            });
            setSuccess('Traje added successfully!');
            // Reset form
            setTraje({
                fotos: '',
                talla: '',
                marca: '',
                color: '',
                tejido: '',
                estilo: '',
                estado: 'Nuevo',
                tipoEvento: '',
                precio: 0,
                disponibilidad: '',
                descripcion: ''
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
                <input type="text" name="marca" placeholder="Marca" value={traje.marca} onChange={handleChange} required />
                <input type="text" name="talla" placeholder="Talla" value={traje.talla} onChange={handleChange} required />
                <input type="text" name="color" placeholder="Color" value={traje.color} onChange={handleChange} required />
                <input type="text" name="tejido" placeholder="Tejido" value={traje.tejido} onChange={handleChange} />
                <input type="text" name="estilo" placeholder="Estilo" value={traje.estilo} onChange={handleChange} />
                <select name="estado" value={traje.estado} onChange={handleChange}>
                    <option value="Nuevo">Nuevo</option>
                    <option value="Usado">Usado</option>
                </select>
                <input type="text" name="tipoEvento" placeholder="Tipo de Evento" value={traje.tipoEvento} onChange={handleChange} />
                <input type="number" name="precio" placeholder="Precio por dia" value={traje.precio} onChange={handleChange} required />
                <textarea name="descripcion" placeholder="Descripcion" value={traje.descripcion} onChange={handleChange} required />
                <input type="text" name="fotos" placeholder="Image URLs (comma-separated)" value={traje.fotos} onChange={handleChange} />
                <input type="text" name="disponibilidad" placeholder="Availability (comma-separated dates)" value={traje.disponibilidad} onChange={handleChange} />

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
