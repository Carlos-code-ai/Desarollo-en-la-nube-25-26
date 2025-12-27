
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SuggestionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.95.95c.45 0 .89.18 1.2.5l.44.44c.32.32.5.75.5 1.2v2.81c0 .45-.18.89-.5 1.2l-.44.44a1.7 1.7 0 01-1.2.5h-2.1a1.7 1.7 0 01-1.2-.5l-.44-.44a1.7 1.7 0 01-.5-1.2V2.6c0-.45.18-.89.5-1.2l.44-.44c.32-.32.75-.5 1.2-.5h2.1zm8.49 8.49c.45 0 .89.18 1.2.5l.44.44c.32.32.5.75.5 1.2v2.81c0 .45-.18.89-.5 1.2l-.44.44a1.7 1.7 0 01-1.2.5h-2.1a1.7 1.7 0 01-1.2-.5l-.44-.44a1.7 1.7 0 01-.5-1.2v-2.8c0-.45.18-.89.5-1.2l.44-.44c.32-.32.75-.5 1.2-.5h2.1zM1.4 9.44c.45 0 .89.18 1.2.5l.44.44c.32.32.5.75.5 1.2v2.81c0 .45-.18.89-.5 1.2l-.44.44a1.7 1.7 0 01-1.2.5H.45a1.7 1.7 0 01-1.2-.5L-.2 15.6a1.7 1.7 0 01-.5-1.2v-2.8c0-.45.18-.89.5-1.2l.44-.44a1.7 1.7 0 011.2-.5h2.1z" /></svg>;

const SearchBar = ({ allSuits, onSearch }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();
    const searchContainerRef = useRef(null);

    const suggestions = ['Boda', 'Esmoquin', 'Lino', 'Verano', 'Gala'];

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        setHistory(storedHistory);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateHistory = (newQuery) => {
        const updatedHistory = [newQuery, ...history.filter(h => h !== newQuery)].slice(0, 5);
        setHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    };

    const handleSearch = (searchQuery) => {
        if (!searchQuery.trim()) return;
        setQuery(searchQuery);
        onSearch(searchQuery);
        updateHistory(searchQuery);
        setIsFocused(false);
        navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    };

    const filteredSuits = query.length > 1 ? allSuits.filter(suit => 
        suit.name.toLowerCase().includes(query.toLowerCase()) ||
        suit.marca.toLowerCase().includes(query.toLowerCase()) ||
        suit.color.toLowerCase().includes(query.toLowerCase()) ||
        suit.tipoEvento.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5) : [];

    return (
        <div ref={searchContainerRef} className="relative w-full max-w-lg mx-auto">
            <div className="flex items-center bg-surface-container-high rounded-full shadow-md transition-all duration-300 ease-in-out focus-within:shadow-lg">
                <div className="pl-5 pr-2 text-on-surface-variant">
                    <SearchIcon />
                </div>
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                    placeholder="Buscar trajes por nombre, marca, color..."
                    className="w-full h-12 bg-transparent text-on-surface placeholder:text-on-surface-variant focus:outline-none"
                />
            </div>

            {isFocused && (
                 <div className="absolute top-full mt-2 w-full bg-surface-container rounded-2xl shadow-xl overflow-hidden z-20 animate-fade-in-fast">
                    {query.length > 1 && filteredSuits.length > 0 && (
                        <div className="py-2">
                            <h3 className="text-xs font-semibold text-on-surface-variant uppercase px-4 py-2">Resultados</h3>
                            <ul>
                                {filteredSuits.map(suit => (
                                    <li key={suit.id} onClick={() => handleSearch(suit.name)} className="px-4 py-3 hover:bg-surface-container-high cursor-pointer text-on-surface flex items-center gap-4">
                                        <img src={suit.imageUrl} alt={suit.name} className="w-10 h-10 object-cover rounded-lg"/>
                                        <span>{suit.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {query.length === 0 && history.length > 0 && (
                        <div className="py-2">
                             <h3 className="text-xs font-semibold text-on-surface-variant uppercase px-4 py-2">Historial</h3>
                            <ul>
                                {history.map(item => (
                                    <li key={item} onClick={() => handleSearch(item)} className="px-4 py-2 hover:bg-surface-container-high cursor-pointer text-on-surface flex items-center gap-3">
                                       <HistoryIcon /> <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                     {query.length === 0 && (
                        <div className="py-2">
                            <h3 className="text-xs font-semibold text-on-surface-variant uppercase px-4 py-2">Sugerencias</h3>
                            <ul>
                                {suggestions.map(item => (
                                    <li key={item} onClick={() => handleSearch(item)} className="px-4 py-2 hover:bg-surface-container-high cursor-pointer text-on-surface flex items-center gap-3">
                                       <SuggestionIcon/> <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                 </div>
            )}
        </div>
    )
}

export default SearchBar;
