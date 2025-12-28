import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import useAuth from '../hooks/useAuth';
import { motion } from 'framer-motion';

// --- Helper Components (Modernized) ---
const InputField = React.forwardRef(({ label, ...props }, ref) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-on-surface-variant mb-1">{label}</label>
        <input id={props.name} {...props} ref={ref} className="w-full bg-surface-container-high border-2 border-outline/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors hover:border-outline" />
    </div>
));

const SelectField = ({ label, options, ...props }) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-on-surface-variant mb-1">{label}</label>
        <div className="relative">
            <select 
                id={props.name} 
                {...props} 
                className="w-full appearance-none bg-surface-container-high border-2 border-outline/30 rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors hover:border-outline"
            >
                <option value="" disabled hidden>Selecciona una opción</option>
                {options.map(opt => <option key={opt} value={opt} selected={props.value === opt}>{opt}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant">
                <span className="material-icons-outlined">expand_more</span>
            </div>
        </div>
    </div>
);

const TextAreaField = ({ label, ...props }) => (
     <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-on-surface-variant mb-1">{label}</label>
        <textarea id={props.name} {...props} className="w-full bg-surface-container-high border-2 border-outline/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" rows="4" />
    </div>
);

// --- Main EditSuitPage Component ---
const EditSuitPage = () => {
    const { suitId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [suit, setSuit] = useState(null);
    const [originalImageUrl, setOriginalImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageSource, setImageSource] = useState('file'); // 'file' or 'url'
    const [imageUrlInput, setImageUrlInput] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const db = getDatabase();
        const suitRef = ref(db, `trajes/${suitId}`);
        
        get(suitRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                if (data.ownerId !== user.uid) {
                    setError('No tienes permiso para editar este traje.');
                    return;
                }
                setSuit(data);
                setImagePreview(data.imageUrl);
                setOriginalImageUrl(data.imageUrl);
            } else {
                setError('El traje que intentas editar no existe.');
            }
        }).catch(err => {
            console.error("Error fetching suit data:", err);
            setError("No se pudo cargar la información del traje.");
        }).finally(() => {
            setIsFetching(false);
        });
    }, [suitId, user.uid]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuit(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!suit) return;

        setIsLoading(true);
        setError('');

        try {
            let finalImageUrl = suit.imageUrl;

            if (imageSource === 'file' && imageFile) {
                const storage = getStorage();
                const imageName = `${Date.now()}-${imageFile.name}`;
                const newImageRef = storageRef(storage, `suit-images/${imageName}`);
                const uploadResult = await uploadBytes(newImageRef, imageFile);
                finalImageUrl = await getDownloadURL(uploadResult.ref);

                if (originalImageUrl && originalImageUrl.includes('firebasestorage.googleapis.com')) {
                    const oldImageRef = storageRef(storage, originalImageUrl);
                    await deleteObject(oldImageRef).catch(err => console.warn("Could not delete old image:", err));
                }
            } else if (imageSource === 'url' && imageUrlInput) {
                finalImageUrl = imageUrlInput;
            }

            const db = getDatabase();
            const suitRef = ref(db, `trajes/${suitId}`);
            const updatedSuitData = { ...suit, price: parseFloat(suit.price) || 0, imageUrl: finalImageUrl };

            await update(suitRef, updatedSuitData);
            navigate('/profile');

        } catch (err) {
            console.error("Error updating suit: ", err);
            setError('Hubo un error al guardar los cambios. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="w-full flex-grow flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div></div>;
    }

    if (error) {
        return (
            <div className="w-full flex-grow flex flex-col items-center justify-center text-center p-8">
                <span className="material-icons text-error text-6xl mb-4">error_outline</span>
                <h2 className="text-xl font-bold text-error-dark mb-2">Error al Cargar</h2>
                <p className="text-on-surface-variant max-w-sm">{error}</p>
                <button onClick={() => navigate('/profile')} className="mt-6 px-6 py-2 bg-primary text-on-primary rounded-full font-bold">Volver al Armario</button>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto p-4 md:p-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* --- Image Section --- */}
                <div className="md:col-span-1 space-y-4">
                    <h2 className="text-2xl font-bold text-on-surface mb-2">Imagen del Traje</h2>
                    <div className="aspect-w-1 aspect-h-1 bg-surface-container-high rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-outline/50">
                        {imagePreview ? <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover" /> : <div className="text-center p-4 text-on-surface-variant"><span className="material-icons-outlined text-5xl">hide_image</span><p>Sin imagen</p></div>}
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

                {/* --- Details Section --- */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-2xl font-bold text-on-surface mb-2">Editar Detalles del Traje</h2>
                    {error && <div className="p-3 mb-3 text-center bg-error/20 text-error-dark font-bold rounded-lg">{error}</div>}
                    <InputField label="Nombre del Traje" name="name" value={suit.name} onChange={handleChange} required />
                    <TextAreaField label="Descripción" name="description" value={suit.description} onChange={handleChange} required />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField label="Marca" name="brand" value={suit.brand} onChange={handleChange} />
                        <InputField label="Precio por día (€)" name="price" type="number" value={suit.price} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <SelectField label="Talla" name="size" value={suit.size} onChange={handleChange} options={['XS', 'S', 'M', 'L', 'XL', 'XXL']} />
                        <InputField label="Color" name="color" value={suit.color} onChange={handleChange} />
                        <SelectField label="Estado" name="state" value={suit.state} onChange={handleChange} options={['Nuevo', 'Casi nuevo', 'Usado', 'Con desperfectos']} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField label="Tejido" name="fabric" value={suit.fabric} onChange={handleChange} />
                        <InputField label="Estilo" name="style" value={suit.style} onChange={handleChange} />
                    </div>
                    <SelectField label="Tipo de Evento" name="eventType" value={suit.eventType} onChange={handleChange} options={['Boda', 'Gala', 'Fiesta', 'Negocios', 'Casual', 'Otro']} />
                    
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button type="button" onClick={() => navigate('/profile')} className="px-6 py-2 bg-surface-container-high text-on-surface-variant rounded-full font-semibold hover:bg-surface-container-highest transition-colors">Cancelar</button>
                        <button type="submit" disabled={isLoading} className="px-8 py-2 bg-primary text-on-primary rounded-full font-bold shadow-lg hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 flex items-center gap-2">
                            {isLoading && <motion.div animate={{rotate: 360}} transition={{repeat: Infinity, duration: 1, ease: 'linear'}}><span className="material-icons-outlined">sync</span></motion.div>}
                            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default EditSuitPage;
