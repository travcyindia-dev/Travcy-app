"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { app, db } from "@/lib/firebase";

interface AgencyAuthContextType {
  user: any;
  agencyApproved: boolean | null;
}

const AgencyAuthContext = createContext<AgencyAuthContextType>({
  user: null,
  agencyApproved: null,
});

export const useAgencyAuthContext = () => React.useContext(AgencyAuthContext);

export function AgencyAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [agencyApproved, setAgencyApproved] = useState<boolean | null>(null);
  const auth = getAuth(app);
  
  useEffect(() => {
    let unsubDoc: (() => void) | null = null;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("AgencyAuthContext firebaseUser:", firebaseUser);
      
      // Clean up previous document listener
      if (unsubDoc) {
        unsubDoc();
        unsubDoc = null;
      }
      
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Real-time listener for agency approval status
        const docRef = doc(db, "agencies", firebaseUser.uid);
        unsubDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("AgencyAuthContext - Agency data updated:", data);
            setAgencyApproved(data.approved ?? false);
          } else {
            setAgencyApproved(false);
          }
        });
      } else {
        setUser(null);
        setAgencyApproved(null);
      }
    });

    return () => {
      unsubscribe();
      if (unsubDoc) unsubDoc();
    };
  }, [auth]);

  return (
    <AgencyAuthContext.Provider value={{ user, agencyApproved }}>
      {children}
    </AgencyAuthContext.Provider>
  );
}
