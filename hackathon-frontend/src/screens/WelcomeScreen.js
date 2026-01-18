import { View, Text, TouchableOpacity } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0b0f14",
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      {/* Logo */}
      <View style={{ alignItems: "center", marginBottom: 70 }}>
        <View
          style={{
            backgroundColor: "#facc15",
            padding: 22,
            borderRadius: 20,
            marginBottom: 16,
          }}
        >
          {/* Emoji wrapped in Text */}
          <Text style={{ fontSize: 42 }}>🏗</Text>
        </View>

        <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>
          ConstructPro
        </Text>

        <Text style={{ color: "#9CA3AF", marginTop: 6, textAlign: "center" }}>
          Site Management Made Simple
        </Text>
      </View>

      {/* Get Started Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#F4B400",
          padding: 18,
          borderRadius: 14,
          marginBottom: 16,
        }}
        onPress={() => navigation.navigate("RoleSelection")} // Fixed screen name
      >
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
            color: "#0b0f14",
          }}
        >
          Get Started
        </Text>
      </TouchableOpacity>

      {/* Small descriptive subtitle */}
      <Text
        style={{
          textAlign: "center",
          color: "#6B7280",
          fontSize: 14,
          marginTop: 12,
        }}
      >
        Manage your construction site efficiently with roles and tasks.
      </Text>
    </View>
  );
}
