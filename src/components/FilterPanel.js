import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

const FilterChip = ({ label, isSelected, onClick }) => {
    const chipRef = useRef(null);
    const handleClick = () => {
        gsap.to(chipRef.current, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut',
            onComplete: () => {
                gsap.set(chipRef.current, { scale: 1 });
            }
        });
        onClick();
    };

    return (
        <button
            ref={chipRef}
            onClick={handleClick}
            className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-200 ${isSelected ? 'bg-primary border-primary text-on-primary' : 'bg-surface-container border-outline/50 text-on-surface-variant hover:bg-surface-container-high hover:border-outline'}`}>
            {label}
        </button>
    );
};

const PriceRangeSlider = ({ max, value, onChange }) => {
    const progress = max > 0 ? (value / max) * 100 : 0;
    const thumbRef = useRef(null);

    const handleInteractionStart = () => {
        gsap.to(thumbRef.current, { scale: 1.25, duration: 0.2, ease: 'power2.out' });
    };

    const handleInteractionEnd = () => {
        gsap.to(thumbRef.current, { scale: 1, duration: 0.2, ease: 'power2.in' });
    };

    const sliderThumbStyles = `
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none; 
        width: 0;
        height: 0;
        opacity: 0;
      }
      input[type=range]::-moz-range-thumb {
        width: 0;
        height: 0;
        border: 0;
      }
      input[type=range]::-ms-thumb {
        width: 0;
        height: 0;
      }
    `;

    return (
        <div className="px-6 pt-4">
            <style>{sliderThumbStyles}</style>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="price" className="font-semibold text-on-surface">Precio</label>
                <span className="px-3 py-1 text-sm font-bold rounded-full bg-primary/20 text-primary">Hasta {Math.round(value)}€</span>
            </div>
            <div className="relative w-full h-10 flex items-center">
                <input
                    type="range"
                    id="price"
                    min={0}
                    max={max}
                    value={value}
                    onChange={e => onChange(Number(e.target.value))}
                    onMouseDown={handleInteractionStart}
                    onMouseUp={handleInteractionEnd}
                    onTouchStart={handleInteractionStart}
                    onTouchEnd={handleInteractionEnd}
                    className="w-full h-2 bg-transparent appearance-none cursor-pointer z-10 relative"
                />
                <div className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2 rounded-full bg-surface-container-highest overflow-hidden pointer-events-none">
                    <div 
                        className="h-full bg-primary"
                        style={{ width: `${progress}%`}}
                    />
                </div>
                <div 
                    ref={thumbRef}
                    className="absolute top-1/2 h-7 w-7 flex items-center justify-center bg-primary rounded-full text-on-primary font-bold text-base -translate-y-1/2 -translate-x-1/2 shadow-lg pointer-events-none"
                    style={{ left: `${progress}%`}}
                >
                    €
                </div>
            </div>
        </div>
    );
};

const FilterPanel = ({ isOpen, onClose, availableFilters, activeFilters, onFilterChange, onResetFilters, priceFilter, onPriceChange, maxPrice }) => {
    const panelRef = useRef();
    const tl = useRef(null);
    const resetBtnRef = useRef(null);
    const resultsBtnRef = useRef(null);
    const closeIconRef = useRef(null);

    useEffect(() => {
        tl.current = gsap.timeline({ paused: true })
            .to('.filter-backdrop', { autoAlpha: 1, duration: 0.3 })
            .to(panelRef.current, { x: 0, duration: 0.4, ease: 'power3.out' }, '-=0.2');
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            tl.current.play();
        } else {
            document.body.style.overflow = 'auto';
            if (tl.current && tl.current.progress() > 0) {
                 tl.current.reverse();
            }
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleReset = () => {
        gsap.to(resetBtnRef.current, { scale: 0.95, yoyo: true, repeat: 1, duration: 0.15, ease: 'power1.inOut' });
        onResetFilters();
    };

    const handleResultsClose = () => {
        gsap.to(resultsBtnRef.current, { scale: 0.95, yoyo: true, repeat: 1, duration: 0.15, ease: 'power1.inOut', onComplete: onClose });
    };

    const handleIconClose = () => {
        gsap.to(closeIconRef.current, {
            rotation: '+=180',
            scale: 0.8,
            duration: 0.3,
            ease: 'power2.inOut',
            onComplete: () => {
                onClose();
                gsap.set(closeIconRef.current, { rotation: '-=180', scale: 1 });
            }
        });
    };

    const FilterGroup = ({ title, options, filterKey }) => (
        <div className="py-6 border-b border-outline/30">
            <h4 className="font-semibold text-on-surface mb-4 px-6">{title}</h4>
            <div className="flex flex-wrap gap-3 px-6">
                {options.map(option => (
                    <FilterChip key={option} label={option} isSelected={activeFilters[filterKey]?.includes(option)} onClick={() => onFilterChange(filterKey, option)} />
                ))}
            </div>
        </div>
    );

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div className="filter-backdrop fixed inset-0 bg-black/30 opacity-0 backdrop-blur-sm" onClick={handleIconClose} />
            <div ref={panelRef} className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-container shadow-2xl flex flex-col transform translate-x-full rounded-l-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-outline">
                    <h3 className="text-xl font-bold text-on-surface ml-2">Filtros</h3>
                    <button ref={closeIconRef} onClick={handleIconClose} className="p-2 rounded-full hover:bg-surface-container-high transition-colors"><CloseIcon /></button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    <div className="py-4 border-b border-outline/30"><PriceRangeSlider max={maxPrice} value={priceFilter} onChange={onPriceChange} /></div>
                    {availableFilters.sizes?.length > 0 && <FilterGroup title="Talla" options={availableFilters.sizes} filterKey="size" />}
                    {availableFilters.eventTypes?.length > 0 && <FilterGroup title="Tipo de Evento" options={availableFilters.eventTypes} filterKey="eventType" />}
                    {availableFilters.conditions?.length > 0 && <FilterGroup title="Condición" options={availableFilters.conditions} filterKey="condition" />}
                </div>
                <div className="p-4 border-t border-outline flex items-center gap-4 bg-surface-container">
                    <button ref={resetBtnRef} onClick={handleReset} className="w-full h-12 rounded-full border border-outline text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors text-sm">Limpiar Filtros</button>
                    <button ref={resultsBtnRef} onClick={handleResultsClose} className="w-full h-12 rounded-full bg-primary text-on-primary font-bold hover:bg-primary/90 transition-colors text-sm">Ver Resultados</button>
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;