import { auth } from "@/lib/firebase";
import { getAuth } from "firebase/auth";

export async function checkUserRole() {
  const user = auth.currentUser;
  if (!user) return;

  // Force refresh token to get latest custom claims
  const tokenResult = await user.getIdTokenResult(true);

  console.log("Custom Claims:", tokenResult.claims);

  if (tokenResult.claims.role) {
    const role=tokenResult.claims.role
    console.log("User role is:", role);
    return {role};
  } else {

    console.log("No role assigned");
    return (null);
  }
}