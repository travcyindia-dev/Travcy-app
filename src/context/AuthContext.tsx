"use client";
import React from "react";
import { onAuthStateChanged, getAuth, User, signOut } from "firebase/auth";
import { app } from "@/lib/firebase";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { toastError, toastSuccess } from "@/components/ui/ToastTypes";
import { error } from "console";
import { useBookingStore } from "@/store/bookingStore";
import { usePackageStore } from "@/store/packageStore";

const auth = getAuth(app);

export const AuthContext = React.createContext<{ user: User | null; logout: () => void }>({ user: null, logout: () => { } });

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);
    const logout = () => {
        signOut(auth).then(
            () => {
                toastSuccess("Sign out successful")
            }
        ).catch((error) => {
            toastError(error)
        });
        localStorage.removeItem('token');
        localStorage.clear();
        sessionStorage.clear();
        useBookingStore.getState().reset();
        usePackageStore.getState().reset();
        redirect('/')
    }

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            const tokenId = localStorage.getItem("token");

            if (firebaseUser) {
                // User is truly logged in
                setUser(firebaseUser);

            } else {
                // Token missing OR firebaseUser is null → force logout
                if (firebaseUser) {
                    setUser(null);
                    localStorage.removeItem("token");
                }
                // setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};
