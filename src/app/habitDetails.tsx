import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams, Stack } from "expo-router";
import * as habitsStorage from "@/storage/habitsStorage";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { convertTime } from "@/utils/convertTime";
import { Header } from "@/components/Header";
import { Button } from "@/components/shared/Button";
import { useToast } from "@/components/shared/Toast";
import { Trash } from "phosphor-react-native";
import Constants from "expo-constants";

const DEFAULT_ALERTS_PER_DAY = [1, 2, 3, 4, 5, 6];

const dateTimeStart = new Date().setHours(8, 0, 0, 0);
const dateTimeEnd = new Date().setHours(21, 0, 0, 0);

export default function HabitDetailsScreen() {
  const statusBarHeight = Constants.statusBarHeight || 0;
  const params = useLocalSearchParams<{
    id?: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    alertsPerDay?: string;
  }>();
  const { toast } = useToast();

  const isEditMode = !!params.id;
  const [startTime, setStartTime] = useState(new Date(dateTimeStart));
  const [endTime, setEndTime] = useState(new Date(dateTimeEnd));
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [alertsPerDay, setAlertsPerDay] = useState(
    params.alertsPerDay ? parseInt(params.alertsPerDay) : 2
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setIsSubmitting(true);
    if (!alertsPerDay || alertsPerDay < 1) {
      toast("Defina pelo menos 1 alerta por dia", "destructive");
      return;
    }

    // Verificação: horário de término deve ser maior que o de início
    if (endTime <= startTime) {
      toast(
        "O horário de término deve ser maior que o de início.",
        "destructive"
      );
      return;
    }

    try {
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

          try {
            await habitsStorage.update(updatedHabit);
            toast("Hábito atualizado com sucesso!", "success");
            setTimeout(() => {
              router.push("/(tabs)");
            }, 1500);
            return;
          } catch (error) {
            console.error("Error updating habit:", error);
            toast("Ocorreu um erro ao atualizar o hábito.", "destructive");
          }
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
        toast("Hábito adicionado com sucesso!", "success");
        setTimeout(() => {
          router.push("/(tabs)");
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving habit:", error);
      toast("Ocorreu um erro ao salvar o hábito.", "destructive");
    }
  };

  const showSuccessToast = (message: string) => {
    toast(message, "success");
    setTimeout(() => {
      router.push("/(tabs)");
    }, 1500);
  };

  const handleRemoveHabit = async (id: string) => {
    setIsDeleting(true);
    try {
      await habitsStorage.remove(id);
      showSuccessToast("Hábito removido com sucesso!");
      return;
    } catch (error) {
      console.error("Error removing habit:", error);
      toast("Ocorreu um erro ao remover o hábito.", "destructive");
    }
  };

  return (
    <View
      style={{ paddingTop: statusBarHeight }}
      className="flex-1 bg-neutral-200 dark:bg-neutral-900"
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
          <View className="p-6 mb-6 border-2 border-blue-900 border-dotted bg-blue-50 rounded-2xl dark:bg-blue-900/30">
            <View className="items-center mb-4">
              <Text className="text-xl font-bold text-center text-neutral-900 dark:text-white">
                {params.name}
              </Text>
              <Text className="mt-1 text-center text-neutral-600 dark:text-neutral-300">
                ({params.description})
              </Text>
            </View>
          </View>

          {/* Time Selection */}
          <View className="mb-8">
            <Text className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
              Horário dos Lembretes
            </Text>

            <View className="flex-row justify-between mb-4">
              <View className="flex-1 mr-3">
                <Text className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Início
                </Text>
                <TouchableOpacity
                  onPress={() => showTimePicker("startTime")}
                  className="flex-row items-center justify-between px-4 py-3 bg-white border border-neutral-200 rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
                >
                  <Text className="text-base font-medium text-neutral-900 dark:text-white">
                    {convertTime(startTime)}
                  </Text>
                  <Feather name="clock" size={20} color={"#6D6E71"} />
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
                <Text className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Término
                </Text>
                <TouchableOpacity
                  onPress={() => showTimePicker("endTime")}
                  className="flex-row items-center justify-between px-4 py-3 bg-white border border-neutral-200 rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
                >
                  <Text className="text-base font-medium text-neutral-900 dark:text-white">
                    {convertTime(endTime)}
                  </Text>
                  <Feather name="clock" size={20} color={"#6D6E71"} />
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
              <Text className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Alertas por dia
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {DEFAULT_ALERTS_PER_DAY.map((count) => (
                  <TouchableOpacity
                    key={count}
                    onPress={() => handleAlertsChange(count)}
                    className={`items-center justify-center w-12 h-12 rounded-xl ${
                      alertsPerDay === count
                        ? "bg-blue-600"
                        : "bg-white border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700"
                    }`}
                  >
                    <Text
                      className={`text-base font-medium ${
                        alertsPerDay === count
                          ? "text-white"
                          : "text-neutral-900 dark:text-white"
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
            className={`${isSubmitting && "pointer-events-none opacity-50"}`}
          />

          {/* Delete button */}

          {isEditMode && (
            <Button
              label="Excluir Hábito"
              variant="destructive"
              icon={<Trash size={24} weight="bold" color="white" />}
              onPress={() => handleRemoveHabit(params.id!)}
              disabled={isDeleting}
              className={`${isDeleting && "pointer-events-none opacity-50"}`}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
