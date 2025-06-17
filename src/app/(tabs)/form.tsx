import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/shared/Header";
import { Button } from "@/components/shared/Button";
import { Progress } from "@/components/Progress"; // Assuming Progress.tsx is in @/components
import * as habitsStorage from "@/storage/habitsStorage";
import { colors } from "@/styles/colors";
import { useTheme } from "@/hooks/useTheme";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";

// Intensity levels for the progress bar
const intensityLevels = [
  { label: "Baixa", value: 15 },
  { label: "Média", value: 50 },
  { label: "Alta", value: 100 },
];

export default function FeedbackFormScreen() {
  const { colorScheme, loading: themeLoading } = useTheme();
  const [userHabits, setUserHabits] = useState<habitsStorage.Habit[]>([]);
  const [loadingHabits, setLoadingHabits] = useState(true);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(0); // Default to 0, user can select
  const [message, setMessage] = useState("");

  const loadHabits = useCallback(async () => {
    try {
      setLoadingHabits(true);
      const habits = await habitsStorage.getAll();
      setUserHabits(habits);
    } catch (error) {
      console.error("Error loading habits for form:", error);
    } finally {
      setLoadingHabits(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHabits();
      // Reset form fields on focus
      setSelectedHabitId(null);
      setIntensity(0);
      setMessage("");
    }, [loadHabits])
  );

  const handleIntensitySelect = (value: number) => {
    setIntensity(value === intensity ? 0 : value);
  };

  const handleHabitSelect = (habitId: string) => {
    setSelectedHabitId(habitId === selectedHabitId ? null : habitId);
  };

  const handleSubmit = () => {
    console.log("Mensagem enviada:", {
      habitId: selectedHabitId,
      intensity,
      message,
    });
  };

  const starImageSource =
    colorScheme === "dark"
      ? require("@/assets/Star.png")
      : require("@/assets/Star-dark.png");

  if (themeLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-neutral-200 dark:bg-neutral-900">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderHabitSelectItem = ({ item }: { item: habitsStorage.Habit }) => (
    <TouchableOpacity
      onPress={() => handleHabitSelect(item.id)}
      className={`p-3 my-1 rounded-lg border ${
        selectedHabitId === item.id
          ? "bg-blue-100 dark:bg-blue-600/30 border-blue-600"
          : "bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
      }`}
    >
      <Text
        className={`font-dosis-semibold ${
          selectedHabitId === item.id
            ? "text-blue-700 dark:text-blue-300"
            : "text-neutral-800 dark:text-neutral-200"
        }`}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-neutral-200 dark:bg-neutral-900">
        <Image
          source={starImageSource}
          className="absolute top-0 right-0 w-screen h-screen"
          resizeMode="stretch"
        />
        <Header title="Registrar Progresso" />
        <View className="flex-1 px-6 pt-4">
          <View className="gap-6">
            {/* Habit Selection Section */}
            <View>
              <Text className="mb-2 text-lg font-dosis-semibold text-neutral-800 dark:text-white">
                Qual hábito você praticou?{" "}
                <Text className="text-sm font-dosis-regular text-neutral-500 dark:text-neutral-400">
                  (Opcional)
                </Text>
              </Text>
              {loadingHabits ? (
                <ActivityIndicator color={colors.primary} className="my-4" />
              ) : userHabits.length > 0 ? (
                <FlatList
                  data={userHabits}
                  renderItem={renderHabitSelectItem}
                  keyExtractor={(item) => item.id}
                  className="p-1 border rounded-lg max-h-48 bg-white/50 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-700" // Added a background and border for the list container
                  nestedScrollEnabled
                />
              ) : (
                <Text className="p-3 text-center rounded-lg font-dosis-regular bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  Nenhum hábito cadastrado.
                </Text>
              )}
            </View>

            {/* Intensity Section */}
            <View>
              <Text className="mb-2 text-lg font-dosis-semibold text-neutral-800 dark:text-white">
                Qual foi a intensidade?{" "}
                <Text className="text-sm font-dosis-regular text-neutral-500 dark:text-neutral-400">
                  (Opcional)
                </Text>
              </Text>
              <Progress
                value={intensity}
                classNameIntensity={`${
                  intensity === 15
                    ? "bg-yellow-500"
                    : intensity === 50
                    ? "bg-orange-500"
                    : intensity === 100
                    ? "bg-red-500"
                    : ""
                }`}
              />

              <View className="flex-row justify-between mt-2">
                {intensityLevels.map((level) => (
                  <TouchableOpacity
                    key={level.label}
                    onPress={() => handleIntensitySelect(level.value)}
                    className={`px-3 py-2 rounded-md border ${
                      intensity === level.value
                        ? "bg-blue-600 border-blue-600"
                        : "bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
                    }`}
                  >
                    <Text
                      className={`font-dosis-medium text-sm ${
                        intensity === level.value
                          ? "text-white"
                          : "text-neutral-700 dark:text-neutral-200"
                      }`}
                    >
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Message Input Section */}
            <View>
              <Text className="mb-2 text-lg font-dosis-semibold text-neutral-800 dark:text-white">
                Deixe aqui sua mensagem
              </Text>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Como você se sentiu? Alguma observação?"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={
                  colorScheme === "dark" ? colors.white : colors.gray
                }
                className="p-3 text-base bg-white border rounded-lg h-36 font-dosis-regular dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </View>

            {/* Submit Button */}
            <Button
              label="Enviar"
              onPress={handleSubmit}
              variant="primary"
              className="mt-4 bg-blue-600"
            />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
