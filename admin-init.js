
import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// ==========================================================================================
// =================================   INSTRUCTIONS   =======================================
// ==========================================================================================
//
// 1.  A service account key file named `serviceAccountKey.json` must be in the project root.
//
// 2.  To get this file:
//     - Go to: https://console.firebase.google.com/project/desarollogit-68916509-89c54/settings/serviceaccounts/adminsdk
//     - Click "Generate new private key".
//     - Move the downloaded file to your project's root directory.
//     - Rename it to `serviceAccountKey.json`.
//
// 3.  Once the file is in place, run this script:
//     - node admin-init.js
//
// ==========================================================================================

const serviceAccountPath = './serviceAccountKey.json'; // <--- LOOKING FOR THIS FILE IN THE ROOT

try {
    const serviceAccount = require(serviceAccountPath);

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
      };


    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://desarollogit-68916509-89c54-default-rtdb.europe-west1.firebasedatabase.app"
    });

    const db = admin.database();
    const dbRef = db.ref();

    console.log("Initializing database with Admin SDK...");

    dbRef.set(initialData)
        .then(() => {
            console.log("Database initialized successfully!");
            console.log("The data structure is now clean and consistent.");
            console.log("Please restart your React application (`npm start`) to see the changes.");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Error initializing database:", error);
            process.exit(1);
        });

} catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
        console.error(`\n[ERROR] Could not find the service account file at: ${serviceAccountPath}`);
        console.error('Please make sure you have downloaded the service account key and placed it in the project root directory with the name `serviceAccountKey.json`.\n');
    } else if (error.code === 'ERR_INVALID_ARG_TYPE') {
        console.error(`\n[ERROR] The service account file at: ${serviceAccountPath} appears to be corrupted or not a valid JSON file.`);
        console.error('Please re-download the file from the Firebase console and try again.\n');
    } else {
        console.error('An unexpected error occurred: ', error);
    }
    process.exit(1);
}
