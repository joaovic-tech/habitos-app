import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configuração otimizada para garantir que as notificações sejam exibidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true, // Som ativado para chamar atenção
    shouldSetBadge: true, // Badge para mostrar no ícone do app
    shouldShowBanner: true, // Banner na tela
    shouldShowList: true, // Aparece na lista de notificações
    // Prioridade alta apenas para Android
    ...(Platform.OS === "android" && {
      priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
  }),
});

/**
 * Calcula os segundos até o próximo horário especificado
 * Se o horário já passou hoje, calcula para amanhã
 */
function getSecondsUntilTime(targetTime: Date): number {
  const now = new Date();
  const target = new Date(targetTime);
  
  // Define o horário de hoje com as horas/minutos do target
  const todayTarget = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    target.getHours(),
    target.getMinutes(),
    0,
    0
  );
  
  // Se o horário já passou hoje, agenda para amanhã
  if (todayTarget.getTime() <= now.getTime()) {
    todayTarget.setDate(todayTarget.getDate() + 1);
  }
  
  // Retorna a diferença em segundos
  return Math.floor((todayTarget.getTime() - now.getTime()) / 1000);
}

async function allowsNotificationsAsync(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();

  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

function requestPermissionsAsync() {
  return Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
}

/**
 * Agenda uma notificação para o horário especificado.
 * @param title Título da notificação
 * @param triggerDate Data ou timestamp do alerta
 * @param body Corpo da mensagem (opcional)
 * @param data Dados adicionais (opcional)
 * @param repeats Se deve repetir diariamente (padrão: true)
 */
async function schedulePushNotification(
  title: string,
  triggerDate: Date | number,
  body?: string,
  data?: any,
  repeats: boolean = true
): Promise<string | null> {
  // Garante que o trigger é um objeto Date
  const date =
    typeof triggerDate === "number" ? new Date(triggerDate) : triggerDate;

  // Não agenda notificações para datas no passado
  if (date.getTime() <= Date.now()) {
    console.log(`Notificação para "${title}" não agendada (data no passado).`);
    return null;
  }

  try {
    // Define o trigger baseado na plataforma e se deve repetir
    let trigger: Notifications.NotificationTriggerInput;
    
    if (repeats) {
      if (Platform.OS === 'ios') {
        // iOS suporta calendar trigger para repetições
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: date.getHours(),
          minute: date.getMinutes(),
          second: 0,
          repeats: true,
        } as Notifications.CalendarTriggerInput;
      } else {
        // Android: usar apenas agendamento único para evitar loops
        // As repetições serão gerenciadas pelo sistema de hábitos
        const targetTime = new Date();
        targetTime.setHours(date.getHours(), date.getMinutes(), 0, 0);
        
        // Se o horário já passou hoje, agenda para amanhã
        if (targetTime.getTime() <= Date.now()) {
          targetTime.setDate(targetTime.getDate() + 1);
        }
        
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: targetTime,
        } as Notifications.DateTriggerInput;
      }
    } else {
      // Para notificações únicas, ambas plataformas usam date trigger
      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: date,
      } as Notifications.DateTriggerInput;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: body || title,
        sound: true,
        data: data || {},
        ...(Platform.OS === "android" && {
          priority: Notifications.AndroidNotificationPriority.HIGH,
        }),
      },
      trigger,
    });

    return notificationId;
  } catch (error) {
    console.error(`❌ Erro ao agendar notificação "${title}":`, error);
    throw error;
  }
}

export {
  allowsNotificationsAsync,
  requestPermissionsAsync,
  schedulePushNotification,
};
