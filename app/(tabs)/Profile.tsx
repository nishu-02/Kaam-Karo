import { Text, View, TouchableOpacity, Image, Animated } from "react-native";
import { useAppSelector } from "@/hooks/useAppSelector";
import { themes } from "@/hooks/themeSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Box from "@/components/Box";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect, useRef } from "react";

export default function Profile() {
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const themeColors = themes[currentTheme] || themes.default;
  const router = useRouter();

  const [profileImage, setProfileImage] = useState(null);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 3,
    }).start();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: themeColors.background,
        padding: 20,
        alignItems: "center",
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        }}
      >
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={profileImage ? { uri: profileImage } : require("@/assets/avatar.png")}
            style={{
              height: 150,
              width: 150,
              borderRadius: 1000,
              backgroundColor: "teal",
            }}
          />
          <Ionicons
            name="camera-outline"
            size={28}
            color="white"
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: 5,
              borderRadius: 20,
            }}
          />
        </TouchableOpacity>
      </Animated.View>

      <View
        style={{
          marginTop: 30,
          width: "90%",
          backgroundColor: themeColors.card,
          padding: 20,
          borderRadius: 12,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }}
      >
        <Box name="Nishant Garg" />
        <Box name="Connect with us" />
        <Box name="FAQ" />

        <TouchableOpacity
          style={{
            marginTop: 20,
            backgroundColor: themeColors.primary,
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
          onPress={() => router.push("/Themes")}
        >
          <Ionicons name="color-palette-outline" size={20} color="white" />
          <Text style={{ color: "white", fontSize: 16, marginLeft: 8 }}>
            Change Theme
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
