import * as admin from 'firebase-admin';
import serviceAccount from './firebase-config.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: 'https://carowners-97d56.firebase.io.com',
});

const db = admin.firestore();

export { admin, db };
