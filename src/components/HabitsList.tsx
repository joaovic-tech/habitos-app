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
import { useTheme } from "@/hooks/useTheme";

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

  const deleteHabit = useCallback(
    async (id: string) => {
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
    },
    [sortHabits]
  );

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
          className={`p-4 rounded-lg dark:bg-gray-800 bg-gray-500 ${
            !item.enabled && "opacity-50"
          }`}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-800 dark:text-white">
              {item.name}
            </Text>
            <View className="flex-row items-center p-2 bg-gray-100 border border-gray-200 rounded-lg dark:border-gray-800 dark:bg-gray-700">
              <Feather
                name="clock"
                size={14}
                color={isDarkMode ? colors.gray[400] : colors.gray[600]}
                style={{ marginRight: 4 }}
              />
              <Text className="text-sm font-bold text-gray-600 dark:text-gray-500">
                {item.startTime} - {item.endTime}
              </Text>
            </View>
          </View>

          <Text className="mt-1 mb-2 text-sm text-gray-600 dark:text-gray-400">
            {item.description}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center p-2 bg-gray-900 rounded">
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
                className="items-center justify-center w-10 h-10 bg-red-600 rounded-full"
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
      <View className="items-center justify-center p-4">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4 text-gray-600 dark:text-gray-400">
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
              <Feather name="clipboard" size={48} color={colors.primary} />
              <Text className="mt-4 text-lg font-bold text-center text-gray-800 dark:text-white">
                Nenhum hábito encontrado
              </Text>
              <Text className="mt-2 text-center text-gray-600 dark:text-gray-400">
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
