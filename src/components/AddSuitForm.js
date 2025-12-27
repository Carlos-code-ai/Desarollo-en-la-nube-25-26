import React, { useState, useEffect } from 'react';

const FormInput = ({ id, label, type = 'text', value, onChange, placeholder, required = true }) => (
    <div className="relative">
      <input type={type} id={id} value={value} onChange={onChange} placeholder={placeholder || ' '}
        required={required} className="block px-4 py-3 w-full text-md text-on-surface bg-surface-container rounded-xl border border-outline appearance-none focus:outline-none focus:ring-0 focus:border-primary peer" />
      <label htmlFor={id} className="absolute text-md text-on-surface-variant duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-surface-container px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-3">{label}</label>
    </div>
  );

  const FormInputWithIcon = ({ id, label, value, onChange, placeholder, required = true }) => (
    <div className="relative">
        <input type="text" id={id} value={value} onChange={onChange} placeholder={placeholder || ' '}
               required={required} className="block pl-4 pr-12 py-3 w-full text-md text-on-surface bg-surface-container rounded-xl border border-outline appearance-none focus:outline-none focus:ring-0 focus:border-primary peer" />
        <label htmlFor={id} className="absolute text-md text-on-surface-variant duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-surface-container px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-3">{label}</label>
        <div className="absolute top-0 right-0 h-full flex items-center pr-2">
            <button type="button" className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
                <span className="material-icons text-on-surface-variant">add_photo_alternate</span>
            </button>
        </div>
    </div>
);

const FormTextarea = ({ id, label, value, onChange, placeholder, required = true }) => (
    <div className="relative">
        <textarea id={id} value={value} onChange={onChange} placeholder={placeholder || ' '}
            required={required} rows={4} className="block px-4 py-3 w-full text-md text-on-surface bg-surface-container rounded-xl border border-outline appearance-none focus:outline-none focus:ring-0 focus:border-primary peer" />
        <label htmlFor={id} className="absolute text-md text-on-surface-variant duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-surface-container px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:top-6 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-3">{label}</label>
    </div>
);

const FormSelect = ({ id, label, value, onChange, children, required = true }) => (
    <div className="relative">
        <select id={id} value={value} onChange={onChange} required={required} className="block px-4 py-3 w-full text-md text-on-surface bg-surface-container rounded-xl border border-outline appearance-none focus:outline-none focus:ring-0 focus:border-primary peer">
            {children}
        </select>
        <label htmlFor={id} className="absolute text-md text-on-surface-variant duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-surface-container px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-3">{label}</label>
    </div>
);

const AddSuitForm = ({ onAdd, onUpdate, onCancel, suitToEdit }) => {
  const isEditMode = !!suitToEdit;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [materials, setMaterials] = useState('');
  const [colors, setColors] = useState('');
  const [eventType, setEventType] = useState('');
  const [condition, setCondition] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (isEditMode) {
      setName(suitToEdit.name || '');
      setDescription(suitToEdit.description || '');
      setSize(suitToEdit.size || '');
      setPrice(suitToEdit.price || '');
      setMaterials(suitToEdit.materials || '');
      setColors(suitToEdit.colors || '');
      setEventType(suitToEdit.eventType || '');
      setCondition(suitToEdit.condition || '');
      setImageUrl(suitToEdit.imageUrl || '');
    }
  }, [suitToEdit, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const suitData = { 
        name, description, size, price: Number(price), 
        materials, colors, eventType, condition, imageUrl 
    };
    
    if (isEditMode) {
      onUpdate(suitToEdit.id, suitData);
    } else {
      onAdd(suitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-surface-container-low rounded-4xl w-full max-w-3xl mx-auto shadow-lg">
      <div className="flex items-center gap-3 mb-8">
        <span className="material-icons text-on-surface text-3xl">styler</span>
        <h2 className="text-2xl font-bold text-on-surface">
          {isEditMode ? 'Editar Traje' : 'Añadir Nuevo Traje'}
        </h2>
      </div>
      
      <div className="space-y-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput id="name" label="Nombre del Traje" value={name} onChange={(e) => setName(e.target.value)} />
          <FormInput id="price" label="Precio por día (€)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <FormInputWithIcon id="imageUrl" label="URL de la Imagen" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput id="size" label="Talla" value={size} onChange={(e) => setSize(e.target.value)} />
            <FormSelect id="eventType" label="Tipo de Evento" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                <option value="">Selecciona un tipo</option>
                <option value="boda">Boda</option><option value="gala">Gala</option><option value="negocios">Negocios</option><option value="casual">Casual</option><option value="otro">Otro</option>
            </FormSelect>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect id="condition" label="Estado" value={condition} onChange={(e) => setCondition(e.target.value)}>
                  <option value="">Selecciona el estado</option>
                  <option value="nuevo">Nuevo</option><option value="como-nuevo">Como Nuevo</option><option value="bueno">Bueno</option><option value="usado">Usado</option>
          </FormSelect>
          <FormInput id="colors" label="Colores" value={colors} onChange={(e) => setColors(e.target.value)} />
        </div>
        
        <FormTextarea id="description" label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
        <FormInput id="materials" label="Materiales" value={materials} onChange={(e) => setMaterials(e.target.value)} />

      </div>

      <div className="mt-10 flex justify-end gap-4">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 text-sm font-semibold text-primary rounded-full hover:bg-primary/10 transition-colors">
          Cancelar
        </button>
        <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-on-primary bg-primary rounded-full shadow-sm hover:scale-105 transition-transform">
          {isEditMode ? 'Guardar Cambios' : 'Añadir Traje'}
        </button>
      </div>
    </form>
  );
};

export default AddSuitForm;
