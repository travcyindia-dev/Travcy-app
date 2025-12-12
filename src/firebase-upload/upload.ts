import admin from 'firebase-admin';
// import agencies from './travelAgencies.json';

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json'))
});

const db = admin.firestore();

interface Agency {
  id: number;
  name: string;
  location: string;
  email: string;
  phone: string;
  rating: number;
}

// async function uploadAgencies() {
//   const batch = db.batch();

//   (agencies as Agency[]).forEach(agency => {
//     const docRef = db.collection('travelAgencies').doc(agency.id.toString());
//     batch.set(docRef, agency);
//   });

//   await batch.commit();
//   console.log('All agencies uploaded successfully!');
// }

// uploadAgencies().catch(console.error);
