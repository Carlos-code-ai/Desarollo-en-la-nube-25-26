const admin = require("firebase-admin");

// Fetch the service account key JSON file contents
const serviceAccount = require("./serviceAccountKey.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://desarollogit-68916509-89c54-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = admin.database();

// The data we want to add
const testData = {
    "nombre": "Esmóquin Clásico Negro",
    "precioDia": 75.00,
    "talla": "52L",
    "tipoEvento": "Boda",
    "estado": "Excelente",
    "colores": ["Negro"],
    "materiales": ["Lana", "Seda"],
    "descripcion": "Elegante esmóquin negro de corte clásico, perfecto para bodas y eventos de gala. Solapas de seda y pantalón a juego.",
    "imagenes": ["https://picsum.photos/id/201/400/600"],
    "propietarioId": "user_juan_perez",
    "disponibilidad": true
  }

// Path to the 'trajes' node
const trajesRef = db.ref('trajes');

// Push the new data
trajesRef.push(testData)
  .then(() => {
    console.log("Test data added successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to add test data: ", error);
    process.exit(1);
  });
