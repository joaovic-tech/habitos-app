import { View, SafeAreaView, ActivityIndicator } from "react-native";
import { HabitsList } from "@/components/HabitsList";
import { Header } from "@/components/Header";
import { Button } from "@/components/shared/Button";
import { router, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { useCallback, useState } from "react";

export default function HomeScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigate to habit selection screen
  const handleAddHabit = () => {
    setIsSubmitting(true);
    router.push("/selectHabit");
  };

  // Reseta estados
  useFocusEffect(
    useCallback(() => {
      setIsSubmitting(false);
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-200 dark:bg-neutral-900">
      <View className="flex-1 px-6 pb-24">
        <Header
          title="Hábitos+"
          icon={<Feather name="list" size={20} color={colors.secondary} />}
        />

        <HabitsList />

        <Button
          label={
            !isSubmitting ? (
              "Adicionar Hábito"
            ) : (
              <ActivityIndicator size="small" color={colors.white} />
            )
          }
          onPress={handleAddHabit}
          variant="primary"
          disabled={isSubmitting}
          className={`${isSubmitting && "pointer-events-none opacity-50"}`}
        />
      </View>
    </SafeAreaView>
  );
}
