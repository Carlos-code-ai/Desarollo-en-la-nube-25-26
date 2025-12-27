import React, { useState, useEffect, useMemo, useRef } from 'react';
import useRealtimeDB from '../hooks/useRealtimeDB.js';
import useDebounce from '../hooks/useDebounce';
import { Link } from 'react-router-dom';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-on-surface-variant">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const CompactSuitCard = ({ suit, onClick }) => (
    <Link to={`/suit/${suit.id}`} onClick={onClick} className="flex items-center p-2 -mx-2 rounded-lg hover:bg-surface-container transition-colors duration-200">
        <img src={suit.imageUrl} alt={suit.name || suit.marca} className="w-16 h-20 object-cover rounded-md" />
        <div className="ml-4">
            <h4 className="font-bold text-sm text-on-surface">{suit.name || suit.marca}</h4>
            <p className="text-xs text-on-surface-variant">{(suit.eventType || suit.tipoEvento || '' ).charAt(0).toUpperCase() + (suit.eventType || suit.tipoEvento || '' ).slice(1)}</p>
            <p className="text-xs text-on-surface-variant">Talla: {suit.size || suit.talla}</p>
            <p className="text-sm font-semibold text-primary mt-1">{suit.price}€/día</p>
        </div>
    </Link>
);

const SearchScreen = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const { docs: allSuits, loading } = useRealtimeDB('trajes');
    const inputRef = useRef(null);

    const filteredResults = useMemo(() => {
        if (!debouncedSearchTerm) return [];
        const lowercasedTerm = debouncedSearchTerm.toLowerCase();
        return allSuits.filter(suit => {
            const fieldsToSearch = [
                suit.name,
                suit.marca,
                suit.description,
                suit.eventType,
                suit.tipoEvento,
                suit.color,
                suit.colors,
                suit.size,
                suit.talla,
                suit.condition,
                suit.estilo
            ];
            return fieldsToSearch.some(field => field && typeof field === 'string' && field.toLowerCase().includes(lowercasedTerm));
        });
    }, [debouncedSearchTerm, allSuits]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-fade-in-fast">
            <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-2 py-4 border-b border-outline/20">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <SearchIcon />
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Busca tu traje ideal..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-surface-container border-transparent rounded-full py-3 pl-11 pr-4 text-on-surface placeholder-on-surface-variant focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                        />
                    </div>
                    <button onClick={onClose} className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">Cancelar</button>
                </div>

                <div className="mt-4 overflow-auto" style={{ height: 'calc(100vh - 80px)' }}>
                   {(loading && searchTerm) && <p className="text-center text-on-surface-variant py-8">Buscando...</p>}
                   
                   {(searchTerm.length > 0 && !loading && filteredResults.length === 0) && (
                       <p className="text-center text-on-surface-variant py-8">{`No se encontraron resultados para "${searchTerm}".`}</p>
                   )}

                    {(filteredResults.length > 0) && (
                        <div className="flow-root">
                            <div className="-my-2 divide-y divide-outline/10">
                                {filteredResults.map(suit => <CompactSuitCard key={suit.id} suit={suit} onClick={onClose} />)}
                            </div>
                        </div>
                    )}

                    {(searchTerm.length === 0 && !loading) && (
                        <div className="text-center py-16 px-6">
                            <span className="material-icons text-5xl text-on-surface-variant/50">search</span>
                            <h2 className="text-xl font-semibold text-on-surface mt-4">Encuentra tu traje perfecto</h2>
                            <p className="text-on-surface-variant mt-2">Busca por nombre, marca, color, talla o tipo de evento.</p>
                      </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchScreen;
