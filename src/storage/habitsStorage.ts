import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  scheduleHabitNotifications,
  cancelHabitNotifications,
  rescheduleHabitNotifications,
  cancelAllNotifications,
} from "@/services/HabitSchedulerService";

export const ITEMS_STORAGE_KEY = "@habits:userHabits";

export interface Habit {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  alertsPerDay: number;
  createdAt: number;
  status: boolean;
}

async function habitNameExists(habit: Habit): Promise<boolean> {
  const habits = await getAll();

  const habitNameExists = habits.some(
    (h) => h.name.toLowerCase() === habit.name.toLowerCase()
  );

  return habitNameExists;
}

function sortHabits(habits: Habit[]): Habit[] {
  habits.sort((a: Habit, b: Habit) => {
    return a.startTime.localeCompare(b.startTime);
  });

  return habits;
}

async function save(habits: Habit[]): Promise<void> {
  const newHabits = sortHabits(habits);

  try {
    await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(newHabits));
  } catch (error) {
    throw error;
  }
}

export async function add(habit: Habit): Promise<Habit[]> {
  try {
    const habits = await getAll();

    const habitExists = await habitNameExists(habit);

    if (habitExists) {
      throw new Error("Já existe um hábito com este nome.");
    }

    const updatedHabits = [...habits, habit];
    await save(updatedHabits);

    // Agenda notificações para o novo hábito
    try {
      await scheduleHabitNotifications(habit);
    } catch (notificationError) {
      console.error(
        `Erro ao agendar notificações para "${habit.name}":`,
        notificationError
      );
      // Não falha a operação se as notificações falharem
    }

    return updatedHabits;
  } catch (error) {
    throw error; // Re-throw para ser tratado na UI
  }
}

export async function remove(id: string): Promise<Habit[]> {
  try {
    console.log(`🗑️ Iniciando remoção do hábito ID: ${id}`);
    
    const habits = await getAll();
    const habitToRemove = habits.find((habit) => habit.id === id);

    if (!habitToRemove) {
      console.warn(`⚠️ Hábito com ID ${id} não encontrado`);
      return habits; // Retorna lista atual se hábito não existir
    }

    console.log(`📝 Removendo hábito: "${habitToRemove.name}" (ID: ${id})`);

    // Cancela todas as notificações do hábito antes de removê-lo
    try {
      console.log(`🔔 Cancelando notificações para "${habitToRemove.name}"...`);
      await cancelHabitNotifications(id);
      console.log(`✅ Notificações canceladas com sucesso para "${habitToRemove.name}"`);
    } catch (notificationError) {
      console.error(
        `❌ Erro ao cancelar notificações para "${habitToRemove.name}":`,
        notificationError
      );
      // Não falha a operação se o cancelamento das notificações falhar
      // mas registra o erro para debug
    }

    // Remove o hábito da lista
    const updatedHabits = habits.filter((habit) => habit.id !== id);
    await save(updatedHabits);
    
    console.log(`✅ Hábito "${habitToRemove.name}" removido com sucesso`);
    console.log(`📊 Total de hábitos restantes: ${updatedHabits.length}`);
    
    return updatedHabits;
  } catch (error) {
    console.error(`❌ Erro ao remover hábito ID ${id}:`, error);
    throw error;
  }
}

export async function clearHabits(): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(ITEMS_STORAGE_KEY);
    await cancelAllNotifications();
    return true;
  } catch (error) {
    console.error("Error clearing habits:", error);
    return false;
  }
}

export async function getAll(): Promise<Habit[]> {
  try {
    const data = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting habits:", error);
    throw error;
  }
}

export async function update(updatedHabit: Habit): Promise<Habit[]> {
  try {
    const habits = await getAll();

    // Verifica se já existe OUTRO hábito com o mesmo nome
    const habitNameExists = habits.some(
      (h) =>
        h.name.toLowerCase() === updatedHabit.name.toLowerCase() &&
        h.id !== updatedHabit.id // Exclui o próprio hábito da verificação
    );

    if (habitNameExists) {
      throw new Error("Já existe um hábito com este nome.");
    }

    const updatedHabits = habits.map((habit) =>
      habit.id === updatedHabit.id ? updatedHabit : habit
    );
    await save(updatedHabits);

    // Reagenda notificações para o hábito atualizado
    try {
      await rescheduleHabitNotifications(updatedHabit);
    } catch (notificationError) {
      console.error(
        `Erro ao reagendar notificações para "${updatedHabit.name}":`,
        notificationError
      );
      // Não falha a operação se as notificações falharem
    }

    return updatedHabits;
  } catch (error) {
    console.error("Error updating habit:", error);
    throw error; // Re-throw para ser tratado na UI
  }
}
