import React from 'react';
import { Link } from 'react-router-dom';

const SuitCard = ({ suit, onDelete }) => {
    const imageUrl = suit && suit.imagenes ? suit.imagenes[0] : 'https://www.w3schools.com/w3images/jeans3.jpg';
    const name = suit && suit.nombre ? suit.nombre : 'Unnamed Suit';
    const price = suit && suit.precioPorDia ? `$${suit.precioPorDia}/day` : 'Price not available';
    const size = suit && suit.talla ? `Size: ${suit.talla}` : '';
    const color = suit && suit.color ? `Color: ${suit.color}` : '';
    const availability = suit && suit.alquiladoPor ? 'Rented' : 'Available';

    return (
        <div className="w3-card-4">
            <img src={imageUrl} alt={name} style={{width: '100%'}} />
            <div className="w3-container w3-center">
                <h5 className="w3-text-grey">{name}</h5>
                <p>{price}</p>
                <p>{size}</p>
                <p>{color}</p>
                <p>{availability}</p>
                <>
                    <Link to={`/edit-suit/${suit.id}`} className="w3-button w3-dark-grey">Edit</Link>
                    <button onClick={() => onDelete(suit.id)} className="w3-button w3-red">Delete</button>
                </>
                <p><button className="w3-button w3-dark-grey w3-block">View Details</button></p>
            </div>
        </div>
    );
};

export default SuitCard;
