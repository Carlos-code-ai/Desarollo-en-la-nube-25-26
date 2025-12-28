
import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const OrderItem = ({ order }) => {
    const [suit, setSuit] = useState(null);
    const [owner, setOwner] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            // Fetch Suit Details
            const suitRef = doc(db, 'trajes', order.trajeId);
            const suitSnap = await getDoc(suitRef);
            if (suitSnap.exists()) setSuit({ id: suitSnap.id, ...suitSnap.data() });

            // Fetch Owner Details
            if (suitSnap.exists()) {
                const ownerRef = doc(db, 'users', suitSnap.data().owner);
                const ownerSnap = await getDoc(ownerRef);
                if (ownerSnap.exists()) setOwner(ownerSnap.data());
            }
        };
        fetchDetails();
    }, [order]);

    const handleCancelOrder = async () => {
        if (!window.confirm("¿Estás seguro de que quieres cancelar este pedido?")) return;

        setIsCancelling(true);
        try {
            // 1. Update order status
            const orderRef = doc(db, 'pedidos', order.id);
            await updateDoc(orderRef, { estado: 'cancelado' });

            // 2. Update suit status
            const suitRef = doc(db, 'trajes', order.trajeId);
            await updateDoc(suitRef, { alquilado: false, alquiladoPor: null, desde: null, hasta: null, totalGanado: null });

            alert('¡Pedido cancelado con éxito!');
        } catch (error) {
            console.error("Error al cancelar el pedido: ", error);
            alert('Hubo un error al cancelar el pedido. Por favor, inténtalo de nuevo.');
        } finally {
            setIsCancelling(false);
        }
    };

    if (!suit || !owner) return <div className="p-4 rounded-lg bg-gray-100 animate-pulse">Cargando detalles del pedido...</div>;

    const isCancelled = order.estado === 'cancelado';

    return (
        <div className={`p-4 rounded-xl shadow-md flex flex-col sm:flex-row gap-4 border ${isCancelled ? 'bg-gray-200 border-gray-300' : 'bg-surface-container border-outline/20'}`}>
            {/* Image */}
            <img 
                src={suit.photos?.[0] || 'https://via.placeholder.com/150'}
                alt={`Foto de ${suit.name}`}
                className="w-full sm:w-28 h-40 sm:h-auto object-cover rounded-lg"
            />

            {/* Details */}
            <div className="flex-grow">
                <h3 className={`font-bold text-lg ${isCancelled ? 'text-gray-500 line-through' : 'text-on-surface'}`}>{suit.name}</h3>
                <p className="text-sm text-on-surface-variant">Dueño: {owner.displayName || 'Desconocido'}</p>
                <div className="text-sm mt-2">
                    <p><b>Fechas:</b> {format(new Date(order.desde), 'dd/MM/yyyy', { locale: es })} - {format(new Date(order.hasta), 'dd/MM/yyyy', { locale: es })}</p>
                    <p><b>Precio total:</b> <span className="font-bold">{order.precioTotal}€</span></p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-center items-center mt-4 sm:mt-0">
                {isCancelled ? (
                    <span className="font-bold text-center text-red-600 px-4 py-2 rounded-full bg-red-100">Cancelado</span>
                ) : (
                    <button 
                        onClick={handleCancelOrder} 
                        disabled={isCancelling}
                        className="w-full sm:w-auto bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                    >
                        {isCancelling ? 'Cancelando...' : 'Cancelar pedido'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderItem;
