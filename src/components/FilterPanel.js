
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// Custom Dropdown Component for a modern look
const CustomSelect = ({ name, value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = useMemo(() => options.find(o => o.value === value)?.label, [options, value]);

    const handleSelect = (selectedValue) => {
        onChange({ target: { name, value: selectedValue } });
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <label className="block mb-2 text-sm font-medium text-on-surface-variant">{placeholder}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-3 bg-surface-container-high border border-outline rounded-lg flex justify-between items-center transition-all duration-200 hover:bg-surface-variant focus:ring-2 focus:ring-primary"
            >
                <span className={value ? 'text-on-surface' : 'text-on-surface-variant'}>
                    {selectedLabel || placeholder}
                </span>
                <span className={`material-icons transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    arrow_drop_down
                </span>
            </button>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 w-full mt-1 bg-surface-container-high border border-outline rounded-lg shadow-lg"
                >
                    {options.map(option => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className="p-3 hover:bg-primary/10 cursor-pointer text-on-surface"
                        >
                            {option.label}
                        </div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

// Main Filter Panel Component
const FilterPanel = ({ onApply, onClear, initialFilters, onClose }) => {
    const [filters, setFilters] = useState(initialFilters);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSliderChange = (value) => {
        setFilters(prev => ({ ...prev, price: value }));
    };
    
    const handleApplyClick = () => onApply(filters);
    const handleClearClick = () => {
        setFilters({});
        onClear();
    };

    // Filter options
    const options = {
        talla: [{value: "XS", label: "XS"}, {value: "S", label: "S"}, {value: "M", label: "M"}, {value: "L", label: "L"}, {value: "XL", label: "XL"}],
        color: [{value: "Negro", label: "Negro"}, {value: "Azul", label: "Azul"}, {value: "Gris", label: "Gris"}, {value: "Blanco", label: "Blanco"}, {value: "Marfil", label: "Marfil"}],
        estado: [{value: "Nuevo", label: "Nuevo"}, {value: "Casi Nuevo", label: "Casi Nuevo"}, {value: "Usado", label: "Usado"}],
        estilo: [{value: "Clásico", label: "Clásico"}, {value: "Moderno", label: "Moderno"}, {value: "Esmoquin", label: "Esmoquin"}],
        tejido: [{value: "Lana", label: "Lana"}, {value: "Seda", label: "Seda"}, {value: "Lino", label: "Lino"}],
        evento: [{value: "Boda", label: "Boda"}, {value: "Gala", label: "Gala"}, {value: "Negocios", label: "Negocios"}],
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 bg-surface-container rounded-2xl shadow-xl border border-outline/10"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Suit Name & Brand */}
                <div className="flex flex-col">
                    <label htmlFor="name" className="mb-2 text-sm font-medium text-on-surface-variant">Nombre del Traje</label>
                    <input type="text" id="name" name="name" value={filters.name || ''} onChange={handleInputChange} placeholder="Ej: Esmoquin Clásico" className="p-3 border rounded-lg bg-surface-container-high border-outline focus:ring-2 focus:ring-primary transition-colors"/>
                </div>
                 <div className="flex flex-col">
                    <label htmlFor="brand" className="mb-2 text-sm font-medium text-on-surface-variant">Marca</label>
                    <input type="text" id="brand" name="brand" value={filters.brand || ''} onChange={handleInputChange} placeholder="Ej: Armani" className="p-3 border rounded-lg bg-surface-container-high border-outline focus:ring-2 focus:ring-primary transition-colors"/>
                </div>

                {/* Custom Selects */}
                <CustomSelect name="talla" value={filters.talla} onChange={handleInputChange} options={options.talla} placeholder="Talla" />
                <CustomSelect name="color" value={filters.color} onChange={handleInputChange} options={options.color} placeholder="Color" />
                <CustomSelect name="estado" value={filters.estado} onChange={handleInputChange} options={options.estado} placeholder="Estado" />
                <CustomSelect name="estilo" value={filters.estilo} onChange={handleInputChange} options={options.estilo} placeholder="Estilo" />
                <CustomSelect name="tejido" value={filters.tejido} onChange={handleInputChange} options={options.tejido} placeholder="Tejido" />
                <CustomSelect name="evento" value={filters.evento} onChange={handleInputChange} options={options.evento} placeholder="Tipo de Evento" />

                {/* Price Slider */}
                <div className="col-span-full md:col-span-2 lg:col-span-4">
                    <label className="block mb-4 text-sm font-medium text-on-surface-variant">Rango de Precios</label>
                    <div className="px-2">
                        <Slider
                            range
                            min={0}
                            max={500}
                            defaultValue={[0, 500]}
                            value={filters.price || [0, 500]}
                            onChange={handleSliderChange}
                            trackStyle={{ backgroundColor: '#B5A6FF', height: 6 }}
                            handleStyle={{
                                borderColor: '#B5A6FF',
                                height: 20,
                                width: 20,
                                marginTop: -7,
                                backgroundColor: '#F0EFFF',
                                opacity: 1,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            railStyle={{ backgroundColor: '#44444F', height: 6 }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-on-surface-variant">
                        <span>€{filters.price ? filters.price[0] : 0}</span>
                        <span>€{filters.price ? filters.price[1] : 500}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end items-center mt-8 pt-6 border-t border-outline/20 gap-3">
                <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-on-surface-variant rounded-full hover:bg-on-surface/10 active:bg-on-surface/20 transition-all duration-200">Cancelar</button>
                <button onClick={handleClearClick} className="px-5 py-2.5 text-sm font-bold text-secondary rounded-full hover:bg-secondary/10 active:bg-secondary/20 transition-all duration-200">Limpiar Filtros</button>
                <button onClick={handleApplyClick} className="px-8 py-3 font-bold text-on-primary bg-primary rounded-full shadow-lg hover:bg-primary/90 active:scale-95 transform transition-all duration-200">Mostrar Resultados</button>
            </div>
        </motion.div>
    );
};

export default FilterPanel;
