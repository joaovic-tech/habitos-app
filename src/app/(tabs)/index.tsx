import { HabitsList } from "@/components/HabitsList";
import { Header } from "@/components/Header";
import { Button } from "@/components/shared/Button";
import { colors } from "@/styles/colors";
import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { PlusCircle } from "phosphor-react-native";
import { useCallback, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
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

  return (
    <SafeAreaProvider>
      <SafeAreaView className="px-6 h-screen-safe-offset-10 bg-neutral-200 dark:bg-neutral-900">
        <Header title="Hábitos+" />

        <TouchableOpacity
          onPress={handleAddHabit}
          disabled={isSubmitting}
          className={`${
            isSubmitting && "pointer-events-none opacity-50"
          } ml-auto mb-4`}
        >
          <PlusCircle size={48} color={colors.secondary} weight="duotone" />
        </TouchableOpacity>

        <HabitsList />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
