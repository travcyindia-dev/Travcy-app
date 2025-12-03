/**
 * Script to create an admin user in Firebase
 * 
 * Run this script with: npx ts-node scripts/create-admin.ts
 * 
 * Or you can manually create the admin in Firebase Console:
 * 1. Go to Firebase Console → Authentication → Users → Add User
 * 2. Enter email and password
 * 3. Then go to Firestore → users collection → create document with uid as ID
 *    Add field: role = "admin"
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Load service account - adjust path as needed
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
    } catch (error: any) {
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
