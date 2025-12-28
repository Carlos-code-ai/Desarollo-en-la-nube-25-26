
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const SuitItem = ({ suit }) => {

    const isRented = suit.alquilado;

    const renderStatus = () => {
        if (isRented) {
            return (
                <div className="mt-2 p-3 bg-red-100 rounded-lg text-left">
                    <p className="font-semibold text-red-800">Alquilado</p>
                    <div className="text-sm text-red-700 mt-1">
                        <p><b>Usuario:</b> {suit.alquiladoPor || 'No especificado'}</p>
                        <p><b>Fechas:</b> {suit.desde && suit.hasta ? 
                            `${format(new Date(suit.desde), 'dd/MM/yy', { locale: es })} - ${format(new Date(suit.hasta), 'dd/MM/yy', { locale: es })}` 
                            : 'No especificadas'}
                        </p>
                        <p><b>Ganancia:</b> <span className="font-bold">{suit.totalGanado || 0}€</span></p>
                    </div>
                </div>
            );
        }
        return (
            <div className="mt-2 p-3 bg-green-100 rounded-lg">
                <p className="font-semibold text-green-800">Disponible</p>
            </div>
        );
    };

    return (
        <div className="w-full bg-surface-container rounded-2xl shadow-md overflow-hidden border border-outline/20 flex flex-col">
            <Link to={`/suit/${suit.id}`} className="w-full h-56 flex-shrink-0">
                <img 
                    src={suit.imageUrls?.[0] || 'https://via.placeholder.com/400x500.png?text=Sin+Imagen'} 
                    alt={suit.name} 
                    className="w-full h-full object-cover"
                />
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-on-surface text-lg text-left">{suit.name}</h3>
                {renderStatus()}
            </div>
        </div>
    );
};

export default SuitItem;
