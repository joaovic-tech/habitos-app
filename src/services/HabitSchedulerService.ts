import * as Notifications from "expo-notifications";
import { schedulePushNotification } from "./NotificationService";
import { habitsData } from "@/data/HabitsData";
import { notificationLifecycleManager } from "./NotificationLifecycleService";
import type { Habit } from "@/storage/habitsStorage";

/**
 * Interface para representar um alerta agendado
 */
interface ScheduledAlert {
  id: string;
  habitId: string;
  title: string;
  message: string;
  scheduledTime: Date;
  notificationId?: string;
}

/**
 * Converte uma string de tempo (HH:mm) para um objeto Date de hoje
 */
function timeStringToDate(timeString: string): Date {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Calcula os horários de alerta de forma intuitiva para o usuário:
 * - 1 alerta: meio do período
 * - 2 alertas: início e fim
 * - 3+ alertas: início, fim e distribuição uniforme entre eles
 */
export function calculateAlertTimes(
  startTime: Date,
  endTime: Date,
  alertsPerDay: number
): Date[] {
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Se o horário de fim for menor que o de início, adiciona um dia
  if (end.getTime() <= start.getTime()) {
    end.setDate(end.getDate() + 1);
  }

  const alertTimes: Date[] = [];

  if (alertsPerDay === 1) {
    // Para 1 alerta: meio do período
    const middleTime = new Date(
      start.getTime() + (end.getTime() - start.getTime()) / 2
    );
    middleTime.setSeconds(0, 0); // Garante que os segundos sejam 0 para maior precisão.
    alertTimes.push(middleTime);
  } else if (alertsPerDay === 2) {
    // Para 2 alertas: exatamente no início e fim
    alertTimes.push(new Date(start));
    alertTimes.push(new Date(end));
  } else {
    // Para 3+ alertas: início, fim e distribui os demais uniformemente entre eles
    alertTimes.push(new Date(start)); // Primeiro alerta no início

    const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const intervalMinutes = totalMinutes / (alertsPerDay - 1); // -1 porque já temos início e fim

    // Alertas intermediários
    for (let i = 1; i < alertsPerDay - 1; i++) {
      const alertTime = new Date(
        start.getTime() + intervalMinutes * i * 60 * 1000
      );
      alertTime.setSeconds(0, 0); // Garante que os segundos sejam 0 para maior precisão.
      alertTimes.push(alertTime);
    }

    alertTimes.push(new Date(end)); // Último alerta no fim
  }

  return alertTimes;
}

/**
 * Obtém a mensagem personalizada para um hábito específico
 */
function getHabitMessage(habitName: string): string {
  const habitData = habitsData.habitos.find(
    (habit) => habit.name.toLowerCase() === habitName.toLowerCase()
  );

  return (
    habitData?.messageNotification || `Lembre-se do seu hábito: ${habitName}`
  );
}

/**
 * Cancela todas as notificações agendadas para um hábito específico
 */
export async function cancelHabitNotifications(habitId: string): Promise<void> {
  try {
    console.log(`🧹 Iniciando cancelamento de notificações para hábito ${habitId}`);
    
    // 1. Cancela notificações ativas no lifecycle manager
    await notificationLifecycleManager.cancelHabitNotifications(habitId);

    // 2. Obtém todas as notificações agendadas no sistema
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    console.log(`📋 Total de notificações no sistema: ${scheduledNotifications.length}`);

    // 3. Filtra notificações que pertencem a este hábito (múltiplos padrões)
    const habitNotifications = scheduledNotifications.filter((notification) => {
      const id = notification.identifier;
      // Padrões possíveis de ID:
      // - habit_${habitId}_alert_${number}
      // - ${habitId}_${timestamp}
      // - ou qualquer variação que contenha o habitId
      return (
        id.startsWith(`habit_${habitId}_`) ||
        id.includes(`_${habitId}_`) ||
        id.startsWith(habitId)
      );
    });

    console.log(`🎯 Encontradas ${habitNotifications.length} notificações para o hábito ${habitId}`);
    
    // 4. Lista as notificações encontradas para debug
    if (habitNotifications.length > 0) {
      console.log(`📝 IDs das notificações a serem canceladas:`);
      habitNotifications.forEach((notif, index) => {
        console.log(`  ${index + 1}. ${notif.identifier}`);
      });
    }

    // 5. Cancela cada notificação individualmente
    let canceledCount = 0;
    for (const notification of habitNotifications) {
      try {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        console.log(`✅ Cancelada: ${notification.identifier}`);
        canceledCount++;
      } catch (cancelError) {
        console.warn(`⚠️ Erro ao cancelar ${notification.identifier}:`, cancelError);
        // Continua tentando cancelar as outras, mesmo se uma falhar
      }
    }
    
    // 6. Remove notificações entregues/apresentadas (caso estejam na tela)
    try {
      await Notifications.dismissAllNotificationsAsync();
      console.log(`🧹 Notificações apresentadas removidas da tela`);
    } catch (dismissError) {
      console.warn(`⚠️ Erro ao remover notificações da tela:`, dismissError);
    }

    console.log(`✅ Cancelamento concluído: ${canceledCount}/${habitNotifications.length} notificações canceladas para hábito ${habitId}`);
    
    // 7. Verificação final para confirmar
    const remainingNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const stillPresent = remainingNotifications.filter((notification) => {
      const id = notification.identifier;
      return (
        id.startsWith(`habit_${habitId}_`) ||
        id.includes(`_${habitId}_`) ||
        id.startsWith(habitId)
      );
    });
    
    if (stillPresent.length > 0) {
      console.warn(`⚠️ Ainda há ${stillPresent.length} notificações remanescentes para o hábito ${habitId}:`);
      stillPresent.forEach((notif) => console.warn(`  - ${notif.identifier}`));
    } else {
      console.log(`🎉 Todas as notificações do hábito ${habitId} foram canceladas com sucesso!`);
    }
    
  } catch (error) {
    console.error(`❌ Erro geral ao cancelar notificações do hábito ${habitId}:`, error);
    throw error; // Re-throw para que o chamador saiba que algo deu errado
  }
}

/**
 * Agenda notificações para um hábito específico
 */
export async function scheduleHabitNotifications(habit: Habit): Promise<void> {
  try {
    // Se o hábito está desabilitado, não agenda notificações
    if (!habit.status) {
      console.log(
        `Hábito "${habit.name}" está desabilitado. Notificações não agendadas.`
      );
      return;
    }

    // Primeiro, cancela notificações existentes para este hábito
    await cancelHabitNotifications(habit.id);

    // Calcula os horários de alerta
    const alertTimes = calculateAlertTimes(
      timeStringToDate(habit.startTime),
      timeStringToDate(habit.endTime),
      habit.alertsPerDay
    );

    // Obtém a mensagem personalizada para o hábito
    const message = getHabitMessage(habit.name);

    // Agenda cada notificação
    let scheduledCount = 0;
    for (let i = 0; i < alertTimes.length; i++) {
      const alertTime = alertTimes[i];

      // Garante que o horário é futuro (adiciona 1 dia se necessário)
      const now = new Date();
      if (alertTime.getTime() <= now.getTime()) {
        alertTime.setDate(alertTime.getDate() + 1);
      }

      // Cria um identificador único para a notificação
      const notificationId = `habit_${habit.id}_alert_${i + 1}`;

      try {
        // Agenda a notificação usando o serviço wrapper
        const scheduledId = await schedulePushNotification(
          `🔔 ${habit.name}`, // Título da notificação com emoji
          alertTime,
          message, // Mensagem personalizada do hábito
          {
            habitId: habit.id,
            habitName: habit.name,
            alertNumber: i + 1,
            totalAlerts: alertTimes.length,
            notificationId: notificationId,
          }
        );

        if (scheduledId) {
          console.log(
            `Notificação agendada para ${
              habit.name
            } às ${alertTime.toLocaleTimeString()}`
          );
          scheduledCount++;
        }
      } catch (error) {
        console.error(
          `Erro ao agendar alerta ${i + 1} para "${habit.name}":`,
          error
        );
      }
    }

    console.log(
      `✅ ${scheduledCount} notificações agendadas para o hábito "${habit.name}"`
    );

    if (scheduledCount === 0) {
      throw new Error(
        `Nenhuma notificação foi agendada para o hábito "${habit.name}"`
      );
    }
  } catch (error) {
    console.error(
      `Erro ao agendar notificações para o hábito "${habit.name}":`,
      error
    );
    throw error;
  }
}

/**
 * Reagenda todas as notificações de um hábito atualizado
 */
export async function rescheduleHabitNotifications(
  habit: Habit
): Promise<void> {
  await scheduleHabitNotifications(habit);
}

/**
 * Agenda notificações para todos os hábitos ativos
 */
export async function scheduleAllActiveHabits(habits: Habit[]): Promise<void> {
  const activeHabits = habits.filter((habit) => habit.status);

  for (const habit of activeHabits) {
    try {
      await scheduleHabitNotifications(habit);
    } catch (error) {
      console.error(`Erro ao agendar hábito "${habit.name}":`, error);
    }
  }
}

/**
 * Lista todas as notificações agendadas (útil para debug)
 */
export async function listScheduledNotifications(): Promise<void> {
  try {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();
    console.log(`📋 Total de notificações agendadas: ${notifications.length}`);

    notifications.forEach((notification) => {
      // Verifica se o trigger é do tipo DateTrigger antes de acessar a propriedade date
      const triggerInfo =
        notification.trigger && "date" in notification.trigger
          ? new Date(notification.trigger.date).toLocaleString()
          : "Trigger desconhecido";

      console.log(
        `- ${notification.identifier}: ${notification.content.title} em ${triggerInfo}`
      );
    });
  } catch (error) {
    console.error("Erro ao listar notificações:", error);
  }
}

/**
 * Cancela todas as notificações agendadas
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    // Usa o método correto do lifecycle manager
    await notificationLifecycleManager.forceCleanupAll();
    
    // Dupla garantia - cancela pelo Expo também
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    console.log("✅ Todas as notificações foram canceladas");
  } catch (error) {
    console.error("Erro ao cancelar todas as notificações:", error);
  }
}
