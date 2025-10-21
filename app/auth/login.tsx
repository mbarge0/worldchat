import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Button, Text, TextInput, View } from "react-native";
import { auth } from "../../config/firebase";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async () => {
        setSubmitting(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            // Navigate to a placeholder protected route after successful login
            router.replace("/c/123");
        } catch (err: any) {
            const code = err?.code || "auth/unknown";
            const message =
                code === "auth/invalid-credential" || code === "auth/wrong-password"
                    ? "Incorrect email or password."
                    : code === "auth/user-not-found"
                        ? "No account found for that email."
                        : code === "auth/too-many-requests"
                            ? "Too many attempts. Try again later."
                            : err?.message || "Login failed. Please try again.";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Login to WorldChat</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="username"
                style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 10, padding: 12 }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                textContentType="password"
                style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 10, padding: 12 }}
            />
            <Button title={submitting ? "Signing in..." : "Sign in"} onPress={handleLogin} disabled={submitting} />
            {submitting ? <ActivityIndicator style={{ marginTop: 12 }} /> : null}
            {error ? <Text style={{ color: "#b00020", marginTop: 10 }}>{error}</Text> : null}
        </View>
    );
}