
import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue, remove, update } from 'firebase/database';
import { rtdb } from '../firebase';
import { gsap } from 'gsap';
import ModernDropdown from './ModernDropdown';

const ActionIcon = ({ icon, onClick, colorClass, hoverColorClass }) => {
    const iconRef = useRef(null);

    const handleMouseEnter = () => {
        gsap.to(iconRef.current, { scale: 1.2, color: hoverColorClass, duration: 0.2, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
        gsap.to(iconRef.current, { scale: 1, color: colorClass, duration: 0.2, ease: 'power2.inOut' });
    };

    return (
        <button
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="p-2 rounded-full focus:outline-none transition-colors"
        >
            <span ref={iconRef} className={`material-icons ${colorClass} transition-colors`}>
                {icon}
            </span>
        </button>
    );
};

const ManageSuits = () => {
    const [suits, setSuits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingRowId, setEditingRowId] = useState(null);
    const [editedData, setEditedData] = useState({});

    // Constants for dropdown options
    const suitConditions = ["Nuevo con etiqueta", "Nuevo sin etiqueta", "Poco uso", "Usado", "Signos de desgaste"];
    const suitColors = ["Negro", "Azul", "Gris", "Blanco", "Beige", "Marrón", "Verde", "Rojo", "Otro"];
    const suitMaterials = ["Lana", "Algodón", "Lino", "Seda", "Poliéster", "Mezcla", "Otro"];
    const eventTypes = ["Boda", "Fiesta", "Gala", "Casual", "Trabajo", "Ceremonia", "Entrevista", "Otro"];

    useEffect(() => {
        const suitsRef = ref(rtdb, 'trajes');
        const unsubscribe = onValue(suitsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const suitList = Object.keys(data).map(key => ({ ...data[key], id: key }));
                setSuits(suitList);
            } else {
                setSuits([]);
            }
            setLoading(false);
        }, (error) => {
            console.error("Firebase read error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this suit?')) {
            remove(ref(rtdb, `trajes/${id}`))
                .catch(error => console.error("Error deleting suit:", error));
        }
    };

    const handleEdit = (suit) => {
        setEditingRowId(suit.id);
        setEditedData({ ...suit });
    };

    const handleCancel = () => {
        setEditingRowId(null);
        setEditedData({});
    };

    const handleSave = (id) => {
        const { name, size, price, description, state, eventType, color, material } = editedData;
        const suitRef = ref(rtdb, `trajes/${id}`);
        update(suitRef, { name, size, price, description, state, eventType, color, material })
            .then(() => {
                setEditingRowId(null);
                setEditedData({});
            })
            .catch(error => console.error("Error updating suit:", error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-lg font-semibold text-on-surface-variant">Cargando trajes...</p>
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-on-surface">Trajes Publicados</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-on-surface-variant">
                    <thead className="border-b border-outline-variant">
                        <tr className="text-on-surface font-semibold">
                            <th className="p-4">Imagen</th>
                            <th className="p-4">Nombre</th>
                            <th className="p-4">Talla</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4">Descripción</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4">Color</th>
                            <th className="p-4">Material</th>
                            <th className="p-4">Tipo de Evento</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suits.map(suit => (
                            <tr key={suit.id} className="border-b border-surface-container-high hover:bg-surface-container">
                                {editingRowId === suit.id ? (
                                    <>
                                        <td className="p-4"><img src={editedData.imageUrl} alt={editedData.name} className="h-16 w-16 object-cover rounded-lg" /></td>
                                        <td className="p-4"><input name="name" value={editedData.name} onChange={handleInputChange} className="w-full p-2 bg-surface-container-lowest border border-outline rounded-lg" /></td>
                                        <td className="p-4"><input name="size" value={editedData.size} onChange={handleInputChange} className="w-full p-2 bg-surface-container-lowest border border-outline rounded-lg" /></td>
                                        <td className="p-4"><input name="price" type="number" value={editedData.price} onChange={handleInputChange} className="w-full p-2 bg-surface-container-lowest border border-outline rounded-lg" /></td>
                                        <td className="p-4"><input name="description" value={editedData.description} onChange={handleInputChange} className="w-full p-2 bg-surface-container-lowest border border-outline rounded-lg" /></td>
                                        <td className="p-4">
                                            <ModernDropdown
                                                name="state"
                                                options={suitConditions}
                                                selected={editedData.state}
                                                onSelect={handleInputChange}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <ModernDropdown
                                                name="color"
                                                options={suitColors}
                                                selected={editedData.color}
                                                onSelect={handleInputChange}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <ModernDropdown
                                                name="material"
                                                options={suitMaterials}
                                                selected={editedData.material}
                                                onSelect={handleInputChange}
                                            />
                                        </td>
                                        <td className="p-4">
                                             <ModernDropdown
                                                name="eventType"
                                                options={eventTypes}
                                                selected={editedData.eventType}
                                                onSelect={handleInputChange}
                                            />
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={() => handleSave(suit.id)} className="px-4 py-2 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors">Guardar</button>
                                            <button onClick={handleCancel} className="px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container font-semibold hover:bg-secondary-container-high transition-colors">Cancelar</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-4"><img src={suit.imageUrl} alt={suit.name} className="h-16 w-16 object-cover rounded-lg" /></td>
                                        <td className="p-4">{suit.name}</td>
                                        <td className="p-4">{suit.size}</td>
                                        <td className="p-4">€{suit.price}</td>
                                        <td className="p-4">{suit.description}</td>
                                        <td className="p-4">{suit.state}</td>
                                        <td className="p-4">{suit.color}</td>
                                        <td className="p-4">{suit.material}</td>
                                        <td className="p-4">{suit.eventType}</td>
                                        <td className="p-4 text-right space-x-2">
                                            <ActionIcon icon="edit" onClick={() => handleEdit(suit)} colorClass="text-tertiary" hoverColorClass="text-tertiary-dark" />
                                            <ActionIcon icon="delete" onClick={() => handleDelete(suit.id)} colorClass="text-error" hoverColorClass="text-error-dark" />
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageSuits;
