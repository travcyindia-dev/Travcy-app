import { admin } from "@/lib/firebaseAdmin";

async function setUserRole(uid:any, role:any) {
  await admin.auth().setCustomUserClaims(uid, { role });
  console.log(`Role ${role} assigned to user ${uid}`);
}