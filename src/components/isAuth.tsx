"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";


export default function isAuth(Component: any) {

    
  return function IsAuth(props: any) {
    const {user}=useAuthContext();
    const auth = user;
    console.log("user:",user);
    useEffect(() => {
      if (!auth) {
        return redirect("/landing");
      }
    }, []);


    if (!auth) {
      return null;
    }

    return <Component {...props} />;
  };
}