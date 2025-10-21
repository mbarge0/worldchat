import { Slot } from "expo-router";
import { Text, View } from "react-native";
import LoginScreen from "../app/auth/login";
import { AuthProvider, useAuth } from "../app/contexts/AuthContext";
import "../config/firebase";

function LayoutInner() {
  const { user, loading } = useAuth();

  if (loading) return <View><Text>Loading...</Text></View>;
  if (!user) return <LoginScreen />;
  return <Slot />;
}

export default function RootLayout() {
  console.log("🧭 LayoutInner mounted");
  return (
    <AuthProvider>
      <LayoutInner />
    </AuthProvider>
  );
}