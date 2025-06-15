import { Header } from "@/components/shared/Header";
import { colors } from "@/styles/colors";
import { Stack } from "expo-router";
import { colorScheme } from "nativewind";
import { Image } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Tab() {
  const starImageSource =
    colorScheme.get() === "dark"
      ? require("@/assets/Star.png")
      : require("@/assets/Star-dark.png");

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 px-6 pt-safe bg-neutral-200 dark:bg-neutral-900">
        <Image
          source={starImageSource}
          className="absolute top-0 right-0 w-screen h-screen"
          resizeMode="stretch"
        />
        <Header title="Formulário" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
