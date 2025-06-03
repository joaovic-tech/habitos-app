import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as habitsStorage from "@/storage/habitsStorage";
import { CustomSwitch } from "@/components/CustomSwitch";
import { colors } from "@/styles/colors";
import { router } from "expo-router";
import { HabitsDataProps } from "@/app/habit-details";

type HabitsListProps = {
  onHabitsChange?: (habits: habitsStorage.Habit[]) => void;
  listEmptyComponent?: React.ReactElement;
};

export function HabitsList({
  onHabitsChange,
  listEmptyComponent,
}: HabitsListProps) {
  const [habits, setHabits] = useState<habitsStorage.Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  // Utility function to sort habits by startTime
  const sortHabits = useCallback((habitsToSort: habitsStorage.Habit[]) => {
    return [...habitsToSort].sort((a, b) => {
      // Convert time (HH:MM) to minutes for comparison
      const getMinutesSinceMidnight = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const aTime = getMinutesSinceMidnight(a.startTime);
      const bTime = getMinutesSinceMidnight(b.startTime);
      
      return aTime - bTime; // Sort in ascending order
    });
  }, []);

  // Load habits from storage
  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      const storedHabits = await habitsStorage.getAll();
      
      // Sort habits by startTime using the utility function
      const sortedHabits = sortHabits(storedHabits);
      
      setHabits(sortedHabits);
    } catch (error) {
      console.error("Error loading habits:", error);
    } finally {
      setLoading(false);
    }
  }, [sortHabits]);

  // Initialize on mount
  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  // Notify parent component when habits change
  useEffect(() => {
    if (onHabitsChange && !loading) {
      onHabitsChange(habits);
    }
  }, [habits, loading, onHabitsChange]);

  // Handle habit deletion
  const confirmDeleteHabit = useCallback((id: string, name: string) => {
    Alert.alert(
      "Excluir hábito",
      `Tem certeza que deseja excluir o hábito "${name}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deleteHabit(id),
        },
      ]
    );
  }, []);

  const deleteHabit = useCallback(async (id: string) => {
    try {
      // Add to deleting state to prevent interaction
      setDeletingIds((prev) => [...prev, id]);

      const updatedHabits = await habitsStorage.remove(id);
      // Ensure habits remain sorted
      setHabits(sortHabits(updatedHabits));
      setDeletingIds((prev) => prev.filter((itemId) => itemId !== id));
    } catch (error) {
      console.error("Error deleting habit:", error);
      setDeletingIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  }, [sortHabits]);

  // Handle habit toggle (enable/disable)
  const toggleHabit = useCallback(
    async (id: string) => {
      try {
        // Find the habit to toggle
        const habitToToggle = habits.find((habit) => habit.id === id);

        if (habitToToggle) {
          // Create updated habit with toggled enabled state
          const updatedHabit = {
            ...habitToToggle,
            enabled: !habitToToggle.enabled,
          };

          // Update in storage
          const updatedHabits = await habitsStorage.update(updatedHabit);
          // Ensure habits remain sorted after toggle
          setHabits(sortHabits(updatedHabits));
        }
      } catch (error) {
        console.error("Error toggling habit:", error);
      }
    },
    [habits, sortHabits]
  );

  // Edita o conteudo do habito
  const editHabit = (habitsData: HabitsDataProps) => {
    router.push({
      pathname: "/habit-details",
      params: {
        id: habitsData.id,
        name: habitsData.name,
        description: habitsData.description,
        startTime: habitsData.startTime,
        endTime: habitsData.endTime,
        alertsPerDay: habitsData.alertsPerDay.toString(),
      },
    });
  };

  // Render an individual habit item
  const renderHabitItem = useCallback(
    ({ item }: { item: habitsStorage.Habit }) => {
      // Skip rendering if item is being deleted
      if (deletingIds.includes(item.id)) {
        return null;
      }

      return (
        <TouchableOpacity
          onPress={() => editHabit(item)}
          className={`p-4 rounded-lg bg-gray-800 ${
            !item.enabled && "opacity-50"
          }`}
        >
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-gray-800 dark:text-white">
              {item.name}
            </Text>
            <View className="flex-row items-center">
              <Feather
                name="clock"
                size={14}
                color={colors.primary}
                style={{ marginRight: 4 }}
              />
              <Text className="text-xs text-primary font-medium">
                {item.startTime} - {item.endTime}
              </Text>
            </View>
          </View>

          <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-2">
            {item.description}
          </Text>

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center bg-gray-900 p-2 rounded">
              <Feather
                name="bell"
                size={14}
                color={colors.gray[500]}
                style={{ marginRight: 4 }}
              />
              <Text className="text-sm text-gray-500">
                {item.alertsPerDay} aletas por dia
              </Text>
            </View>

            <View className="flex-row items-center gap-4">
              <CustomSwitch
                value={item.enabled}
                onValueChange={(newValue) => toggleHabit(item.id)}
                disabled={deletingIds.includes(item.id)}
              />

              <TouchableOpacity
                className="w-10 h-10 bg-red-600 rounded-full justify-center items-center"
                onPress={() => confirmDeleteHabit(item.id, item.name)}
                disabled={deletingIds.includes(item.id)}
                accessibilityLabel="Excluir hábito"
                accessibilityHint="Remove este hábito da sua lista"
              >
                <Feather name="trash-2" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [deleteHabit, toggleHabit, confirmDeleteHabit, deletingIds]
  );

  // Render loading state
  if (loading) {
    return (
      <View className="justify-center items-center p-4">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-gray-600 dark:text-gray-400 mt-4">
          Carregando hábitos...
        </Text>
      </View>
    );
  }

  return (
    <View className="h-[30rem]">
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={renderHabitItem}
        showsVerticalScrollIndicator={true}
        ListEmptyComponent={
          listEmptyComponent || (
            <View className="justify-center items-center p-8">
              <Feather name="clipboard" size={48} color={colors.primary} />
              <Text className="text-lg font-bold text-gray-800 dark:text-white mt-4 text-center">
                Nenhum hábito encontrado
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 mt-2 text-center">
                Adicione um novo hábito para começar a acompanhar seu progresso.
              </Text>
            </View>
          )
        }
        ItemSeparatorComponent={() => <View className="my-2" />}
      />
    </View>
  );
}
