"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { app, db } from "@/lib/firebase";

interface AgencyData {
  uid: string;
  name: string;
  email: string;
  location: string | null;
  logo: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  approved: boolean;
}

interface AgencyAuthContextType {
  user: any;
  agency: AgencyData | null;
  agencyApproved: boolean | null;
}

const AgencyAuthContext = createContext<AgencyAuthContextType>({
  user: null,
  agency: null,
  agencyApproved: null,
});

export const useAgencyAuthContext = () => React.useContext(AgencyAuthContext);

export function AgencyAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [agency, setAgency] = useState<AgencyData | null>(null);
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
            setAgency({
              uid: data.uid,
              name: data.name,
              email: data.email,
              location: data.location || null,
              logo: data.logo || null,
              phone: data.phone || null,
              website: data.website || null,
              description: data.description || null,
              approved: data.approved ?? false,
            });
            setAgencyApproved(data.approved ?? false);
          } else {
            setAgency(null);
            setAgencyApproved(false);
          }
        });
      } else {
        setUser(null);
        setAgency(null);
        setAgencyApproved(null);
      }
    });

    return () => {
      unsubscribe();
      if (unsubDoc) unsubDoc();
    };
  }, [auth]);

  return (
    <AgencyAuthContext.Provider value={{ user, agency, agencyApproved }}>
      {children}
    </AgencyAuthContext.Provider>
  );
}
