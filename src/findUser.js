
import { ref, onValue } from 'firebase/database';
import { rtdb } from './firebase';

const findUserByEmail = (email) => {
  const usersRef = ref(rtdb, 'users');
  onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const userEntry = Object.entries(data).find(([uid, user]) => user.email === email);
      if (userEntry) {
        const [uid, user] = userEntry;
        console.log(`User found: UID = ${uid}, User = ${JSON.stringify(user)}`);
      } else {
        console.log('User not found.');
      }
    } else {
      console.log('No users found in the database.');
    }
  }, { onlyOnce: true });
};

findUserByEmail('cllabresllovet@gmail.com');
