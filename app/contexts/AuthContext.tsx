import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../config/firebase";

type AuthContextType = { user: User | null; loading: boolean };
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log("👤 Auth state changed:", firebaseUser ? "logged in" : "logged out");
            setUser(firebaseUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};