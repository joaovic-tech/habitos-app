import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Header } from "@/components/Header";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { router, useLocalSearchParams, Stack } from "expo-router";
import * as habitsStorage from "@/storage/habitsStorage";
import Constants from "expo-constants";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/styles/colors";

// Defini quantidade de alertas por dia
const DEFAULT_ALERTS_PER_DAY = [2, 4, 6];

export type HabitsDataProps = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description: string;
  alertsPerDay: number;
};

export default function HabitDetailsScreen() {
  const statusBarHeight = Constants.statusBarHeight || 0;

  // Get habit parameters from navigation
  const params = useLocalSearchParams<{
    id?: string;
    name: string;
    description: string;
    startTime?: string;
    endTime?: string;
    alertsPerDay?: string;
  }>();

  // Check if we're in edit mode based on presence of id
  const isEditMode = !!params.id;

  // State for input fields
  const [startTime, setStartTime] = useState(params.startTime || "08:00");
  const [endTime, setEndTime] = useState(params.endTime || "18:00");
  const [alertsPerDay, setAlertsPerDay] = useState(
    params.alertsPerDay ? parseInt(params.alertsPerDay) : 2
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate time format (24h format)
  const validateTimeFormat = (time: string) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  };

  // Handle alerts per day input change
  const handleAlertsChange = (value: number) => {
    setAlertsPerDay(value);
  };

  // Handle save habit
  const handleSaveHabit = async () => {
    // Validate inputs
    if (!validateTimeFormat(startTime)) {
      Alert.alert(
        "Erro",
        "Formato de horário inicial inválido. Use o formato 24h (ex: 08:00)"
      );
      return;
    }

    if (!validateTimeFormat(endTime)) {
      Alert.alert(
        "Erro",
        "Formato de horário final inválido. Use o formato 24h (ex: 18:00)"
      );
      return;
    }

    if (!alertsPerDay || alertsPerDay < 1) {
      Alert.alert("Erro", "Defina pelo menos 1 alerta por dia");
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEditMode && params.id) {
        // Get current habits to preserve original values
        const currentHabits = await habitsStorage.getAll();
        const existingHabit = currentHabits.find(habit => habit.id === params.id);
        
        if (existingHabit) {
          // Create updated habit object
          const updatedHabit: habitsStorage.Habit = {
            id: params.id,
            name: params.name,
            description: params.description,
            startTime,
            endTime,
            alertsPerDay: alertsPerDay,
            // Preserve original creation date and enabled state
            createdAt: existingHabit.createdAt,
            enabled: existingHabit.enabled,
          };

          // Update habit in storage
          await habitsStorage.update(updatedHabit);

          // Navigate back to home screen
          Alert.alert("Sucesso", "Hábito atualizado com sucesso!", [
            {
              text: "OK",
              onPress: () => router.push("/(tabs)"),
            },
          ]);
        }
      } else {
        // Create new habit object
        const newHabit: habitsStorage.Habit = {
          id: Date.now().toString(),
          name: params.name,
          description: params.description,
          startTime,
          endTime,
          alertsPerDay: alertsPerDay,
          createdAt: Date.now(),
          enabled: true,
        };

        // Add habit to storage
        await habitsStorage.add(newHabit);

        // Navigate back to home screen
        Alert.alert("Sucesso", "Hábito adicionado com sucesso!", [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)"),
        },
      ]);
      }
    } catch (error) {
      console.error("Error saving habit:", error);
      Alert.alert("Erro", "Ocorreu um erro ao salvar o hábito.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        style={{ paddingTop: statusBarHeight }}
        className="flex-1 bg-white dark:bg-gray-900"
      >
        <ScrollView className="flex-1">
          <View className="flex-1 px-6 py-4">
            {/* Header */}
            <Header title={isEditMode ? "Editar Hábito" : "Detalhes do Hábito"} backRouter={true} />

            {/* Habit Info */}
            <View className="mb-6">
              <Text className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {params.name}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400">
                {params.description}
              </Text>
            </View>

            {/* Time Inputs */}
            <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Defina os horários para os alertas:
            </Text>

            <View className="flex-row gap-4 mb-6">
              <View className="flex-1">
                <Input
                  label="Início"
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="08:00"
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                  icon="clock"
                  labelClasses="text-gray-700 dark:text-gray-300"
                />
              </View>

              <View className="flex-1">
                <Input
                  label="Fim"
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholder="18:00"
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                  icon="clock"
                  labelClasses="text-gray-700 dark:text-gray-300"
                />
              </View>
            </View>

            {/* Alerts Per Day */}
            <View className="flex-col gap-4">
              <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                Alertas por dia
              </Text>

              <View className="flex-row justify-center items-center gap-2 w-full px-8">
                {DEFAULT_ALERTS_PER_DAY.map((value) => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => handleAlertsChange(value)}
                    className={`flex-1 px-6 py-2 rounded-lg border dark:bg-gray-700 relative ${
                      alertsPerDay === value
                        ? "border-primary"
                        : "border-gray-600"
                    }`}
                  >
                    {alertsPerDay === value && (
                      <Feather
                        name="check"
                        size={35}
                        color={colors.primary}
                        className="absolute -top-6 -right-4"
                      />
                    )}
                    <Text
                      className={`text-center text-xl font-semibold ${
                        alertsPerDay === value
                          ? "text-white"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Add Button */}
        <View className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <Button
            label={isEditMode ? "Salvar Alterações" : "Adicionar Hábito"}
            onPress={handleSaveHabit}
            disabled={isSubmitting}
            className={isSubmitting ? "opacity-50" : "opacity-100"}
          />
        </View>
      </SafeAreaView>
    </>
  );
}
