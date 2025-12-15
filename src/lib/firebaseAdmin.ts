import admin from "firebase-admin";

if (!admin.apps.length) {
  // Join all chunks into one Base64 string
  const serviceAccountBase64 = [
    process.env.FIREBASE_CHUNK_1,
    process.env.FIREBASE_CHUNK_2,
    process.env.FIREBASE_CHUNK_3,
    process.env.FIREBASE_CHUNK_4,
    process.env.FIREBASE_CHUNK_5,
    process.env.FIREBASE_CHUNK_6,
    process.env.FIREBASE_CHUNK_7,
   // add more if you have more chunks
  ]
    .filter(Boolean) // ignore any undefined
    .join("");

  if (!serviceAccountBase64) throw new Error("Firebase service account Base64 not set!");

  const serviceAccount = JSON.parse(
    Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export { admin };
