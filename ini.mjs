
// Import the entire firebase module as a default export
import firebase from './src/firebase.js';
import { ref, set, goOffline } from 'firebase/database';

// Destructure the rtdb object from the imported module
const { rtdb } = firebase;

// ==========================================================================================
// CORRECTED DATA STRUCTURE
//
// This script now uses the data schema expected by the React components:
// - `name`, `description`, `size`, `price`, `ownerId`, etc.
// - `imageUrls` is now correctly formatted as an Array of strings.
//
// Running this script will reset the database to a clean, consistent state,
// resolving the "t.map is not a function" error at its source.
// ==========================================================================================

const ownerId = 'default-owner-id'; // Placeholder owner ID

const initialData = {
  trajes: {
    traje1: {
      name: 'Classic Charcoal Suit',
      description: 'A timeless charcoal suit, perfect for business meetings or formal events. Made from 100% premium wool.',
      size: 'M',
      colors: 'Charcoal',
      price: 50,
      imageUrls: [
        'https://via.placeholder.com/600x800.png/333333/FFFFFF?text=Suit+Front',
        'https://via.placeholder.com/600x800.png/444444/FFFFFF?text=Suit+Back',
        'https://via.placeholder.com/600x800.png/555555/FFFFFF?text=Detail',
      ],
      availability: 'Available',
      ownerId: ownerId,
      condition: 'New',
      eventType: 'Formal',
    },
    traje2: {
      name: 'Modern Navy Blue Suit',
      description: 'A stylish and modern navy blue suit with a slim fit. Ideal for weddings and cocktail parties.',
      size: 'L',
      colors: 'Navy Blue',
      price: 65,
      imageUrls: [
        'https://via.placeholder.com/600x800.png/002147/FFFFFF?text=Navy+Suit',
      ],
      availability: 'Rented',
      ownerId: ownerId,
      condition: 'Used',
      eventType: 'Wedding',
    },
    traje3: {
      name: 'Elegant Black Tuxedo',
      description: 'An elegant black tuxedo for the most formal events. Features satin lapels and a classic design.',
      size: 'S',
      colors: 'Black',
      price: 80,
      imageUrls: [
        'https://via.placeholder.com/600x800.png/000000/FFFFFF?text=Tuxedo+Front',
        'https://via.placeholder.com/600x800.png/111111/FFFFFF?text=Tuxedo+Detail',
      ],
      availability: 'Available',
      ownerId: ownerId,
      condition: 'Like New',
      eventType: 'Gala',
    }
  },
  users: {
    'default-owner-id': {
        displayName: 'The Suit Owner',
        email: 'owner@example.com',
        photoURL: 'https://via.placeholder.com/150/000000/FFFFFF?text=Owner',
    },
  },
  // Other collections can be added here if needed
};

// We get a reference to the root of the database.
const dbRef = ref(rtdb);

console.log("Initializing database with CORRECTED data structure...");

// We use `set` to completely overwrite all data at the root reference.
set(dbRef, initialData)
  .then(() => {
    console.log("Database initialized successfully!");
    console.log("The data structure is now clean and consistent.");
    console.log("Please restart your React application (`npm start`) to see the changes.");
    // goOffline disconnects from the database, useful for scripts.
    goOffline(rtdb);
  })
  .catch((error) => {
    console.error("Error initializing database:", error);
    // Also disconnect on error.
    goOffline(rtdb);
  });

