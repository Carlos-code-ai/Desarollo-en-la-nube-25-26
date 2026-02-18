
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://desarollogit-68916509-89c54-default-rtdb.europe-west1.firebasedatabase.app/'
});

const email = process.argv[2];

if (!email) {
  console.log('Please provide an email address.');
  process.exit(1);
}

async function setAdminRole() {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.database().ref(`admins/${user.uid}`).set(true);
    console.log(`Successfully set admin role for ${email}`);
  } catch (error) {
    console.error('Error setting admin role:', error);
  } finally {
    process.exit(0);
  }
}

setAdminRole();
