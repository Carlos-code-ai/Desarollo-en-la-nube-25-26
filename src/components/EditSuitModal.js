import React, { useState, useEffect } from 'react';
import ModernDropdown from './ModernDropdown';

const EditSuitModal = ({ suit, onClose, onSave }) => {
    const [editedData, setEditedData] = useState({});

    useEffect(() => {
        // Inicializa el estado con los datos del traje, asegurando que todos los campos sean arrays
        setEditedData({
            ...suit,
            colores: suit.colores || [],
            materiales: suit.materiales || [],
            imagenes: suit.imagenes || [],
        });
    }, [suit]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        setEditedData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleDropdownChange = (name, value) => {
        setEditedData(prev => ({ ...prev, [name]: value }));
    };

    // Funciones para manejar arrays (colores, materiales, imagenes)
    const handleArrayChange = (name, index, value) => {
        const newArray = [...editedData[name]];
        newArray[index] = value;
        setEditedData(prev => ({ ...prev, [name]: newArray }));
    };

    const addArrayItem = (name) => {
        setEditedData(prev => ({ ...prev, [name]: [...prev[name], ''] }));
    };

    const removeArrayItem = (name, index) => {
        const newArray = [...editedData[name]];
        newArray.splice(index, 1);
        setEditedData(prev => ({ ...prev, [name]: newArray }));
    };

    const handleSave = () => {
        onSave(suit.id, editedData);
    };
    
    const suitSizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const suitTypes = ["Esmóquin", "Frac", "Terno", "Slim Fit", "Clásico"];
    const suitStatuses = ["Disponible", "Alquilado", "En Mantenimiento"];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-surface-container p-8 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-on-surface mb-6">Editar Traje</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Columna Izquierda */}
                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-2">Nombre</label>
                        <input type="text" name="nombre" value={editedData.nombre || ''} onChange={handleInputChange} className="w-full p-3 bg-surface-container-lowest border border-outline rounded-lg" />
                        
                        <label className="block text-sm font-medium text-on-surface-variant mt-4 mb-2">Descripción</label>
                        <textarea name="descripcion" value={editedData.descripcion || ''} onChange={handleInputChange} className="w-full p-3 bg-surface-container-lowest border border-outline rounded-lg h-32" />
                        
                        <label className="block text-sm font-medium text-on-surface-variant mt-4 mb-2">Precio por Día</label>
                        <input type="number" name="precioPorDia" value={editedData.precioPorDia || ''} onChange={handleInputChange} className="w-full p-3 bg-surface-container-lowest border border-outline rounded-lg" />
                        
                        <div className="flex items-center mt-6">
                            <input type="checkbox" id="disponible" name="disponible" checked={!!editedData.disponible} onChange={handleInputChange} className="h-5 w-5 text-primary bg-surface-container-lowest border-outline rounded focus:ring-primary" />
                            <label htmlFor="disponible" className="ml-3 text-on-surface">Disponible</label>
                        </div>
                    </div>

                    {/* Columna Derecha */}
                    <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-2">Talla</label>
                        <ModernDropdown name="talla" options={suitSizes} selected={editedData.talla} onSelect={handleDropdownChange} />

                        <label className="block text-sm font-medium text-on-surface-variant mt-4 mb-2">Tipo</label>
                        <ModernDropdown name="tipo" options={suitTypes} selected={editedData.tipo} onSelect={handleDropdownChange} />

                        <label className="block text-sm font-medium text-on-surface-variant mt-4 mb-2">Estado</label>
                        <ModernDropdown name="estado" options={suitStatuses} selected={editedData.estado} onSelect={handleDropdownChange} />
                    </div>
                </div>

                {/* Gestión de Arrays */}
                <div className="mt-6 pt-6 border-t border-outline-variant">
                    {['colores', 'materiales', 'imagenes'].map(field => (
                        <div key={field} className="mb-4">
                            <h4 className="text-lg font-medium text-on-surface-variant capitalize mb-2">{field}</h4>
                            {editedData[field] && editedData[field].map((item, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type={field === 'imagenes' ? 'url' : 'text'}
                                        value={item}
                                        onChange={(e) => handleArrayChange(field, index, e.target.value)}
                                        className="w-full p-3 bg-surface-container-lowest border border-outline rounded-lg"
                                        placeholder={`${field.slice(0, -1)} ${index + 1}`}
                                    />
                                    <button onClick={() => removeArrayItem(field, index)} className="ml-2 p-2 bg-error-container text-on-error-container rounded-full">
                                        <span className="material-icons text-lg">remove</span>
                                    </button>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem(field)} className="mt-2 p-2 bg-secondary-container text-on-secondary-container rounded-lg flex items-center">
                                <span className="material-icons text-lg mr-1">add</span> Añadir {field.slice(0, -1)}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Acciones */}
                <div className="flex justify-end mt-8">
                    <button onClick={onClose} className="mr-4 px-6 py-3 bg-surface-container-high text-on-surface-variant rounded-full font-medium">Cancelar</button>
                    <button onClick={handleSave} className="px-6 py-3 bg-primary text-on-primary rounded-full font-medium">Guardar Cambios</button>
                </div>
            </div>
        </div>
    );
};

export default EditSuitModal;
