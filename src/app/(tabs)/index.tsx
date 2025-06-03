import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { HabitsList } from "@/components/HabitsList";
import { Header } from "@/components/Header";
import { Button } from "@/components/shared/Button";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import Constants from "expo-constants";

export default function HomeScreen() {
  const statusBarHeight = Constants.statusBarHeight || 0;

  // Navigate to habit selection screen
  const handleAddHabit = () => {
    router.push("/select-habit");
  };

  return (
    <SafeAreaView
      style={{ paddingTop: statusBarHeight }}
      className="flex-col h-screen-safe justify-start px-6 bg-gray-200 dark:bg-gray-900"
    >
      <Header
        title="Meus Hábitos"
        icon={<Feather name="list" size={20} color={colors.secondary} />}
      />

      <HabitsList />

      <Button
        label="Adicionar Novo Hábito"
        onPress={handleAddHabit}
        variant="primary"
      />
    </SafeAreaView>
  );
}
