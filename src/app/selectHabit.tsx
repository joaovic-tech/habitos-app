import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Header } from "@/components/Header";
import { Button } from "@/components/shared/Button";
import { habitsData } from "@/data/HabitsData";
import { router, Stack, useFocusEffect } from "expo-router";
import { colors } from "@/styles/colors";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colorScheme } from "nativewind";
import StackScreen from "@/components/StackScreen";

export default function SelectHabitScreen() {
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSelectHabit = (habitName: string) => {
    setSelectedHabit(habitName === selectedHabit ? null : habitName);
  };

  // Reseta isDisabled para false toda vez que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      setIsDisabled(false);
    }, [])
  );

  const handleContinue = () => {
    setIsDisabled(true);
    if (selectedHabit) {
      const habitDetails = habitsData.habitos.find(
        (habit) => habit.name === selectedHabit
      );
      if (habitDetails) {
        router.push({
          pathname: "/habitDetails",
          params: {
            name: habitDetails.name,
            description: habitDetails.description,
          },
        });
      }
    }
  };

  // Card do hábito com ícone e estilização
  const HabitCard = ({
    name,
    description,
    selected,
    onSelect,
  }: {
    name: string;
    description: string;
    selected: boolean;
    onSelect: () => void;
  }) => (
    <TouchableOpacity
      onPress={onSelect}
      className={`px-2 flex-1 m-4 flex-col justify-center items-center p-4 rounded-2xl border shadow-md ${
        selected
          ? "border-blue-600 bg-blue-50 dark:bg-blue-600/20 border-collapse"
          : "dark:border-neutral-700 border-neutral-200 bg-white dark:bg-neutral-800"
      }`}
    >
      <Text
        className={`text-base font-semibold ${
          selected
            ? "text-blue-700 dark:text-blue-300"
            : "text-neutral-900 dark:text-white"
        }`}
      >
        {name}
      </Text>
      <Text
        className={`text-xs ${
          selected
            ? "text-blue-600/80 dark:text-blue-200/80"
            : "text-neutral-600"
        }`}
      >
        {description}
      </Text>
      {selected && (
        <View className="absolute items-center justify-center w-6 h-6 ml-2 bg-blue-600 rounded-full -top-2 right-10">
          <Feather name="check" size={16} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-neutral-200 dark:bg-neutral-900">
        <StackScreen title="Selecionar Hábito" />

        <FlatList
          className="w-full px-6 bg-neutral-200 dark:bg-neutral-900"
          data={habitsData.habitos}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <HabitCard
              name={item.name}
              description={item.description}
              selected={selectedHabit === item.name}
              onSelect={() => handleSelectHabit(item.name)}
            />
          )}
          numColumns={2}
          contentContainerStyle={{
            paddingBottom: 24,
            paddingTop: 8,
            paddingHorizontal: 4,
          }}
          showsVerticalScrollIndicator={false}
        />
        {selectedHabit && (
          <View className="px-6 py-4 bg-white border-t border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700">
            <Button
              disabled={isDisabled}
              className={`${isDisabled && "pointer-events-none opacity-50"}`}
              label={
                !isDisabled ? (
                  "Adicionar Hábito"
                ) : (
                  <ActivityIndicator size="small" color={colors.white} />
                )
              }
              onPress={handleContinue}
            />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
