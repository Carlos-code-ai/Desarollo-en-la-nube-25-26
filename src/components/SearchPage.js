import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useRealtimeDB from '../hooks/useRealtimeDB.js';
import useSuitAnimations from '../hooks/useSuitAnimations.js';
import SuitCard, { SuitCardSkeleton } from './SuitCard.js';
import { gsap } from 'gsap';
import { usePopper } from 'react-popper';
import FilterPanel from './FilterPanel.js';

const SortIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg>;
const AnimatedFilterIcon = () => {
    const iconRef = useRef(null);
    useEffect(() => {
        const tl = gsap.timeline({ paused: true, repeat: 1, yoyo: true });
        gsap.utils.toArray(".knob", iconRef.current).forEach((knob, i) => {
            tl.to(knob, { attr: { cx: i % 2 === 0 ? 17 : 7 } }, 0);
        });
        const handleMouseEnter = () => tl.play(0);
        const currentIconRef = iconRef.current;
        currentIconRef.addEventListener('mouseenter', handleMouseEnter);
        return () => currentIconRef.removeEventListener('mouseenter', handleMouseEnter);
    }, []);
    return (
        <svg ref={iconRef} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 18h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5" />
            <circle className="knob" cx="10.5" cy="6" r="1.5" fill="currentColor" /><circle className="knob" cx="10.5" cy="12" r="1.5" fill="currentColor" /><circle className="knob" cx="10.5" cy="18" r="1.5" fill="currentColor" />
        </svg>
    );
};

const SortDropdown = ({ selected, onSelect }) => {
    const options = { 'default': 'Relevancia', 'price-asc': 'Precio: Menor a Mayor', 'price-desc': 'Precio: Mayor a Menor' };
    const [isOpen, setIsOpen] = useState(false);
    const popperRef = useRef(null), dropdownRef = useRef(null);
    const { styles, attributes } = usePopper(dropdownRef.current, popperRef.current, { placement: 'bottom-end', modifiers: [{ name: 'offset', options: { offset: [0, 8] } }] });
    useEffect(() => {
        const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener('mousedown', handleClickOutside);
        gsap.set(popperRef.current, { autoAlpha: 0, scale: 0.95 });
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    useEffect(() => {
        gsap.to(popperRef.current, { autoAlpha: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95, duration: 0.2, ease: 'power2.out' });
    }, [isOpen]);
    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(true)} className="flex items-center justify-between w-full h-10 px-4 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary">
                <span>{options[selected]}</span><SortIcon className={`h-5 w-5 text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div ref={popperRef} style={styles.popper} {...attributes.popper} className="z-10 w-64 bg-surface-container-high rounded-xl shadow-lg border border-outline/30 overflow-hidden">
                {Object.entries(options).map(([key, value]) => (<button key={key} onClick={() => { onSelect(key); setIsOpen(false); }} className="flex items-center justify-between w-full text-left px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-primary/10 hover:text-on-surface transition-colors Dduration-150"><span>{value}</span>{selected === key && <CheckIcon/>}</button>))}
            </div>
        </div>
    );
}

const SearchPage = ({ favorites, onToggleFavorite }) => {
  const { docs: allSuits, loading, error } = useRealtimeDB('trajes');
  const { containerRef } = useSuitAnimations();
  const location = useLocation();

  const normalizedSuits = useMemo(() => allSuits.map(s => ({ ...s, price: s.price || s.precioPorDia, name: s.name || s.nombre, eventType: s.eventType ? s.eventType.charAt(0).toUpperCase() + s.eventType.slice(1) : 'No especificado', condition: s.condition ? s.condition.charAt(0).toUpperCase() + s.condition.slice(1) : 'No especificado' })), [allSuits]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [filters, setFilters] = useState({ size: [], eventType: [], condition: [] });
  const [priceFilter, setPriceFilter] = useState(0);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const { availableFilters, maxPrice } = useMemo(() => {
    const sizes = new Set(), eventTypes = new Set(), conditions = new Set();
    let maxP = 0;
    normalizedSuits.forEach(s => {
        if (s.size) sizes.add(s.size);
        if (s.eventType) eventTypes.add(s.eventType);
        if (s.condition) conditions.add(s.condition);
        if (s.price > maxP) maxP = s.price;
    });
    return {
        availableFilters: { sizes: [...sizes].sort((a,b) => a.localeCompare(b, undefined, {numeric: true})), eventTypes: [...eventTypes].sort(), conditions: [...conditions].sort() },
        maxPrice: maxP > 0 ? maxP : 500
    };
  }, [normalizedSuits]);

  useEffect(() => { setPriceFilter(maxPrice); }, [maxPrice]);
  useEffect(() => { setSearchTerm(new URLSearchParams(location.search).get('q') || ''); }, [location.search]);

  const processedSuits = useMemo(() => {
    let suits = [...normalizedSuits];
    if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        suits = suits.filter(s => Object.values(s).some(val => String(val).toLowerCase().includes(lowerTerm)));
    }
    suits = suits.filter(s => {
        const sizeMatch = filters.size.length === 0 || filters.size.includes(s.size);
        const eventMatch = filters.eventType.length === 0 || filters.eventType.includes(s.eventType);
        const conditionMatch = filters.condition.length === 0 || filters.condition.includes(s.condition);
        const priceMatch = s.price <= priceFilter;
        return sizeMatch && eventMatch && conditionMatch && priceMatch;
    });
    if (sortBy === 'price-asc') suits.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') suits.sort((a, b) => b.price - a.price);
    return suits;
  }, [normalizedSuits, searchTerm, sortBy, filters, priceFilter]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: prev[key].includes(value) ? prev[key].filter(v => v !== value) : [...prev[key], value] }));
  };

  const resetFilters = () => {
      setFilters({ size: [], eventType: [], condition: [] });
      setPriceFilter(maxPrice);
  }

  const activeFilterCount = Object.values(filters).flat().length + (priceFilter < maxPrice ? 1 : 0);

  const renderResults = () => {
    if (loading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">{[...Array(6)].map((_, i) => <SuitCardSkeleton key={i} />)}</div>;
    if (error) return <p className="text-center text-error p-8">Error al cargar los trajes.</p>;
    if (processedSuits.length === 0 && !loading) return <div className="text-center py-16 px-6 bg-surface-container rounded-3xl"><h2 className="text-xl font-semibold text-on-surface">No se encontraron resultados</h2><p className="text-on-surface-variant mt-2">Intenta ajustar tu búsqueda o filtros para encontrar lo que buscas.</p></div>;
    return <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">{processedSuits.map(suit => <SuitCard key={suit.id} suit={suit} isFavorite={favorites.has(suit.id)} onToggleFavorite={onToggleFavorite} />)}</div>;
  }

  return (
    <>
      <FilterPanel isOpen={isFilterPanelOpen} onClose={() => setIsFilterPanelOpen(false)} availableFilters={availableFilters} activeFilters={filters} onFilterChange={handleFilterChange} onResetFilters={resetFilters} priceFilter={priceFilter} onPriceChange={setPriceFilter} maxPrice={maxPrice} />
      <div className="w-full max-w-7xl mx-auto flex flex-col space-y-8 px-4 sm:px-6 lg:px-8 py-8">
          <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-grow w-full">
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button onClick={() => setIsFilterPanelOpen(true)} className="relative flex-grow sm:flex-grow-0 flex items-center justify-center space-x-2 h-10 px-4 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors text-sm">
                  <AnimatedFilterIcon />
                  <span className="font-medium text-on-surface">Filtros</span>
                  {activeFilterCount > 0 && <div className="absolute -top-1 -right-1 h-5 w-5 grid place-items-center rounded-full bg-primary text-xs font-bold text-on-primary animate-pop-in">{activeFilterCount}</div>}
                </button>
                <div className="flex-grow sm:flex-grow-0"><SortDropdown selected={sortBy} onSelect={setSortBy} /></div>
              </div>
          </header>
          <main className="min-h-[400px]">{renderResults()}</main>
      </div>
    </>
  );
};

export default SearchPage;
