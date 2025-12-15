import admin from "firebase-admin";
import serviceAccountJson from "@/firebase-upload/serviceAccountKey.json"; // rename import

const serviceAccount: admin.ServiceAccount = serviceAccountJson as admin.ServiceAccount;

if(!admin.apps.length){
  admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
}
export {admin}