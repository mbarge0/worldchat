import { useLocalSearchParams, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { Button, Text, View } from "react-native";
import { auth } from "../../../config/firebase"; // <-- fixed path

export default function CanvasScreen() {
    const { canvasId } = useLocalSearchParams();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.replace("/auth/login");
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>🎨 Canvas {canvasId}</Text>
            <Button title="Log out" onPress={handleLogout} />
        </View>
    );
}