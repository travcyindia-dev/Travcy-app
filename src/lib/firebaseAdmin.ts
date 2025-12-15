import admin from "firebase-admin";
// import serviceAccountJson from "@/firebase-upload/serviceAccountKey.json"; // rename import

// const serviceAccount: admin.ServiceAccount = serviceAccountJson as admin.ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      // Your JSON config file goes here
      // type: process.env.FIREBASE_TYPE,
      projectId: process.env.FIREBASE_PROJECT_ID,
      // private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // clientId: process.env.FIREBASE_CLIENT_ID,
      // auth_uri: process.env.FIREBASE_AUTH_URI,
      // token_uri: process.env.FIREBASE_TOKEN_URI,
      // auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      // client_x509_cert_url: process.env.FIREBASE_CERT_URL,
      // universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
    }),
  });
}
export { admin }

// const config = {
//   credential: admin.credential.cert({
//     // Your JSON config file goes here
//     type: process.env.FIREBASE_TYPE,
//     project_id: process.env.FIREBASE_PROJECT_ID,
//     private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
//     private_key: process.env.FIREBASE_PRIVATE_KEY,
//     client_email: process.env.FIREBASE_CLIENT_EMAIL,
//     client_id: process.env.FIREBASE_CLIENT_ID,
//     auth_uri: process.env.FIREBASE_AUTH_URI,
//     token_uri: process.env.FIREBASE_TOKEN_URI,
//     auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
//     client_x509_cert_url: process.env.FIREBASE_CERT_URL,
//     universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
//   }),
// };

// export const firebase = admin.apps.length
//   ? admin.app()
//   : admin.initializeApp(config);
// export { admin };
