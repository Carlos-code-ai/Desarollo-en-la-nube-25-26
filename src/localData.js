
export const suitsData = [
    {
      id: 'traje1',
      name: 'Classic Charcoal Suit',
      description: 'A timeless charcoal suit, perfect for business meetings or formal events. Made from 100% premium wool.',
      size: 'M',
      colors: 'Charcoal',
      price: 50,
      imageUrls: [
        'https://firebasestorage.googleapis.com/v0/b/desarollogit-68916509-89c54.appspot.com/o/trajes%2Ftraje1_frontal.png?alt=media&token=e9e6a9b0-9f5e-4b47-b8d6-6e4a2d6c1c2a',
        'https://firebasestorage.googleapis.com/v0/b/desarollogit-68916509-89c54.appspot.com/o/trajes%2Ftraje1_trasero.png?alt=media&token=c2e8c22b-5847-4a4b-8e2b-2e9b8f2d257a',
        'https://firebasestorage.googleapis.com/v0/b/desarollogit-68916509-89c54.appspot.com/o/trajes%2Ftraje1_detalle.png?alt=media&token=9a1e3b2e-7b7e-4b6e-9e4a-9e1e2d8b7a9e',
      ],
      availability: 'Available',
      ownerId: 'default-owner-id',
      condition: 'New',
      eventType: 'Formal',
    },
    {
      id: 'traje2',
      name: 'Modern Navy Blue Suit',
      description: 'A stylish and modern navy blue suit with a slim fit. Ideal for weddings and cocktail parties.',
      size: 'L',
      colors: 'Navy Blue',
      price: 65,
      imageUrls: [
        'https://firebasestorage.googleapis.com/v0/b/desarollogit-68916509-89c54.appspot.com/o/trajes%2Ftraje2_frontal.png?alt=media&token=a7d2d3c3-6e8e-4b1a-9d2c-8a2b3e4d5f6g',
      ],
      availability: 'Rented',
      ownerId: 'default-owner-id',
      condition: 'Used',
      eventType: 'Wedding',
    },
    {
      id: 'traje3',
      name: 'Elegant Black Tuxedo',
      description: 'An elegant black tuxedo for the most formal events. Features satin lapels and a classic design.',
      size: 'S',
      colors: 'Black',
      price: 80,
      imageUrls: [
        'https://firebasestorage.googleapis.com/v0/b/desarollogit-68916509-89c54.appspot.com/o/trajes%2Ftraje3_frontal.png?alt=media&token=b3f2e1d0-6b9a-4e2d-8f8a-9a9b8c7d6e5f',
        'https://firebasestorage.googleapis.com/v0/b/desarollogit-68916509-89c54.appspot.com/o/trajes%2Ftraje3_detalle.png?alt=media&token=c8d7e6f5-4a3b-2c1d-0e9f-8a7b6c5d4e3f',
      ],
      availability: 'Available',
      ownerId: 'default-owner-id',
      condition: 'Like New',
      eventType: 'Gala',
    }
  ];
  
  export const usersData = {
    'default-owner-id': {
        displayName: 'The Suit Owner',
        email: 'owner@example.com',
        photoURL: 'https://via.placeholder.com/150/000000/FFFFFF?text=Owner',
    },
  };
