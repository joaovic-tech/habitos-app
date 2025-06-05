import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Header } from "@/components/Header";
import { Button } from "@/components/shared/Button";
import { habitsData } from "@/data/HabitsData";
import { router, Stack } from "expo-router";
import Constants from "expo-constants";

export default function SelectHabitScreen() {
  const statusBarHeight = Constants.statusBarHeight || 0;
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);

  const handleSelectHabit = (habitName: string) => {
    setSelectedHabit(habitName === selectedHabit ? null : habitName);
  };

  const handleContinue = () => {
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

  // Header acima da lista
  const ListHeader = () => (
    <View style={{ paddingTop: statusBarHeight }} className="px-6 pt-4">
      <Header backRouter={true} />
      <Text className="mt-8 mb-6 text-xl font-bold text-neutral-800 dark:text-white">
        Selecione seu hábito abaixo:
      </Text>
    </View>
  );

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
          ? "border-primary bg-blue-50 dark:bg-primary/20 border-collapse"
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
        <View className="absolute items-center justify-center w-6 h-6 ml-2 rounded-full bg-primary -top-2 right-10">
          <Feather name="check" size={16} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <FlatList
        className="w-full bg-neutral-200 dark:bg-neutral-900"
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
        ListHeaderComponent={ListHeader}
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
            label="Continuar"
            disabled={!selectedHabit}
            onPress={handleContinue}
            className={!selectedHabit ? "opacity-50" : "opacity-100"}
          />
        </View>
      )}
    </>
  );
}
