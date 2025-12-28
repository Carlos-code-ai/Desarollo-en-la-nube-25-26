
import React from 'react';
import { Link } from 'react-router-dom';

const FavoriteItem = ({ item }) => {
    return (
        <Link to={`/suit/${item.id}`} className="relative aspect-[4/5] w-full bg-surface-container-high overflow-hidden group rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <img 
                src={item.photos?.[0] || 'https://via.placeholder.com/300x400.png?text=Traje+Sin+Imagen'} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white font-semibold truncate">{item.name}</p>
                <p className="text-white text-sm">{item.precio}€/día</p>
            </div>
        </Link>
    );
};

export default FavoriteItem;
