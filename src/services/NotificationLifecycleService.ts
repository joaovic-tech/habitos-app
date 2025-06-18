import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACTIVE_NOTIFICATIONS_KEY = "@notifications:active";
const NOTIFICATION_TIMEOUT = 60000; // 1 minuto em milissegundos

interface ActiveNotification {
  id: string;
  habitId: string;
  habitName: string;
  scheduledTime: number;
  timeoutId?: NodeJS.Timeout;
}

/**
 * Gerencia o ciclo de vida das notificações ativas
 */
class NotificationLifecycleManager {
  [x: string]: any;
  private activeNotifications = new Map<string, ActiveNotification>();
  private initialized = false;

  /**
   * Inicializa o gerenciador e configura listeners
   */
  async initialize() {
    if (this.initialized) return;

    // Carrega notificações ativas do storage
    await this.loadActiveNotifications();

    // Configura listener para quando notificações são recebidas
    Notifications.addNotificationReceivedListener(
      this.handleNotificationReceived.bind(this)
    );

    // Configura listener para quando usuário interage com notificação
    Notifications.addNotificationResponseReceivedListener(
      this.handleNotificationResponse.bind(this)
    );

    this.initialized = true;
    console.log("🔄 NotificationLifecycleManager inicializado");
  }

  /**
   * Registra uma notificação como ativa
   */
  async registerNotification(
    notificationId: string,
    habitId: string,
    habitName: string
  ) {
    const activeNotification: ActiveNotification = {
      id: notificationId,
      habitId,
      habitName,
      scheduledTime: Date.now(),
    };

    // Cancela timeout anterior se existir
    const existing = this.activeNotifications.get(notificationId);
    if (existing?.timeoutId) {
      clearTimeout(existing.timeoutId);
    }

    // Define timeout para cancelar automaticamente após 1 minuto
    const timeoutId = setTimeout(() => {
      this.cancelNotification(notificationId, "timeout");
    }, NOTIFICATION_TIMEOUT);

    activeNotification.timeoutId = timeoutId;
    this.activeNotifications.set(notificationId, activeNotification);

    // Salva no storage
    await this.saveActiveNotifications();

    console.log(
      `📝 Notificação ${notificationId} registrada para ${habitName}`
    );
  }

  /**
   * Cancela uma notificação específica
   */
  async cancelNotification(
    notificationId: string,
    reason: "timeout" | "user_interaction" | "manual"
  ) {
    const notification = this.activeNotifications.get(notificationId);
    if (!notification) return;

    // Limpa timeout se existir
    if (notification.timeoutId) {
      clearTimeout(notification.timeoutId);
    }

    // Remove da lista ativa
    this.activeNotifications.delete(notificationId);

    try {
      // IMPORTANTE: Cancela a notificação agendada (para parar repetições futuras)
      await Notifications.cancelScheduledNotificationAsync(notificationId);

      // Remove da tela se estiver visível
      await Notifications.dismissNotificationAsync(notificationId);

      console.log(
        `🗑️ Notificação ${notificationId} cancelada e removida (${reason})`
      );
    } catch (error) {
      console.log(`⚠️ Erro ao cancelar notificação ${notificationId}:`, error);
    }

    // Atualiza storage
    await this.saveActiveNotifications();
  }

  /**
   * Cancela todas as notificações de um hábito específico
   */
  async cancelHabitNotifications(habitId: string) {
    const habitNotifications = Array.from(
      this.activeNotifications.values()
    ).filter((notification) => notification.habitId === habitId);

    for (const notification of habitNotifications) {
      await this.cancelNotification(notification.id, "manual");
    }

    console.log(
      `🧹 ${habitNotifications.length} notificações canceladas para hábito ${habitId}`
    );
  }

  /**
   * Cancela notificações antigas (mais de 1 hora)
   */
  async cleanupOldNotifications() {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const oldNotifications = Array.from(
      this.activeNotifications.values()
    ).filter((notification) => notification.scheduledTime < oneHourAgo);

    for (const notification of oldNotifications) {
      await this.cancelNotification(notification.id, "timeout");
    }

    if (oldNotifications.length > 0) {
      console.log(
        `🧹 ${oldNotifications.length} notificações antigas removidas`
      );
    }
  }

  /**
   * Verifica se já existe uma notificação ativa para um hábito
   */
  hasActiveNotificationForHabit(habitId: string): boolean {
    return Array.from(this.activeNotifications.values()).some(
      (notification) => notification.habitId === habitId
    );
  }

  /**
   * Lista todas as notificações ativas
   */
  getActiveNotifications(): ActiveNotification[] {
    return Array.from(this.activeNotifications.values());
  }

  /**
   * Força limpeza completa de todas as notificações
   */
  async forceCleanupAll() {
    console.log("🧽 Forçando limpeza completa de notificações...");

    try {
      // Cancela todas as notificações agendadas
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Limpa todas as notificações apresentadas
      await Notifications.dismissAllNotificationsAsync();

      // Limpa timeouts ativos
      for (const notification of this.activeNotifications.values()) {
        if (notification.timeoutId) {
          clearTimeout(notification.timeoutId);
        }
      }

      // Limpa lista ativa
      this.activeNotifications.clear();

      // Limpa storage
      await AsyncStorage.removeItem(ACTIVE_NOTIFICATIONS_KEY);

      console.log("✅ Limpeza completa realizada com sucesso");
    } catch (error) {
      console.error("❌ Erro na limpeza completa:", error);
    }
  }

  /**
   * Cancela todas as notificações (alias para forceCleanupAll)
   */
  async cancelAllNotifications() {
    await this.forceCleanupAll();
  }

  /**
   * Handler para quando uma notificação é recebida
   */
  private handleNotificationReceived(notification: Notifications.Notification) {
    const data = notification.request.content.data;
    if (data?.notificationId) {
      console.log(
        `🔔 Notificação recebida: ${data.notificationId} para ${data.habitName}`
      );

      // Registra a notificação como ativa
      if (
        typeof data.notificationId === "string" &&
        typeof data.habitId === "string" &&
        typeof data.habitName === "string"
      ) {
        this.registerNotification(
          data.notificationId,
          data.habitId,
          data.habitName
        );
      } else {
        console.warn("Dados de notificação inválidos:", data);
      }
    }
  }

  /**
   * Handler para quando usuário interage com a notificação
   */
  private handleNotificationResponse(
    response: Notifications.NotificationResponse
  ) {
    const data = response.notification.request.content.data;
    if (data?.notificationId) {
      console.log(
        `👆 Usuário interagiu com notificação: ${data.notificationId}`
      );

      // Cancela a notificação pois usuário já viu
      if (typeof data.notificationId === "string") {
        this.cancelNotification(data.notificationId, "user_interaction");
      } else {
        console.warn("notificationId ausente ou inválido em data:", data);
      }
    }
  }

  /**
   * Salva notificações ativas no storage
   */
  private async saveActiveNotifications() {
    try {
      const notifications = Array.from(this.activeNotifications.values()).map(
        ({ timeoutId, ...notification }) => notification
      ); // Remove timeoutId para serialização

      await AsyncStorage.setItem(
        ACTIVE_NOTIFICATIONS_KEY,
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error("Erro ao salvar notificações ativas:", error);
    }
  }

  /**
   * Carrega notificações ativas do storage
   */
  private async loadActiveNotifications() {
    try {
      const data = await AsyncStorage.getItem(ACTIVE_NOTIFICATIONS_KEY);
      if (data) {
        const notifications: ActiveNotification[] = JSON.parse(data);

        // Restaura notificações, mas limpa as muito antigas
        const oneHourAgo = Date.now() - 60 * 60 * 1000;

        for (const notification of notifications) {
          if (notification.scheduledTime > oneHourAgo) {
            this.activeNotifications.set(notification.id, notification);
          }
        }

        console.log(
          `📥 ${notifications.length} notificações carregadas do storage`
        );
      }
    } catch (error) {
      console.error("Erro ao carregar notificações ativas:", error);
    }
  }
}

// Instância singleton
export const notificationLifecycleManager = new NotificationLifecycleManager();

// Inicializa automaticamente
notificationLifecycleManager.initialize();

export default notificationLifecycleManager;
