
import { db } from './src/firebase.js';
import { ref, set, goOffline } from 'firebase/database';

const initialData = {
  trajes: {
    traje1: {
      nombre: 'Classic Charcoal Suit',
      descripcion: 'A classic suit for all occasions.',
      talla: 'M',
      color: 'Charcoal',
      precioPorDia: 50,
      imagenes: 'https://via.placeholder.com/300x400.png/333333/FFFFFF?text=Suit+1',
      disponibilidad: 'Disponible'
    },
    traje2: {
        nombre: 'Modern Navy Suit',
        descripcion: 'A modern and stylish navy suit.',
        talla: 'L',
        color: 'Navy',
        precioPorDia: 65,
        imagenes: 'https://via.placeholder.com/300x400.png/002147/FFFFFF?text=Suit+2',
        disponibilidad: 'Rented'
    },
    traje3: {
        nombre: 'Elegant Black Tuxedo',
        descripcion: 'An elegant black tuxedo for formal events.',
        talla: 'S',
        color: 'Black',
        precioPorDia: 80,
        imagenes: 'https://via.placeholder.com/300x400.png/333333/FFFFFF?text=Suit+3',
        disponibilidad: 'Available'
    }
  },
  perfiles: {
    perfil1: {
      nombre: 'John Doe',
      email: 'john.doe@example.com',
      rol: 'cliente'
    },
    perfil2: {
        nombre: 'Jane Smith',
        email: 'jane.smith@example.com',
        rol: 'cliente'
    }
  },
  reportes: {
    reporte1: {
      razon: 'Daños en el traje',
      descripcion: 'El traje tiene una mancha que no estaba.',
      reportador: 'perfil2',
      trajeReportado: 'traje1',
      estado: 'pendiente'
    }
  },
  reservas: {
      reserva1: {
          trajeId: 'traje1',
          clienteId: 'perfil1',
          fechaInicio: '2024-06-01',
          fechaFin: '2024-06-03',
          estado: 'confirmada'
      }
  }
};

const dbRef = ref(db);

console.log("Initializing database...");

set(dbRef, initialData)
  .then(() => {
    console.log("Database initialized successfully!");
    goOffline(db);
  })
  .catch((error) => {
    console.error("Error initializing database:", error);
    goOffline(db);
  });
