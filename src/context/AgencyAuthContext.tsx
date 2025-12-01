"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { app, db } from "@/lib/firebase";

interface AgencyAuthContextType {
  user: any;
  agencyApproved: boolean | null;
}

const AgencyAuthContext = createContext<AgencyAuthContextType>({
  user: null,
  agencyApproved: null,
});
// export const AuthContext = React.createContext<{ user: User | null; logout: () => void }>({ user: null, logout: () => { } });

export const useAgencyAuthContext = () => React.useContext(AgencyAuthContext);
export function AgencyAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [agencyApproved, setAgencyApproved] = useState<boolean | null>(null);
  const auth = getAuth(app);
  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
         console.log("firebaseUser:",firebaseUser);
      if (firebaseUser) {
        setUser(firebaseUser);
        console.log("firebaseUser:",firebaseUser);
        // fetch approval from 'agencies' collection using UID
        const docRef = doc(db, "agencies", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAgencyApproved(data.approved ?? false);
        } else {
          setAgencyApproved(false);
        }
      } else {
        setUser(null);
        setAgencyApproved(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AgencyAuthContext.Provider value={{ user, agencyApproved }}>
      {children}
    </AgencyAuthContext.Provider>
  );
}

// export function useAgencyAuthContext() {
//   return useContext(AgencyAuthContext);
// }
