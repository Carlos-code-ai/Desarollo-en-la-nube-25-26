
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { ref, push } from 'firebase/database';
import useAuth from '../hooks/useAuth';
import { gsap } from 'gsap';

// --- Icon Components ---

const HangerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-on-surface" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.5l-7.5 7.5-7.5-7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15.5V5.75C3 4.784 3.784 4 4.75 4h14.5c.966 0 1.75.784 1.75 1.75V15.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5V20" />
    </svg>
);


// --- New Modern UI Components ---

const ModernSelect = ({ id, label, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef(null);
    const placeholderRef = useRef(null);
    const optionsRef = useRef(null);

    const handleSelect = (optionValue) => {
        onChange({ target: { name: id, value: optionValue } });
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (rootRef.current && !rootRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const hasValue = value && value !== '';
        gsap.to(placeholderRef.current, {
            y: isOpen || hasValue ? -24 : 0,
            scale: isOpen || hasValue ? 0.85 : 1,
            color: isOpen ? '#A855F7' : '#9CA3AF', // primary color for open, otherwise gray
            duration: 0.2,
            ease: 'power2.out',
        });
        gsap.to(optionsRef.current, {
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 0 : -10,
            display: isOpen ? 'block' : 'none',
            duration: 0.2,
            ease: 'power2.out',
        });
    }, [isOpen, value]);

    return (
        <div ref={rootRef} className="relative w-full">
            <label ref={placeholderRef} htmlFor={id} className="absolute left-4 top-3.5 text-on-surface-variant origin-top-left transition-transform duration-200 pointer-events-none">
                {label}
            </label>
            <button
                type="button"
                id={id}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full h-14 px-4 text-left bg-surface-container rounded-lg border border-outline/50 focus:border-primary focus:ring-2 focus:ring-primary/50 transition"
            >
                <span className="text-on-surface">{value || ''}</span>
                <span className={`material-icons text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>
            <div ref={optionsRef} className="absolute z-10 w-full mt-1 bg-surface-container-high rounded-lg shadow-xl overflow-hidden">
                <ul>
                    {options.map(option => (
                        <li
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className="px-4 py-3 hover:bg-primary/10 text-on-surface cursor-pointer transition-colors"
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


const ImageManager = ({ imageUrls, onImagesChange }) => {
    const [urlInput, setUrlInput] = useState('');
    const fileInputRef = useRef(null);

    const handleAddUrl = () => {
        if (urlInput && !imageUrls.includes(urlInput)) {
            onImagesChange([...imageUrls, urlInput]);
            setUrlInput('');
        }
    };
    
    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = e.target.result;
                 if (!imageUrls.includes(base64String)) {
                    onImagesChange(prev => [...prev, base64String]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (index) => {
        onImagesChange(imageUrls.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
             {/* Image Grid */}
            <div className="grid grid-cols-3 gap-2 min-h-[120px] p-2 rounded-lg bg-surface-container border border-dashed border-outline/30">
                {imageUrls.map((url, index) => (
                    <div key={index} className="relative group aspect-square">
                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md"/>
                        <button 
                            type="button" 
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 h-6 w-6 grid place-items-center bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <span className="material-icons text-sm">close</span>
                        </button>
                    </div>
                ))}
            </div>

            {/* URL Input */}
            <div className="flex gap-2">
                <div className="relative flex-grow">
                     <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">link</span>
                     <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Pegar URL de la imagen"
                        className="w-full h-11 pl-10 pr-4 rounded-lg bg-surface-container border-outline/50 focus:border-primary focus:ring-primary transition"
                    />
                </div>
                <button type="button" onClick={handleAddUrl} className="h-11 px-4 bg-primary/20 text-primary font-semibold rounded-lg hover:bg-primary/30 transition">
                    Añadir
                </button>
            </div>
            
            {/* Upload Button */}
            <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors"
            >
                <span className="material-icons text-on-surface-variant">upload</span>
                <span className="font-semibold text-on-surface">Subir desde dispositivo</span>
            </button>
            <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
            />
        </div>
    );
};


// --- Main Add Suit Page Component ---

const AddSuitPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [suitData, setSuitData] = useState({
        name: '',
        size: '',
        price: '',
        imageUrls: [],
        eventType: '',
        condition: '',
        colors: '',
        description: '',
        materials: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSuitData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleImagesChange = (newImageUrls) => {
        setSuitData(prev => ({...prev, imageUrls: newImageUrls}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Debes iniciar sesión para añadir un traje.');
            return;
        }
        if (suitData.imageUrls.length === 0) {
            setError('Por favor, añade al menos una imagen para el traje.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const suitsRef = ref(db, 'trajes');
            await push(suitsRef, {
                ...suitData,
                price: parseFloat(suitData.price),
                imageUrl: suitData.imageUrls[0], // For backward compatibility with cards
                ownerId: user.uid,
                ownerName: user.displayName || 'Anónimo',
                ownerPhotoURL: user.photoURL || '',
                createdAt: new Date().toISOString(),
            });
            navigate('/my-items');
        } catch (err) {
            console.error("Error al añadir el traje:", err);
            setError('Hubo un problema al añadir el traje. Por favor, inténtalo de nuevo.');
            setLoading(false);
        }
    };
    
    // Modern Input Field
    const InputField = ({ id, label, ...props }) => (
        <div className="relative">
            <input
                id={id}
                {...props}
                placeholder=" " 
                className="block px-4 h-14 w-full text-on-surface bg-surface-container rounded-lg border border-outline/50 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary peer transition"
            />
            <label
                htmlFor={id}
                className="absolute text-sm text-on-surface-variant duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
                {label}
            </label>
        </div>
    );

    const eventOptions = [
        { value: "boda", label: "Boda" },
        { value: "gala", label: "Gala" },
        { value: "negocios", label: "Negocios" },
        { value: "fiesta", label: "Fiesta" },
        { value: "otro", label: "Otro" }
    ];

    const conditionOptions = [
        { value: "nuevo", label: "Nuevo" },
        { value: "como-nuevo", label: "Como nuevo" },
        { value: "bueno", label: "Bueno" },
        { value: "usado", label: "Usado" }
    ];
    
    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="bg-surface p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-4xl mx-auto">
                
                <div className="flex items-center gap-4 mb-8">
                    <HangerIcon />
                    <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Añadir Nuevo Traje</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        <div className="lg:col-span-1">
                           <h2 className="text-lg font-medium text-on-surface mb-2">Imágenes</h2>
                           <ImageManager imageUrls={suitData.imageUrls} onImagesChange={handleImagesChange} />
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="sm:col-span-2">
                                <InputField id="name" name="name" label="Nombre del Traje" type="text" required value={suitData.name} onChange={handleChange} />
                            </div>
                            
                            <InputField id="price" name="price" label="Precio por día (€)" type="number" required value={suitData.price} onChange={handleChange} step="0.01" />
                            <InputField id="size" name="size" label="Talla" type="text" required value={suitData.size} onChange={handleChange} placeholder="Ej: 48, M, 50R" />

                            <ModernSelect id="eventType" name="eventType" label="Tipo de Evento" options={eventOptions} value={suitData.eventType} onChange={handleChange} />
                            <ModernSelect id="condition" name="condition" label="Estado" options={conditionOptions} value={suitData.condition} onChange={handleChange} />

                            <div className="sm:col-span-2">
                                <InputField id="colors" name="colors" label="Colores" type="text" value={suitData.colors} onChange={handleChange} placeholder="Ej: Negro, Azul marino" />
                            </div>
                            
                             <div className="sm:col-span-2">
                                <InputField id="materials" name="materials" label="Materiales" type="text" value={suitData.materials} onChange={handleChange} placeholder="Ej: Lana, Seda, Algodón" />
                            </div>

                            <div className="sm:col-span-2">
                                <InputField as="textarea" id="description" name="description" label="Descripción" rows="4" value={suitData.description} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    
                    {error && <p className="text-error text-sm mt-6 text-center">{error}</p>}

                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-outline/20">
                         <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 rounded-full font-semibold text-on-surface hover:bg-on-surface/10 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="px-8 py-2 rounded-full bg-primary text-on-primary font-bold hover:bg-primary-dark transition-all disabled:bg-on-surface/20 disabled:text-on-surface/50 disabled:cursor-not-allowed">
                            {loading ? 'Añadiendo...' : 'Añadir Traje'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSuitPage;
