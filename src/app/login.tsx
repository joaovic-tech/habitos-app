import LoginForm from "@/components/forms/LoginForm";
import { colors } from "@/styles/colors";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import Constants from "expo-constants";

export default function Login() {
  const [showRegister, setShowRegister] = useState(false);
  const statusBarHeight = Constants.statusBarHeight || 0;

  return (
    <View className="flex-1 bg-neutral-200 dark:bg-neutral-900">
      {/* Top */}
      <View
        style={{ paddingTop: statusBarHeight }}
        className="flex items-center justify-start w-full gap-4 pt-5 text-center h-80 bg-blue-600"
      >
        <Image source={require("@/assets/Star.png")} className="absolute" />

        {showRegister && (
          <View className="w-full px-10">
            <Feather
              name="arrow-left"
              size={24}
              color={"#FFFAFF"}
              onPress={() => setShowRegister(false)}
            />
          </View>
        )}

        <Text className="text-4xl font-bold text-center text-white">
          {showRegister ? "Registre-se" : "Entre na sua\nconta"}
        </Text>

        <Text className="text-base text-white">
          {showRegister
            ? "Preencha seus dados para criar uma conta"
            : "Digite seu e-mail e senha para fazer login"}
        </Text>
      </View>

      <LoginForm
        showRegister={showRegister}
        setShowRegister={setShowRegister}
      />
    </View>
  );
}
