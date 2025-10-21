import { onAuthStateChanged, signOut, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase"; // adjust if needed

type AuthContextType = {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // ✅ TEMP FIX — forces logout so you can see the login screen again.
    // Remove or comment this out once verified.
    useEffect(() => {
        signOut(auth).catch(() => { });
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log(
                "👤 Auth state changed:",
                firebaseUser ? "logged in" : "logged out"
            );
            setUser(firebaseUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            console.log("🚪 User signed out");
        } catch (error) {
            console.error("❌ Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};