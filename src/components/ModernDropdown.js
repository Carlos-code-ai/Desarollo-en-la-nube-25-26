
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const ModernDropdown = ({ options, selected, onSelect, name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            const dropdownMenu = dropdownRef.current.querySelector('.dropdown-menu');
            gsap.fromTo(dropdownMenu, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, ease: 'power2.out' });
        }
    }, [isOpen]);

    const handleSelect = (option) => {
        const value = typeof option === 'object' ? option.value : option;
        onSelect({ target: { name, value } });
        setIsOpen(false);
    };

    const getSelectedLabel = () => {
        const selectedOption = options.find(opt => (typeof opt === 'object' ? opt.value : opt) === selected);
        return selectedOption ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) : selected;
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button" // Important to prevent form submission
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-2 bg-surface-container-lowest border border-outline rounded-lg flex justify-between items-center text-left"
            >
                <span>{getSelectedLabel()}</span>
                <span className={`material-icons transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}>
                    arrow_drop_down
                </span>
            </button>
            {isOpen && (
                <div className="dropdown-menu absolute z-10 w-full mt-1 bg-surface-container-high border border-outline rounded-lg shadow-lg">
                    {options.map(option => {
                        const value = typeof option === 'object' ? option.value : option;
                        const label = typeof option === 'object' ? option.label : option;
                        return (
                            <div
                                key={value}
                                onClick={() => handleSelect(option)}
                                className="p-2 hover:bg-surface-container cursor-pointer"
                            >
                                {label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ModernDropdown;
