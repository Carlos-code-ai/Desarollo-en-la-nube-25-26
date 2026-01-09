
import React from 'react';
import { Link } from 'react-router-dom';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNnB4IiBmaWxsPSIjY2NjIj5TaW4gSW1hZ2VuPC90ZXh0Pjwvc3ZnPg==";

const FavoriteItem = ({ item }) => {
    const imageUrl = item.photos?.[0] || item.imageUrl || placeholderImage;
    
    return (
        <Link to={`/suit/${item.id}`} className="relative aspect-[4/5] w-full bg-surface-container-high overflow-hidden group rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <img 
                src={imageUrl} 
                alt={item.name || 'Traje Favorito'} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white font-semibold truncate">{item.name || 'Sin Nombre'}</p>
                <p className="text-white text-sm">{(item.precio || item.price) ? `${item.precio || item.price}€/día` : ''}</p>
            </div>
        </Link>
    );
};

export default FavoriteItem;
