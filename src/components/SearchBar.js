
import React, { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';

// --- Icono SVG ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;

const SearchBar = ({ onSearch, initialValue = '' }) => {
    const [query, setQuery] = useState(initialValue);
    
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        onSearch(debouncedQuery);
    }, [debouncedQuery, onSearch]);
    
    useEffect(() => {
        setQuery(initialValue);
    }, [initialValue]);

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <div className="relative w-full max-w-lg mx-auto">
            <form onSubmit={handleSearch} className="flex items-center bg-surface-container-high rounded-full shadow-md transition-all duration-300 ease-in-out focus-within:shadow-lg">
                <div className="pl-5 pr-2 text-on-surface-variant">
                    <SearchIcon />
                </div>
                <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar traje..."
                    className="w-full h-12 bg-transparent text-on-surface placeholder:text-on-surface-variant focus:outline-none"
                />
            </form>
        </div>
    );
};

export default SearchBar;
