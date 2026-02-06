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
const testReport = {
    "reportedBy": "user_test_123",
    "reportedItemId": "-OkmbFwY0ixjxeA0IZuK", // ID of the test suit
    "reason": "This is a test report.",
    "status": "Pendiente",
    "createdAt": new Date().toISOString()
  }

// Path to the 'reports' node
const reportsRef = db.ref('reports');

// Push the new data
reportsRef.push(testReport)
  .then(() => {
    console.log("Test report added successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to add test report: ", error);
    process.exit(1);
  });
