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
import DateTimePicker from "@react-native-community/datetimepicker";
import { convertTime } from "@/utils/convertTime";
import { useTheme } from "@/hooks/useTheme";

// Defini quantidade de alertas por dia
const DEFAULT_ALERTS_PER_DAY = [2, 4, 6];

// definir horas
const dateTimeStart = new Date().setHours(8, 0, 0, 0);
const dateTimeEnd = new Date().setHours(21, 0, 0, 0);

export default function HabitDetailsScreen() {
  const isDarkMode = useTheme().colorScheme === "dark";
  const statusBarHeight = Constants.statusBarHeight || 0;

  // Get habit parameters from navigation
  const params = useLocalSearchParams<{
    id?: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    alertsPerDay?: string;
  }>();

  // Check if we're in edit mode based on presence of id
  const isEditMode = !!params.id;

  // State for input fields
  const [startTime, setStartTime] = useState(new Date(dateTimeStart));
  const [endTime, setEndTime] = useState(new Date(dateTimeEnd));
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);

  const [alertsPerDay, setAlertsPerDay] = useState(
    params.alertsPerDay ? parseInt(params.alertsPerDay) : 2
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show times
  const showTimePicker = (time: string) => {
    time === "startTime"
      ? setShowStartTimePicker(true)
      : setShowEndTimePicker(true);
  };

  // Handle end time change
  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    console.log("Selected end time:", selectedDate);
    const currentDate = selectedDate || startTime;
    setShowStartTimePicker(false);
    setStartTime(currentDate);
  };

  // Handle end time change
  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    console.log("Selected end time:", selectedDate);
    const currentDate = selectedDate || endTime;
    setShowEndTimePicker(false);
    setEndTime(currentDate);
  };

  // Handle alerts per day input change
  const handleAlertsChange = (day: number) => {
    setAlertsPerDay(day);
  };

  // Handle save habit
  const handleSaveHabit = async () => {
    if (!alertsPerDay || alertsPerDay < 1) {
      Alert.alert("Erro", "Defina pelo menos 1 alerta por dia");
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEditMode && params.id) {
        // Get current habits to preserve original values
        const currentHabits = await habitsStorage.getAll();
        const existingHabit = currentHabits.find(
          (habit) => habit.id === params.id
        );

        if (existingHabit) {
          // Create updated habit object
          const updatedHabit: habitsStorage.Habit = {
            id: params.id,
            name: params.name,
            description: params.description,
            startTime: convertTime(startTime),
            endTime: convertTime(endTime),
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
          startTime: convertTime(startTime),
          endTime: convertTime(endTime),
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
        className="flex-1 bg-gray-500 dark:bg-gray-900"
      >
        <ScrollView className="flex-1">
          <View className="flex-1 px-6 py-4">
            {/* Header */}
            <Header
              title={isEditMode ? "Editar Hábito" : "Detalhes do Hábito"}
              backRouter={true}
            />

            {/* Habit Info */}
            <View className="mb-6">
              <Text className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
                {params.name}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400">
                {params.description}
              </Text>
            </View>

            {/* Time Inputs */}
            <Text className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
              Defina os horários para os alertas:
            </Text>

            <View className="flex-row gap-4 mb-6">
              <View className="flex-1">
                <Text className="mb-2 text-lg text-gray-800 dark:text-white">
                  Início
                </Text>
                <TouchableOpacity
                  onPress={() => showTimePicker("startTime")}
                  className="flex-row items-center justify-between px-3 py-3 border border-gray-400 rounded-lg"
                >
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                    {convertTime(startTime)}
                  </Text>
                  <Feather
                    name="clock"
                    size={20}
                    color={colors.gray[600]}
                    className="mr-2"
                  />
                </TouchableOpacity>

                {showStartTimePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={startTime}
                    mode="time"
                    is24Hour={true}
                    onChange={handleStartTimeChange}
                  />
                )}
              </View>

              <View className="flex-1">
                <Text className="mb-2 text-lg text-gray-800 dark:text-white">
                  Fim
                </Text>
                <TouchableOpacity
                  onPress={() => showTimePicker("endTime")}
                  className="flex-row items-center justify-between px-3 py-3 border border-gray-400 rounded-lg"
                >
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                    {convertTime(endTime)}
                  </Text>
                  <Feather
                    name="clock"
                    size={20}
                    color={colors.gray[600]}
                    className="mr-2"
                  />
                </TouchableOpacity>
                {showEndTimePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={endTime}
                    mode="time"
                    is24Hour={true}
                    onChange={handleEndTimeChange}
                  />
                )}
              </View>
            </View>

            {/* Alerts Per Day */}
            <View className="flex-col gap-4">
              <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                Alertas por dia
              </Text>

              <View className="flex-row items-center justify-center w-full gap-2 px-8">
                {DEFAULT_ALERTS_PER_DAY.map((valueDay) => (
                  <TouchableOpacity
                    key={valueDay}
                    onPress={() => handleAlertsChange(valueDay)}
                    className={`flex-1 px-6 py-2 rounded-lg border relative transition  ${
                      alertsPerDay === valueDay
                        ? "border-primary dark:bg-gray-700 bg-gray-200"
                        : "border-gray-600"
                    }`}
                  >
                    {alertsPerDay === valueDay && (
                      <Feather
                        name="check"
                        size={35}
                        color={colors.primary}
                        className="absolute -top-6 -right-4"
                      />
                    )}
                    <Text
                      className={`text-center text-xl font-semibold ${
                        alertsPerDay === valueDay
                          ? "dark:text-white text-gray-900"
                          : "text-gray-600"
                      }`}
                    >
                      {valueDay}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Add Button */}
        <View className="px-6 py-4 bg-gray-500 border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
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
