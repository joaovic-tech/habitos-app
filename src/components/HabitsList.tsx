import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as habitsStorage from "@/storage/habitsStorage";
import { CustomSwitch } from "@/components/CustomSwitch";
import { colors } from "@/styles/colors";
import { router, useFocusEffect } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/components/shared/Toast";

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
  const isDarkMode = useTheme().colorScheme === "dark";
  const { toast } = useToast();

  // Utility function to sort habits by startTime
  const sortHabits = useCallback((habitsToSort: habitsStorage.Habit[]) => {
    return [...habitsToSort].sort((a, b) => {
      // Convert time (HH:MM) to minutes for comparison
      const getMinutesSinceMidnight = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
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

  // Reload habits when screen comes into focus (handles updates from other screens)
  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [loadHabits])
  );

  // Notify parent component when habits change
  useEffect(() => {
    if (onHabitsChange && !loading) {
      onHabitsChange(habits);
    }
  }, [habits, loading, onHabitsChange]);

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

  // Edita o conteúdo do habito
  const editHabit = (habitsData: habitsStorage.Habit) => {
    router.push({
      pathname: "/habitDetails",
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
          className={`p-4 rounded-xl bg-white dark:bg-neutral-800 shadow-md ${
            !item.enabled && "opacity-60"
          }`}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-neutral-900 dark:text-white">
              {item.name}
            </Text>
            <View className="flex-row items-center p-2 border rounded-lg bg-neutral-100 border-neutral-200 dark:border-neutral-700 dark:bg-neutral-700">
              <Feather
                name="clock"
                size={14}
                color={isDarkMode ? "#A1A1AA" : "#52525B"}
                style={{ marginRight: 4 }}
              />
              <Text className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                {item.startTime} - {item.endTime}
              </Text>
            </View>
          </View>

          <Text className="mt-1 mb-2 text-sm text-neutral-600 dark:text-neutral-300">
            {item.description}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center p-2 rounded bg-neutral-100 dark:bg-neutral-700">
              <Feather
                name="bell"
                size={14}
                color={isDarkMode ? "#E5E7EB" : "#52525B"}
                style={{ marginRight: 4 }}
              />
              <Text className="text-sm text-neutral-700 dark:text-neutral-300">
                {item.alertsPerDay} alertas por dia
              </Text>
            </View>

            <CustomSwitch
              value={item.enabled}
              onValueChange={() => toggleHabit(item.id)}
              disabled={deletingIds.includes(item.id)}
            />
          </View>
        </TouchableOpacity>
      );
    },
    [toggleHabit, deletingIds, isDarkMode]
  );

  // Render loading state
  if (loading) {
    return (
      <View className="items-center justify-center p-4">
        <ActivityIndicator size="large" color={colors.blue - 600} />
        <Text className="mt-4 text-neutral-600 dark:text-neutral-400">
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
        ListEmptyComponent={
          listEmptyComponent || (
            <View className="items-center justify-center p-8">
              <Feather name="clipboard" size={48} color={colors.blue - 600} />
              <Text className="mt-4 text-lg font-bold text-center text-neutral-800 dark:text-white">
                Nenhum hábito encontrado
              </Text>
              <Text className="mt-2 text-center text-neutral-600 dark:text-neutral-400">
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
