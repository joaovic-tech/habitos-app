import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as habitsStorage from "@/storage/habitsStorage";
import { CustomSwitch } from "@/components/shared/CustomSwitch";
import { colors } from "@/styles/colors";
import { router, useFocusEffect } from "expo-router";
import { ClipboardText } from "phosphor-react-native";
import { getScreenCategory } from "@/utils/screenUtils";
import { useToast } from "./shared/Toast";
import { useTheme } from "@/hooks/useTheme";

type HabitsListProps = {
  onHabitsChange?: (habits: habitsStorage.Habit[]) => void;
};

export function HabitsList({ onHabitsChange }: HabitsListProps) {
  const [habits, setHabits] = useState<habitsStorage.Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const { colorScheme } = useTheme();
  const isDarkMode = colorScheme === "dark";
  const screenWidth = getScreenCategory();
  const { toast } = useToast();

  // Load habits from storage
  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      const habits = await habitsStorage.getAll();
      setHabits(habits); // <-- Atualiza o estado corretamente
    } catch (error) {
      console.error("Error loading habits:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  // Reload habits when screen comes into focus (handles updates from other (tabs))
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
        const habitToToggle = habits.find((habit) => habit.id === id);

        if (habitToToggle) {
          const updatedHabit = {
            ...habitToToggle,
            status: !habitToToggle.status, // Corrigido de 'enabled' para 'status'
          };
          const updatedHabits = await habitsStorage.update(updatedHabit);

          setHabits(updatedHabits);
        }
      } catch (error) {
        toast("Erro ao atualizar o hábito. Tente novamente.", "destructive");
        console.error("Error toggling habit:", error);
        // Considere se a navegação aqui é realmente necessária em caso de erro de toggle
        // router.push("/(tabs)");
      }
    },
    [habits, toast]
  ); // Adicionado 'habits' e 'toast' ao array de dependências do useCallback

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
          className={`p-4 flex-col gap-2.5 rounded-xl bg-white dark:bg-neutral-800 ${
            !item.status && "opacity-30"
          }`}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-dosis-bold text-neutral-900 dark:text-white">
              {item.name}
            </Text>

            <View className="flex-row items-center p-2 rounded bg-neutral-100 dark:bg-neutral-700">
              <Feather
                name="bell"
                size={14}
                color={isDarkMode ? colors.white : colors.black}
                style={{ marginRight: 4 }}
              />
              <Text className="text-sm font-dosis-semibold text-neutral-700 dark:text-neutral-300">
                {item.alertsPerDay} alertas por dia
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center p-2 bg-white rounded-lg dark:bg-neutral-900">
              <Text className="text-xl font-dosis-medium text-neutral-700 dark:text-white">
                {item.startTime} - {item.endTime}
              </Text>
            </View>
            <CustomSwitch
              value={item.status}
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
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4 text-neutral-600 dark:text-neutral-400 font-dosis-bold">
          Carregando hábitos...
        </Text>
      </View>
    );
  }

  const listEmptyComponent = () => (
    <View className="items-center justify-center p-8">
      <ClipboardText size={48} color={colors.secondary} weight="duotone" />
      <Text className="mt-4 text-lg text-center font-dosis-bold text-neutral-800 dark:text-white">
        Nenhum hábito encontrado
      </Text>
      <Text className="items-center justify-center text-center text-neutral-600 dark:text-neutral-400 font-dosis-medium">
        Adicione um novo hábito clicando no ícone de (+) acima..
      </Text>
    </View>
  );

  return (
    <FlatList
      className="max-h-[75%] relative"
      data={habits}
      keyExtractor={(item) => item.id}
      renderItem={renderHabitItem}
      ListEmptyComponent={listEmptyComponent}
      ItemSeparatorComponent={() => <View className="my-2" />}
      indicatorClassName="bg-neutral-800"
      contentContainerStyle={{
        paddingBottom: screenWidth === "small" ? 65 : 40,
      }}
    />
  );
}
