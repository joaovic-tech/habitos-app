import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams, Stack } from "expo-router";
import * as habitsStorage from "@/storage/habitsStorage";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { convertTime } from "@/utils/convertTime";
import { habitsData } from "@/data/HabitsData";
import { colors } from "@/styles/colors";
import { Header } from "@/components/Header";
import { Button } from "@/components/shared/Button";

const DEFAULT_ALERTS_PER_DAY = [1, 2, 3, 4, 5, 6];

const dateTimeStart = new Date().setHours(8, 0, 0, 0);
const dateTimeEnd = new Date().setHours(21, 0, 0, 0);

export default function HabitDetailsScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    alertsPerDay?: string;
  }>();

  const isEditMode = !!params.id;
  const [startTime, setStartTime] = useState(new Date(dateTimeStart));
  const [endTime, setEndTime] = useState(new Date(dateTimeEnd));
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [alertsPerDay, setAlertsPerDay] = useState(
    params.alertsPerDay ? parseInt(params.alertsPerDay) : 2
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showTimePicker = (time: string) => {
    time === "startTime"
      ? setShowStartTimePicker(true)
      : setShowEndTimePicker(true);
  };

  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startTime;
    setShowStartTimePicker(false);
    setStartTime(currentDate);
  };

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endTime;
    setShowEndTimePicker(false);
    setEndTime(currentDate);
  };

  const handleAlertsChange = (day: number) => {
    setAlertsPerDay(day);
  };

  const handleSaveHabit = async () => {
    if (!alertsPerDay || alertsPerDay < 1) {
      Alert.alert("Atenção", "Defina pelo menos 1 alerta por dia");
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEditMode && params.id) {
        const currentHabits = await habitsStorage.getAll();
        const existingHabit = currentHabits.find(
          (habit) => habit.id === params.id
        );

        if (existingHabit) {
          const updatedHabit: habitsStorage.Habit = {
            ...existingHabit,
            name: params.name,
            description: params.description,
            startTime: convertTime(startTime),
            endTime: convertTime(endTime),
            alertsPerDay: alertsPerDay,
          };

          await habitsStorage.update(updatedHabit);
          showSuccessAlert("Hábito atualizado com sucesso!");
        }
      } else {
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

        await habitsStorage.add(newHabit);
        showSuccessAlert("Hábito adicionado com sucesso!");
      }
    } catch (error) {
      console.error("Error saving habit:", error);
      Alert.alert("Erro", "Ocorreu um erro ao salvar o hábito.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSuccessAlert = (message: string) => {
    Alert.alert("Sucesso", message, [
      {
        text: "OK",
        onPress: () => router.push("/(tabs)"),
      },
    ]);
  };

  // Buscar o hábito selecionado para pegar o ícone
  const selectedHabit = habitsData.habitos.find(
    (habit) => habit.name === params.name
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white dark:bg-gray-900"
    >
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <Header
            title={isEditMode ? "Editar Hábito" : "Detalhes do Hábito"}
            backRouter={true}
          />

          {/* Habit Card */}
          <View className="p-6 mb-6 bg-blue-50 rounded-2xl dark:bg-gray-800">
            <View className="items-center mb-4">
              <Text className="text-xl font-bold text-center text-gray-900 dark:text-white">
                {params.name}
              </Text>
              <Text className="mt-1 text-center text-gray-600 dark:text-gray-300">
                ({params.description})
              </Text>
            </View>
          </View>

          {/* Time Selection */}
          <View className="mb-8">
            <Text className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Horário dos Lembretes
            </Text>

            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-3">
                <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Início
                </Text>
                <TouchableOpacity
                  onPress={() => showTimePicker("startTime")}
                  className="flex-row items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700"
                >
                  <Text className="text-base font-medium text-gray-900 dark:text-white">
                    {convertTime(startTime)}
                  </Text>
                  <Feather name="clock" size={20} color={colors.gray[600]} />
                </TouchableOpacity>
                {showStartTimePicker && (
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="spinner"
                    onChange={handleStartTimeChange}
                    is24Hour={true}
                  />
                )}
              </View>

              <View className="flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Término
                </Text>
                <TouchableOpacity
                  onPress={() => showTimePicker("endTime")}
                  className="flex-row items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700"
                >
                  <Text className="text-base font-medium text-gray-900 dark:text-white">
                    {convertTime(endTime)}
                  </Text>
                  <Feather name="clock" size={20} color={colors.gray[600]} />
                </TouchableOpacity>
                {showEndTimePicker && (
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="spinner"
                    onChange={handleEndTimeChange}
                    is24Hour={true}
                  />
                )}
              </View>
            </View>

            {/* Alerts per day */}
            <View className="mt-6">
              <Text className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Alertas por dia
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {DEFAULT_ALERTS_PER_DAY.map((count) => (
                  <TouchableOpacity
                    key={count}
                    onPress={() => handleAlertsChange(count)}
                    className={`items-center justify-center w-12 h-12 rounded-xl ${
                      alertsPerDay === count
                        ? "bg-primary"
                        : "bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    }`}
                  >
                    <Text
                      className={`text-base font-medium ${
                        alertsPerDay === count
                          ? "text-white"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {count}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Save Button */}
          <Button
            label={isSubmitting ? "Salvando..." : "Salvar Hábito"}
            onPress={handleSaveHabit}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
