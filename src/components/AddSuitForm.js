
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

// --- Icons ---
const HangerIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.38 5.54c.7-1.4 2.1-2.43 3.62-2.43s2.92 1.03 3.62 2.43l3.2 6.46c.4.8.2 1.8-.5 2.4s-1.8.5-2.4-.5L12 8.5l-3.32 5.4c-.6.8-1.7.9-2.4.4s-1-1.6-.5-2.4l3.2-6.46z"/><path d="M8 18v2"/><path d="M16 18v2"/><path d="M12 12v10"/></svg>;
const UploadIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const LinkIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>;

// --- Placeholder Image ---
const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNnB4IiBmaWxsPSIjY2NjIj5TaW4gSW1hZ2VuPC90ZXh0Pjwvc3ZnPg==";

// --- Form Field Components ---
const InputField = ({ label, name, value, onChange, placeholder, type = 'text', required = true }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-on-surface-variant mb-1">{label}</label>
        <input 
            type={type} 
            name={name} 
            id={name} 
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full bg-surface-container-high border-2 border-outline/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
        />
    </div>
);

const CustomSelect = ({ label, name, value, onChange, options, required = true }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-on-surface-variant mb-1">{label}</label>
        <select 
            name={name} 
            id={name} 
            value={value}
            onChange={onChange}
            required={required}
            className="w-full bg-surface-container-high border-2 border-outline/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none"
        >
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

// --- Image Uploader Component ---
const ImageUploader = ({ images, setImages }) => {
    const [urlInput, setUrlInput] = useState('');

    const onDrop = (acceptedFiles) => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => setImages(prev => [...prev, reader.result]);
            reader.readAsDataURL(file);
        });
    };

    const addUrl = () => {
        if (urlInput && !images.includes(urlInput)) {
            setImages(prev => [...prev, urlInput]);
        }
        setUrlInput('');
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: { 'image/*': ['.jpeg', '.png', '.webp'] }
    });

    return (
        <div className="space-y-4">
            <div {...getRootProps()} className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${isDragActive ? 'border-primary bg-primary/10' : 'border-outline-variant'}`}>
                <input {...getInputProps()} />
                <UploadIcon className={`h-12 w-12 transition-transform ${isDragActive ? 'scale-110' : ''}`} />
                <p className="mt-2 text-center text-on-surface-variant">
                    {isDragActive ? "Suelta las imágenes aquí" : "Arrastra imágenes o haz clic para seleccionar"}
                </p>
            </div>

            <div className="flex gap-2">
                <div className="relative flex-grow">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
                    <input 
                        type="text" 
                        value={urlInput} 
                        onChange={e => setUrlInput(e.target.value)} 
                        placeholder="O pega una URL de imagen aquí"
                        className="w-full bg-surface-container-high border-2 border-outline/30 rounded-lg pl-10 pr-3 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
                <button type="button" onClick={addUrl} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/90 transition-colors">Añadir URL</button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
                {images.map((img, i) => (
                    <motion.div key={i} className="relative group aspect-square" layout initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                        <img 
                            src={img} 
                            alt={`preview ${i}`} 
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }}
                        />
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 h-6 w-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};


// --- Main Form Component ---
const AddSuitForm = ({ onSubmit, onCancel, isLoading, suitToEdit }) => {
    const [suit, setSuit] = useState({
        name: '',
        description: '',
        size: 'M',
        color: 'Negro',
        price: '',
        imageUrls: [],
    });

    useEffect(() => {
        if (suitToEdit) {
            setSuit({
                name: suitToEdit.name || '',
                description: suitToEdit.description || '',
                size: suitToEdit.size || 'M',
                color: suitToEdit.color || 'Negro',
                price: suitToEdit.price || '',
                imageUrls: suitToEdit.imageUrls || [],
            });
        }
    }, [suitToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuit(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (suit.imageUrls.length === 0) {
            alert('Por favor, añade al menos una imagen.');
            return;
        }
        onSubmit(suit);
    };

    const formTitle = suitToEdit ? "Editar Traje" : "Añadir Nuevo Traje";
    
    const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => ({ value: s, label: s }));
    const COLORS = ['Negro', 'Azul', 'Gris', 'Blanco', 'Rojo', 'Verde', 'Otro'].map(c => ({ value: c, label: c }));

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-surface p-8 rounded-2xl shadow-xl">
            <div className="flex items-center gap-4 mb-8">
                <HangerIcon className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-on-surface">{formTitle}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* --- Left Column: Images -- */}
                <div className="space-y-2">
                    <h2 class="text-lg font-semibold text-on-surface">Imágenes</h2>
                    <ImageUploader images={suit.imageUrls} setImages={(imgs) => setSuit(p => ({...p, imageUrls: imgs}))} />
                </div>

                {/* --- Right Column: Details -- */}
                <div className="space-y-4">
                    <InputField label="Nombre del Traje" name="name" value={suit.name} onChange={handleChange} placeholder="Ej: Esmoquin de Gala Negro" />
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-on-surface-variant mb-1">Descripción</label>
                        <textarea name="description" id="description" value={suit.description} onChange={handleChange} placeholder="Describe el estilo, la tela, la ocasión ideal..." rows="4" className="w-full bg-surface-container-high border-2 border-outline/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <CustomSelect label="Talla" name="size" value={suit.size} onChange={handleChange} options={SIZES} />
                        <CustomSelect label="Color Principal" name="color" value={suit.color} onChange={handleChange} options={COLORS} />
                    </div>
                    <InputField label="Precio por día (€)" name="price" value={suit.price} onChange={handleChange} placeholder="25" type="number" />
                </div>
            </div>

            {/* --- Action Buttons -- */}
            <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-outline/20">
                <motion.button type="button" onClick={onCancel} className="px-6 py-2 rounded-full font-semibold text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                    Cancelar
                </motion.button>
                <motion.button type="submit" disabled={isLoading} className="px-8 py-2 rounded-full font-semibold text-on-primary bg-primary hover:bg-primary/90 disabled:bg-primary/50 flex items-center gap-2" whileHover={{ y: -2, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} whileTap={{ scale: 0.98 }}>
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Guardando...</span>
                        </>
                    ) : (suitToEdit ? 'Guardar Cambios' : 'Añadir Traje')}
                </motion.button>
            </div>
        </form>
    );
};

export default AddSuitForm;
