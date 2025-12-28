
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, push, serverTimestamp } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import useAuth from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper Components ---
const InputField = React.forwardRef(({ label, ...props }, ref) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-on-surface-variant mb-1">{label}</label>
        <input id={props.name} {...props} ref={ref} className="w-full bg-surface-container-high border-2 border-outline/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors hover:border-outline" />
    </div>
));

const ModernSelectField = ({ label, options, value, onChange, name, required }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const handleOptionClick = (optionValue) => {
        onChange({ target: { name, value: optionValue } });
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = value || <span className="text-on-surface-variant">Selecciona una opción</span>;

    return (
        <div className="relative" ref={selectRef}>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">{label}</label>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center bg-surface-container-high border-2 border-outline/30 rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors hover:border-outline">
                {selectedLabel}
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="material-icons-outlined">expand_more</motion.span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-10 w-full mt-1 bg-surface-container-high shadow-lg rounded-lg border-2 border-outline/30 overflow-hidden">
                        {options.map(opt => (
                            <div key={opt} onClick={() => handleOptionClick(opt)} className="px-4 py-2 hover:bg-primary/20 cursor-pointer transition-colors">
                                {opt}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TextAreaField = ({ label, ...props }) => (
     <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-on-surface-variant mb-1">{label}</label>
        <textarea id={props.name} {...props} className="w-full bg-surface-container-high border-2 border-outline/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" rows="4" />
    </div>
);

// --- Main AddSuitPage Component ---
const AddSuitPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', description: '', brand: '', price: '', size: '', color: '', state: '', fabric: '', style: '', eventType: '' });
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageSource, setImageSource] = useState('file');
    const [imageUrlInput, setImageUrlInput] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setError('');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((imageSource === 'file' && !imageFile) && (imageSource === 'url' && !imageUrlInput.trim())) {
            setError('Por favor, añade una imagen para el traje.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            let imageUrl = '';

            if (imageSource === 'file' && imageFile) {
                const storage = getStorage();
                const imageName = `${Date.now()}-${imageFile.name}`;
                const newImageRef = storageRef(storage, `suit-images/${imageName}`);
                const uploadResult = await uploadBytes(newImageRef, imageFile);
                imageUrl = await getDownloadURL(uploadResult.ref);
            } else if (imageSource === 'url' && imageUrlInput) {
                imageUrl = imageUrlInput;
            }

            const db = getDatabase();
            const suitsRef = ref(db, 'trajes');
            await push(suitsRef, {
                ...formData,
                price: parseFloat(formData.price) || 0,
                imageUrl,
                ownerId: user.uid, // Standardized to ownerId
                createdAt: serverTimestamp()
            });
            
            navigate('/profile');

        } catch (err) {
            console.error("Error adding suit: ", err);
            setError('Hubo un error al añadir el traje. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto p-4 md:p-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-4">
                    <h2 className="text-2xl font-bold text-on-surface mb-2">Imagen del Traje</h2>
                    <div className="aspect-w-1 aspect-h-1 bg-surface-container-high rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-outline/50">
                        {imagePreview ? <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover" /> : <div className="text-center p-4 text-on-surface-variant"><span className="material-icons-outlined text-5xl">add_a_photo</span><p className="mt-2">Añade una imagen</p></div>}
                    </div>
                    <div className="flex w-full bg-surface-container-high rounded-full p-1">
                         <button type="button" onClick={() => setImageSource('file')} className={`w-1/2 py-2 text-sm font-bold rounded-full transition-colors ${imageSource === 'file' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant'}`}>
                            Subir Archivo
                        </button>
                        <button type="button" onClick={() => setImageSource('url')} className={`w-1/2 py-2 text-sm font-bold rounded-full transition-colors ${imageSource === 'url' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant'}`}>
                            Usar URL
                        </button>
                    </div>
                     {imageSource === 'file' ? (
                        <div className="relative">
                            <input type="file" id="file-upload" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <label htmlFor="file-upload" className="cursor-pointer w-full inline-block text-center py-3 px-4 bg-secondary text-on-secondary font-semibold rounded-full hover:bg-opacity-90 transition-colors">
                                {imageFile ? 'Cambiar Archivo' : 'Seleccionar Archivo'}
                            </label>
                        </div>
                    ) : (
                        <InputField label="URL de la Imagen" type="url" placeholder="https://ejemplo.com/imagen.jpg" value={imageUrlInput} onChange={e => { setImageUrlInput(e.target.value); if(e.target.value) setImagePreview(e.target.value); }} />
                    )}
                </div>

                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-2xl font-bold text-on-surface mb-2">Añadir Detalles del Traje</h2>
                    {error && <div className="p-3 mb-3 text-center bg-error/20 text-error-dark font-bold rounded-lg">{error}</div>}
                    <InputField label="Nombre del Traje" name="name" value={formData.name} onChange={handleChange} required />
                    <TextAreaField label="Descripción" name="description" value={formData.description} onChange={handleChange} required />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField label="Marca" name="brand" value={formData.brand} onChange={handleChange} />
                        <InputField label="Precio por día (€)" name="price" type="number" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <ModernSelectField label="Talla" name="size" value={formData.size} onChange={handleChange} options={['XS', 'S', 'M', 'L', 'XL', 'XXL']} required />
                        <InputField label="Color" name="color" value={formData.color} onChange={handleChange} />
                        <ModernSelectField label="Estado" name="state" value={formData.state} onChange={handleChange} options={['Nuevo', 'Casi nuevo', 'Usado', 'Con desperfectos']} required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField label="Tejido" name="fabric" value={formData.fabric} onChange={handleChange} />
                        <InputField label="Estilo" name="style" value={formData.style} onChange={handleChange} />
                    </div>
                    <ModernSelectField label="Tipo de Evento" name="eventType" value={formData.eventType} onChange={handleChange} options={['Boda', 'Gala', 'Fiesta', 'Negocios', 'Casual', 'Otro']} required />
                    
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button type="button" onClick={() => navigate('/profile')} className="px-6 py-2 bg-surface-container-high text-on-surface-variant rounded-full font-semibold hover:bg-surface-container-highest transition-colors">Cancelar</button>
                        <button type="submit" disabled={isLoading} className="px-8 py-2 bg-primary text-on-primary rounded-full font-bold shadow-lg hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 flex items-center gap-2">
                            {isLoading && <motion.div animate={{rotate: 360}} transition={{repeat: Infinity, duration: 1, ease: 'linear'}}><span className="material-icons-outlined">sync</span></motion.div>}
                            {isLoading ? 'Añadiendo...' : 'Añadir Traje'}
                        </button>
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default AddSuitPage;
