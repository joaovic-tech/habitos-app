import React, { useState, useRef } from "react";
import { Text, FlatList, View, SafeAreaView, Animated } from "react-native";
import { HabitCard, type HabitItem } from "@/components/HabitCard";
import { Button } from "@/components/shared/Button";
import Constants from "expo-constants";
import { Header } from "@/components/Header";

export default function Tab() {
  const statusBarHeight = Constants.statusBarHeight || 0;
  const [newHabitId, setNewHabitId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const [habits, setHabits] = useState<HabitItem[]>([
    {
      id: "1",
      title: "Onicofagia",
      description: "roer unhas",
      time: "2h00min",
      enabled: true,
    },
    {
      id: "2",
      title: "Onicofagia",
      description: "roer unhas",
      time: "2h00min",
      enabled: true,
    },
    {
      id: "3",
      title: "Onicofagia",
      description: "roer unhas",
      time: "2h00min",
      enabled: true,
    },
    {
      id: "4",
      title: "Onicofagia",
      description: "roer unhas",
      time: "2h00min",
      enabled: true,
    },
    {
      id: "5",
      title: "Morder objetos",
      description: "tampas de caneta, lápis, etc",
      time: "30min",
      enabled: false,
    },
  ]);

  const handleAddHabit = () => {
    // Create a new habit with a unique ID
    const newId = Date.now().toString();
    const newHabit = {
      id: newId,
      title: "Novo hábito",
      description: "Descrição do hábito",
      time: "00:00",
      enabled: false,
    };

    // Add the new habit to the list
    setHabits([...habits, newHabit]);

    // Set the new habit ID to trigger animation
    setNewHabitId(newId);

    // Reset the new habit ID after animation (1 second)
    setTimeout(() => {
      setNewHabitId(null);
    }, 1000);

    // Scroll to the bottom after a short delay to see the new habit
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  const handleToggleHabit = (id: string) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, enabled: !habit.enabled } : habit
      )
    );
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: statusBarHeight }}
      className="px-6 bg-gray-200 dark:bg-gray-900"
    >
      <View>
        <Header />

        <Text className="text-secondary text-xl font-bold mb-2 mt-12">
          Meus alertas
        </Text>
        <FlatList
          ref={flatListRef}
          className={`${!habits.length ? "h-20 mb-20" : "h-[500px]"}`}
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitCard
              item={item}
              onToggle={handleToggleHabit}
              onDelete={handleDeleteHabit}
              isNew={item.id === newHabitId}
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-400 text-xl mb-2 mt-12">
                (Nenhum alerta encontrado)
              </Text>
            </View>
          }
        />

        <Button label="Adicionar +" onPress={handleAddHabit} />
      </View>
    </SafeAreaView>
  );
}
