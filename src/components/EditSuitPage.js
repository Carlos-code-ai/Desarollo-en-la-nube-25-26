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
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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

const FormSkeleton = () => (
     <div className="max-w-6xl mx-auto p-4 md:p-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
                 <div className="h-8 bg-surface-container-high rounded w-3/4"></div>
                 <div className="aspect-w-1 aspect-h-1 bg-surface-container-high rounded-lg"></div>
                 <div className="h-12 bg-surface-container-high rounded-full"></div>
                 <div className="h-10 bg-surface-container-high rounded-lg"></div>
            </div>
            <div className="md:col-span-2 space-y-4">
                 <div className="h-8 bg-surface-container-high rounded w-1/2"></div>
                <div className="h-10 bg-surface-container-high rounded-lg"></div>
                <div className="h-24 bg-surface-container-high rounded-lg"></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 bg-surface-container-high rounded-lg"></div>
                    <div className="h-10 bg-surface-container-high rounded-lg"></div>
                </div>
                 <div className="flex justify-end gap-4 pt-4">
                    <div className="h-12 w-24 bg-surface-container-high rounded-full"></div>
                    <div className="h-12 w-32 bg-primary/50 rounded-full"></div>
                </div>
            </div>
        </div>
    </div>
);

// --- Main EditSuitPage Component ---
const EditSuitPage = () => {
    const { suitId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [suit, setSuit] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;
        const db = getDatabase();
        const suitRef = ref(db, `trajes/${suitId}`);
        
        get(suitRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setSuit({ id: suitId, ...data }); 
                const currentImageUrl = data.imageUrls?.[0] || '';
                setImagePreview(currentImageUrl); 
                setImageUrlInput(currentImageUrl); // Pre-fill the URL input
                if (data.ownerId !== user.uid) {
                    setError('No tienes permiso para editar este traje.');
                    setIsFetching(false);
                    return;
                }
            } else {
                setError('El traje que intentas editar no existe.');
            }
        }).catch(err => {
            console.error("Error fetching suit data:", err);
            setError("No se pudo cargar la información del traje.");
        }).finally(() => {
            setIsFetching(false);
        });
    }, [suitId, user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setImageUrlInput(''); // Clear URL if a file is chosen
        }
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setImageUrlInput(url);
        setImagePreview(url);
        setImageFile(null); // Clear file if a URL is being typed
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuit(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!suit || (!imageFile && !imageUrlInput)) {
             setError('Por favor, proporciona una imagen (archivo o URL).');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            let finalImageUrl = imageUrlInput;

            // If a new image file is selected, upload it and delete the old one
            if (imageFile) {
                const storage = getStorage();
                const imageName = `${Date.now()}-${imageFile.name}`;
                const newImageRef = storageRef(storage, `suit-images/${imageName}`);
                const uploadResult = await uploadBytes(newImageRef, imageFile);
                finalImageUrl = await getDownloadURL(uploadResult.ref);

                // Delete the old image from Firebase Storage if it exists
                const originalImageUrl = suit.imageUrls?.[0];
                if (originalImageUrl && originalImageUrl.includes('firebasestorage.googleapis.com')) {
                    try {
                        const oldImageRef = storageRef(storage, originalImageUrl);
                        await deleteObject(oldImageRef);
                    } catch (deleteError) {
                         console.warn("Could not delete old image:", deleteError);
                    }
                }
            }

            const db = getDatabase();
            const suitRef = ref(db, `trajes/${suitId}`);
            const updatedSuitData = { 
                ...suit, 
                price: parseFloat(suit.price) || 0, 
                imageUrls: [finalImageUrl], // Keep it as an array
                updatedAt: new Date().toISOString()
            };

            await update(suitRef, updatedSuitData);
            navigate('/my-items');

        } catch (err) {
            console.error("Error updating suit: ", err);
            setError('Hubo un error al guardar los cambios. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <FormSkeleton />;
    }

    if (error && !suit) { // Only show full-page error if suit data couldn't be loaded
        return (
            <div className="w-full flex-grow flex flex-col items-center justify-center text-center p-8">
                <span className="material-icons text-error text-6xl mb-4">error_outline</span>
                <h2 className="text-xl font-bold text-error-dark mb-2">Error al Cargar</h2>
                <p className="text-on-surface-variant max-w-sm">{error}</p>
                <button onClick={() => navigate('/my-items')} className="mt-6 px-6 py-2 bg-primary text-on-primary rounded-full font-bold">Volver al Armario</button>
            </div>
        );
    }
    
    if (!suit) {
        return null; // Should be covered by the error case above, but as a fallback.
    }


    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-surface-container-lowest p-4 md:p-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-6xl">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-4">
                        <h2 className="text-2xl font-bold text-on-surface mb-2">Imagen del Traje</h2>
                        <div className="aspect-[4/5] bg-surface-container-high rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-outline/50">
                            {imagePreview ? <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover" /> : <div className="text-center p-4 text-on-surface-variant"><span className="material-icons-outlined text-5xl">hide_image</span><p>Sin imagen</p></div>}
                        </div>
                        <div className="relative">
                            <input type="file" id="file-upload" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <label htmlFor="file-upload" className="cursor-pointer w-full inline-block text-center py-3 px-4 bg-secondary text-on-secondary font-semibold rounded-full hover:bg-opacity-90 transition-colors">
                                {imageFile ? 'Cambiar Archivo' : 'Seleccionar Archivo'}
                            </label>
                        </div>
                        <div className="text-center my-2 text-on-surface-variant font-semibold">o</div>
                        <InputField label="Pegar URL de la imagen" name="imageUrl" type="url" value={imageUrlInput} onChange={handleUrlChange} placeholder="https://ejemplo.com/imagen.jpg" />
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-2xl font-bold text-on-surface mb-2">Editar Detalles del Traje</h2>
                        {error && <div className="p-3 mb-3 text-center bg-error/20 text-error-dark font-bold rounded-lg">{error}</div>}
                        
                        <InputField label="Nombre del Traje" name="name" value={suit.name || ''} onChange={handleChange} required />
                        <TextAreaField label="Descripción" name="description" value={suit.description || ''} onChange={handleChange} required />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField label="Marca" name="brand" value={suit.brand || ''} onChange={handleChange} />
                            <InputField label="Precio por día (€)" name="price" type="number" value={suit.price || ''} onChange={handleChange} required />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <SelectField label="Talla" name="size" value={suit.size || ''} onChange={handleChange} options={['XS', 'S', 'M', 'L', 'XL', 'XXL']} />
                            <InputField label="Color" name="color" value={suit.color || ''} onChange={handleChange} />
                            <SelectField label="Estado" name="state" value={suit.state || ''} onChange={handleChange} options={['Nuevo', 'Casi nuevo', 'Usado', 'Con desperfectos']} />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField label="Tejido" name="fabric" value={suit.fabric || ''} onChange={handleChange} />
                            <InputField label="Estilo" name="style" value={suit.style || ''} onChange={handleChange} />
                        </div>
                        
                        <SelectField label="Tipo de Evento" name="eventType" value={suit.eventType || ''} onChange={handleChange} options={['Boda', 'Gala', 'Fiesta', 'Negocios', 'Casual', 'Otro']} />
                        
                        <div className="flex items-center justify-end gap-4 pt-4">
                            <button type="button" onClick={() => navigate('/my-items')} className="px-6 py-2 bg-surface-container-high text-on-surface-variant rounded-full font-semibold hover:bg-surface-container-highest transition-colors">Cancelar</button>
                            <button type="submit" disabled={isLoading} className="px-8 py-2 bg-primary text-on-primary rounded-full font-bold shadow-lg hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 flex items-center gap-2">
                                {isLoading && <motion.div animate={{rotate: 360}} transition={{repeat: Infinity, duration: 1, ease: 'linear'}}><span className="material-icons-outlined">sync</span></motion.div>}
                                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditSuitPage;