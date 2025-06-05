import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { HabitsList } from "@/components/HabitsList";
import { Header } from "@/components/Header";
import { Button } from "@/components/shared/Button";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/styles/colors";

export default function HomeScreen() {
  // Navigate to habit selection screen
  const handleAddHabit = () => {
    router.push("/selectHabit");
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-200 dark:bg-neutral-900">
      <View className="flex-1 px-6 pb-24">
        <Header
          title="Hábitos+"
          icon={<Feather name="list" size={20} color={colors.secondary} />}
        />

        <HabitsList />

        <Button
          label="Adicionar Novo Hábito"
          onPress={handleAddHabit}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
}
