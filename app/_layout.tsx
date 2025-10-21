import { Slot } from "expo-router";
import { Text, View } from "react-native";
import "../config/firebase";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import LoginScreen from "./auth/login";

function LayoutInner() {
  const { user, loading } = useAuth();

  if (loading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Initializing...</Text>
    </View>
  );
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