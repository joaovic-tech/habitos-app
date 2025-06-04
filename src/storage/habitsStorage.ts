import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage key
export const ITEMS_STORAGE_KEY = "@habits:userHabits";

// Habit type definition
export interface Habit {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  alertsPerDay: number;
  createdAt: number;
  enabled: boolean;
}

/**
 * Saves habits array to AsyncStorage
 */
export async function save(habits: Habit[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error("Error saving habits:", error);
    throw error;
  }
}

/**
 * Adds a new habit to storage
 */
export async function add(habit: Habit): Promise<Habit[]> {
  try {
    const habits = await getAll();
    const updatedHabits = [...habits, habit];
    await save(updatedHabits);
    return updatedHabits;
  } catch (error) {
    console.error("Error adding habit:", error);
    throw error;
  }
}

/**
 * Removes a habit from storage by id
 */
export async function remove(id: string): Promise<Habit[]> {
  try {
    const habits = await getAll();
    const updatedHabits = habits.filter((habit) => habit.id !== id);
    await save(updatedHabits);
    return updatedHabits;
  } catch (error) {
    console.error("Error removing habit:", error);
    throw error;
  }
}

/**
 * Gets all habits from storage
 */
export async function getAll(): Promise<Habit[]> {
  try {
    const data = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting habits:", error);
    throw error;
  }
}

/**
 * Updates an existing habit
 */
export async function update(updatedHabit: Habit): Promise<Habit[]> {
  try {
    const habits = await getAll();
    const updatedHabits = habits.map((habit) =>
      habit.id === updatedHabit.id ? updatedHabit : habit
    );
    await save(updatedHabits);
    return updatedHabits;
  } catch (error) {
    console.error("Error updating habit:", error);
    throw error;
  }
}
