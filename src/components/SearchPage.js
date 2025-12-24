
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useRealtimeDB from '../hooks/useRealtimeDB.js';
import useSuitAnimations from '../hooks/useSuitAnimations.js';
import SuitCard, { SuitCardSkeleton } from './SuitCard.js';
import { gsap } from 'gsap';
import { usePopper } from 'react-popper';

// --- Iconos ---
const SortIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg>;

// --- Icono de Filtro Animado ---
const AnimatedFilterIcon = () => {
    const iconRef = useRef(null);
    const knob1Ref = useRef(null);
    const knob2Ref = useRef(null);
    const knob3Ref = useRef(null);
    const tl = useRef(gsap.timeline({ paused: true, repeat: 1, yoyo: true }));

    useEffect(() => {
        tl.current
            .to(knob1Ref.current, { attr: { cx: 17 } }, 0)
            .to(knob2Ref.current, { attr: { cx: 7 } }, 0)
            .to(knob3Ref.current, { attr: { cx: 17 } }, 0);
    }, []);

    const handleMouseEnter = () => tl.current.play(0);
    
    return (
        <svg ref={iconRef} onMouseEnter={handleMouseEnter} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 18h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5" />
            <circle ref={knob1Ref} cx="10.5" cy="6" r="1.5" fill="currentColor" />
            <circle ref={knob2Ref} cx="10.5" cy="12" r="1.5" fill="currentColor" />
            <circle ref={knob3Ref} cx="10.5" cy="18" r="1.5" fill="currentColor" />
        </svg>
    );
}

// --- NUEVO Dropdown de Ordenación ---
const SortDropdown = ({ selected, onSelect }) => {
    const options = {
        'default': 'Ordenar por',
        'price-asc': 'Precio: de menor a mayor',
        'price-desc': 'Precio: de mayor a menor',
    };
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const popperRef = useRef(null);
    const { styles, attributes } = usePopper(dropdownRef.current, popperRef.current, {
        placement: 'bottom-end',
        modifiers: [{ name: 'offset', options: { offset: [0, 8] } }]
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        gsap.set(popperRef.current, { autoAlpha: 0, y: -10 });
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            gsap.to(popperRef.current, { autoAlpha: 1, y: 0, duration: 0.2, ease: 'power2.out' });
        } else {
            gsap.to(popperRef.current, { autoAlpha: 0, y: -10, duration: 0.2, ease: 'power2.in' });
        }
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full h-10 px-4 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
                <span>{options[selected]}</span>
                <SortIcon className={`h-5 w-5 text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div 
                    ref={popperRef} style={styles.popper} {...attributes.popper} 
                    className="z-10 w-64 bg-surface-container-high rounded-xl shadow-lg border border-outline/30 overflow-hidden"
                >
                    {Object.entries(options).map(([key, value]) => (
                        <button 
                            key={key} 
                            onClick={() => { onSelect(key); setIsOpen(false); }}
                            className="flex items-center justify-between w-full text-left px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-primary/10 hover:text-on-surface transition-colors duration-150"
                        >
                            <span>{value}</span>
                            {selected === key && <CheckIcon/>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// El resto de componentes (FilterPanel, SearchPage, etc.) permanecen igual...


const FilterPanel = ({ isOpen, onClose, availableFilters, activeFilters, onFilterChange, onResetFilters }) => {
    if (!isOpen) return null;

    const FilterGroup = ({ title, options, filterKey }) => (
        <div className="py-4 border-b border-outline/50">
            <h4 className="font-semibold text-on-surface mb-3 px-4">{title}</h4>
            <div className="space-y-1">
                {options.map(option => {
                    const isChecked = activeFilters[filterKey]?.includes(option);
                    return (
                        <label key={option} className="flex items-center px-4 py-2 hover:bg-surface-container-highest rounded-lg mx-2 transition-colors duration-150 cursor-pointer">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-outline text-primary focus:ring-primary"
                                checked={isChecked}
                                onChange={() => onFilterChange(filterKey, option)}
                            />
                            <span className="ml-3 text-sm text-on-surface-variant font-medium">{option}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in-fast" onClick={onClose}>
            <div 
                className="fixed top-0 right-0 h-full w-full max-w-xs bg-surface-container-high shadow-2xl z-50 flex flex-col animate-slide-in-right"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-outline">
                    <h3 className="text-lg font-bold text-on-surface">Filtros</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-high"><CloseIcon /></button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {availableFilters.sizes.length > 0 && <FilterGroup title="Talla" options={availableFilters.sizes} filterKey="size" />}
                    {availableFilters.eventTypes.length > 0 && <FilterGroup title="Tipo de Evento" options={availableFilters.eventTypes} filterKey="eventType" />}
                    {availableFilters.conditions.length > 0 && <FilterGroup title="Condición" options={availableFilters.conditions} filterKey="condition" />}
                </div>
                 <div className="p-4 border-t border-outline flex items-center gap-2">
                    <button 
                        onClick={onResetFilters}
                        className="w-1/3 h-11 rounded-full border border-outline text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors text-sm">Limpiar</button>
                    <button 
                        onClick={onClose}
                        className="w-2/3 h-11 rounded-full bg-primary text-on-primary font-bold hover:scale-105 transition-transform">Mostrar Resultados</button>
                </div>
            </div>
        </div>
    );
};

const SearchPage = ({ onSuitSelect, favorites, onToggleFavorite }) => {
  const { docs: allSuits, loading, error } = useRealtimeDB('trajes');
  const { containerRef } = useSuitAnimations();
  const location = useLocation();

  const normalizedSuits = useMemo(() => {
    return allSuits.map(suit => ({
      ...suit,
      size: suit.size || suit.talla,
      price: suit.price || suit.precioPorDia,
      name: suit.name || suit.nombre,
      description: suit.description || suit.descripcion,
      eventType: suit.eventType ? suit.eventType.charAt(0).toUpperCase() + suit.eventType.slice(1) : undefined,
      condition: suit.condition ? suit.condition.charAt(0).toUpperCase() + suit.condition.slice(1) : undefined,
    }));
  }, [allSuits]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [filters, setFilters] = useState({ size: [], eventType: [], condition: [] });
  const [processedSuits, setProcessedSuits] = useState([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    setSearchTerm(query || '');
  }, [location.search]);

  const availableFilters = useMemo(() => {
    const sizes = new Set();
    const eventTypes = new Set();
    const conditions = new Set();
    normalizedSuits.forEach(suit => {
        if (suit.size) sizes.add(suit.size);
        if (suit.eventType) eventTypes.add(suit.eventType);
        if (suit.condition) conditions.add(suit.condition);
    });
    return {
        sizes: [...sizes].sort((a, b) => String(a).localeCompare(String(b), undefined, {numeric: true})),
        eventTypes: [...eventTypes].sort(),
        conditions: [...conditions].sort(),
    };
  }, [normalizedSuits]);

  useEffect(() => {
    let suitsToProcess = [...normalizedSuits];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      suitsToProcess = suitsToProcess.filter(suit => 
        suit.name?.toLowerCase().includes(lowercasedTerm) ||
        suit.description?.toLowerCase().includes(lowercasedTerm) ||
        suit.size?.toLowerCase().includes(lowercasedTerm) ||
        suit.eventType?.toLowerCase().includes(lowercasedTerm) ||
        suit.colors?.toLowerCase().includes(lowercasedTerm)
      );
    }

    suitsToProcess = suitsToProcess.filter(suit => {
        const sizeMatch = filters.size.length === 0 || filters.size.includes(suit.size);
        const eventMatch = filters.eventType.length === 0 || filters.eventType.includes(suit.eventType);
        const conditionMatch = filters.condition.length === 0 || filters.condition.includes(suit.condition);
        return sizeMatch && eventMatch && conditionMatch;
    });

    if (sortBy === 'price-asc') {
      suitsToProcess.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      suitsToProcess.sort((a, b) => b.price - a.price);
    }

    setProcessedSuits(suitsToProcess);
  }, [normalizedSuits, searchTerm, sortBy, filters]);

  const handleFilterChange = (filterKey, value) => {
    setFilters(prevFilters => {
        const currentValues = prevFilters[filterKey];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        return { ...prevFilters, [filterKey]: newValues };
    });
  };

  const resetFilters = () => {
      setFilters({ size: [], eventType: [], condition: [] });
      setIsFilterPanelOpen(false);
  }

  const activeFilterCount = Object.values(filters).reduce((acc, current) => acc + current.length, 0);

  const renderResults = () => {
    if (loading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">{[...Array(6)].map((_, index) => <SuitCardSkeleton key={index} />)}</div>;
    if (error) return <p className="text-center text-error">Error al cargar los trajes.</p>;
    if (processedSuits.length === 0 && !loading) return <div className="text-center py-16 px-6 bg-surface-container rounded-3xl"><h2 className="text-xl font-semibold text-on-surface">No se encontraron resultados</h2><p className="text-on-surface-variant mt-2">Intenta ajustar tu búsqueda o filtros para encontrar lo que buscas.</p></div>;
    return <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">{processedSuits.map(suit => <SuitCard key={suit.id} suit={suit} isFavorite={favorites.has(suit.id)} onToggleFavorite={onToggleFavorite} />)}</div>;
  }

  return (
    <>
      <FilterPanel 
        isOpen={isFilterPanelOpen} 
        onClose={() => setIsFilterPanelOpen(false)} 
        availableFilters={availableFilters}
        activeFilters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={resetFilters}
      />

      <div className="w-full max-w-7xl mx-auto flex flex-col space-y-8 px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
              <button onClick={() => setIsFilterPanelOpen(true)} className="relative flex items-center space-x-2 h-10 px-4 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors text-sm">
                <AnimatedFilterIcon />
                <span className="font-medium text-on-surface">Filtros</span>
                {activeFilterCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">{activeFilterCount}</span>}
              </button>

              <SortDropdown selected={sortBy} onSelect={setSortBy} />

          </div>

          <div className="min-h-[400px]">{renderResults()}</div>
      </div>
    </>
  );
};

export default SearchPage;
