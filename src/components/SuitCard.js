
import React from 'react';

const SuitCard = ({ suit }) => {
  const imageUrl = suit.fotos && suit.fotos.length > 0 ? suit.fotos[0] : 'https://www.w3schools.com/w3images/jeans3.jpg';
  const name = suit.marca || 'Unnamed Suit';

  return (
    <div className="w3-card-4">
        <img src={imageUrl} alt={name} style={{width: '100%'}} />
        <div className="w3-container w3-center">
            <h5 className="w3-text-grey">{name}</h5>
            <p><button className="w3-button w3-dark-grey w3-block">View Details</button></p>
        </div>
    </div>
  );
};

export default SuitCard;
