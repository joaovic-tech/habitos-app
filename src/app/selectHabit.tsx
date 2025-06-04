import React, { useState } from "react";
import { View, Text, FlatList, SafeAreaView } from "react-native";
import { Header } from "@/components/Header";
import { HabitItem } from "@/components/HabitItem";
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

  // Component to render above the list
  const ListHeader = () => (
    <View style={{ paddingTop: statusBarHeight }} className="px-6 pt-4">
      <Header backRouter={true} />
      <Text className="mt-8 mb-6 text-xl font-bold text-gray-800 dark:text-white">
        Selecione seu hábito abaixo:
      </Text>
    </View>
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
        className="w-full bg-gray-500 dark:bg-gray-900"
        data={habitsData.habitos}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <HabitItem
            name={item.name}
            description={item.description}
            selected={selectedHabit === item.name}
            onSelect={() => handleSelectHabit(item.name)}
          />
        )}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <View className="px-6 py-4 bg-gray-500 border-t-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <Button
          label="Continuar"
          disabled={!selectedHabit}
          onPress={handleContinue}
          className={!selectedHabit ? "opacity-50" : "opacity-100"}
        />
      </View>
    </>
  );
}
