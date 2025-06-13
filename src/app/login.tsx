import LoginForm from "@/components/forms/LoginForm";
import { Feather } from "@expo/vector-icons";
import { colorScheme } from "nativewind";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [showRegister, setShowRegister] = useState(false);

  const starImageSource =
    colorScheme.get() === "light"
      ? require("@/assets/Star-dark.png")
      : require("@/assets/Star.png");

  return (
    <SafeAreaProvider>
      <SafeAreaView className="relative flex-1 bg-neutral-200 dark:bg-neutral-900">
        <Image
          source={starImageSource}
          className="absolute top-0 left-0"
          resizeMode="repeat"
        />
        <View className="flex items-center justify-start w-full gap-4 pt-5 text-center h-80">
          {showRegister && (
            <View className="w-full px-10">
              <Feather
                name="arrow-left"
                size={24}
                color={colorScheme.get() === "light" ? "#171717" : "#e5e5e5"}
                onPress={() => setShowRegister(false)}
              />
            </View>
          )}

          <Text className="text-4xl font-bold text-center text-neutral-800 dark:text-white">
            {showRegister ? "Registre-se" : "Entre na sua\nconta"}
          </Text>

          <Text className="text-base text-neutral-600 dark:text-neutral-400">
            {showRegister
              ? "Preencha seus dados para criar uma conta"
              : "Digite seu e-mail e senha para fazer login"}
          </Text>
        </View>

        <LoginForm
          showRegister={showRegister}
          setShowRegister={setShowRegister}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
