import { HabitsList } from "@/components/HabitsList";
import { Header } from "@/components/Header";
import { Button } from "@/components/shared/Button";
import { colors } from "@/styles/colors";
import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { colorScheme } from "nativewind";
import { Plus, PlusCircle, PlusSquare } from "phosphor-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigate to habit selection screen
  const handleAddHabit = () => {
    setIsSubmitting(true);
    router.push("/selectHabit");
  };

  // Reset estados
  useFocusEffect(
    useCallback(() => {
      setIsSubmitting(false);
    }, [])
  );

  const isDarkMode = colorScheme.get() === "dark";

  const starImageSource =
    colorScheme.get() === "dark"
      ? require("@/assets/Star.png")
      : require("@/assets/Star-dark.png");

  return (
    <SafeAreaProvider>
      <SafeAreaView className="px-6 h-screen-safe-offset-10 pt-safe bg-neutral-200 dark:bg-neutral-900">
        <Image
          source={starImageSource}
          className="absolute top-0 left-0 w-full h-[350px] opacity-30 dark:opacity-20 -z-10"
          resizeMode="contain"
        />
        <Header title="Hábitos" />

        <TouchableOpacity
          onPress={handleAddHabit}
          disabled={isSubmitting}
          className={`${
            isSubmitting && "pointer-events-none opacity-50"
          } ml-auto mb-2`}
        >
          <PlusCircle
            size={33}
            color={isDarkMode ? colors.white : colors.black}
            weight="duotone"
          />
        </TouchableOpacity>

        <HabitsList />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
