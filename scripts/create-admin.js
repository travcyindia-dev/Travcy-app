/**
 * Script to create an admin user in Firebase
 * 
 * Run this script with: node scripts/create-admin.js
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

// Load service account
const serviceAccount = require('../src/firebase-upload/serviceAccountKey.json');

const app = initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  const ADMIN_EMAIL = 'admin@travelopia.com';
  const ADMIN_PASSWORD = 'Admin@123456'; // Change this!

  try {
    // Check if user already exists
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(ADMIN_EMAIL);
      console.log('Admin user already exists:', userRecord.uid);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new user
        userRecord = await auth.createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          displayName: 'Super Admin',
        });
        console.log('Created new admin user:', userRecord.uid);
      } else {
        throw error;
      }
    }

    // Set custom claims for admin role
    await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });
    console.log('Set admin custom claims');

    // Create/update user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: ADMIN_EMAIL,
      displayName: 'Super Admin',
      role: 'admin',
      createdAt: new Date(),
    }, { merge: true });
    console.log('Created/updated admin user in Firestore');

    console.log('\n========================================');
    console.log('Admin account created successfully!');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('========================================\n');

  } catch (error) {
    console.error('Error creating admin:', error);
  }

  process.exit(0);
}

createAdminUser();
