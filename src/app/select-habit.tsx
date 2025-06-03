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
          pathname: "/habit-details",
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
    <View className="px-6 pt-4">
      <Header backRouter={true} />
      <Text className="text-xl font-bold text-gray-800 dark:text-white mt-8 mb-6">
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
      <SafeAreaView
        style={{ paddingTop: statusBarHeight - 20 }}
        className="flex-1 bg-white dark:bg-gray-900"
      >
        <FlatList
          data={habitsData.habitos}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View className="w-2/4 items-center py-1">
              <HabitItem
                name={item.name}
                description={item.description}
                selected={selectedHabit === item.name}
                onSelect={() => handleSelectHabit(item.name)}
              />
            </View>
          )}
          numColumns={2}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={{ paddingBottom: 24 }}
        />

        {/* Continue Button - remains fixed at the bottom */}
        <View className="px-6 py-4 bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700">
          <Button
            label="Continuar"
            disabled={!selectedHabit}
            onPress={handleContinue}
            className={!selectedHabit ? "opacity-50" : "opacity-100"}
          />
        </View>
      </SafeAreaView>
    </>
  );
}
