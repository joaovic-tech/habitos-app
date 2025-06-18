import * as Notifications from 'expo-notifications';
import { cancelHabitNotifications } from '@/services/HabitSchedulerService';
import { notificationLifecycleManager } from '@/services/NotificationLifecycleService';

/**
 * Utilitário para debugar e testar o sistema de notificações
 */
export class NotificationDebugger {
  
  /**
   * Lista todas as notificações agendadas no sistema
   */
  static async listAllNotifications() {
    console.log('🔍 LISTANDO TODAS AS NOTIFICAÇÕES AGENDADAS...');
    
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      
      console.log(`📊 Total: ${scheduled.length} notificações agendadas`);
      
      if (scheduled.length === 0) {
        console.log('✅ Nenhuma notificação agendada');
        return [];
      }
      
      console.log('📋 LISTA DETALHADA:');
      scheduled.forEach((notification, index) => {
        const triggerInfo = notification.trigger && 'date' in notification.trigger 
          ? new Date(notification.trigger.date).toLocaleString()
          : 'Repetição/Desconhecido';
          
        console.log(`  ${index + 1}. ID: ${notification.identifier}`);
        console.log(`     Título: ${notification.content.title}`);
        console.log(`     Corpo: ${notification.content.body}`);
        console.log(`     Horário: ${triggerInfo}`);
        console.log(`     Dados: ${JSON.stringify(notification.content.data)}`);
        console.log('     ---');
      });
      
      return scheduled;
    } catch (error) {
      console.error('❌ Erro ao listar notificações:', error);
      return [];
    }
  }
  
  /**
   * Lista notificações ativas no lifecycle manager
   */
  static listActiveNotifications() {
    console.log('🎯 LISTANDO NOTIFICAÇÕES ATIVAS NO MANAGER...');
    
    const active = notificationLifecycleManager.getActiveNotifications();
    
    console.log(`📊 Total: ${active.length} notificações ativas`);
    
    if (active.length === 0) {
      console.log('✅ Nenhuma notificação ativa no manager');
      return [];
    }
    
    console.log('📋 LISTA ATIVA:');
    active.forEach((notification, index) => {
      console.log(`  ${index + 1}. ID: ${notification.id}`);
      console.log(`     Hábito: ${notification.habitName} (${notification.habitId})`);
      console.log(`     Agendado: ${new Date(notification.scheduledTime).toLocaleString()}`);
      console.log('     ---');
    });
    
    return active;
  }
  
  /**
   * Testa o cancelamento para um hábito específico
   */
  static async testCancelHabitNotifications(habitId: string) {
    console.log(`🧪 TESTANDO CANCELAMENTO PARA HÁBITO: ${habitId}`);
    
    // Lista antes
    console.log('📋 ANTES DO CANCELAMENTO:');
    const beforeScheduled = await this.listAllNotifications();
    const beforeActive = this.listActiveNotifications();
    
    // Filtra notificações do hábito
    const habitNotificationsBefore = beforeScheduled.filter(n => 
      n.identifier.includes(habitId)
    );
    const activeHabitNotificationsBefore = beforeActive.filter(n => 
      n.habitId === habitId
    );
    
    console.log(`🎯 Notificações do hábito ${habitId} ANTES: ${habitNotificationsBefore.length} agendadas, ${activeHabitNotificationsBefore.length} ativas`);
    
    // Executa cancelamento
    try {
      await cancelHabitNotifications(habitId);
      console.log('✅ Cancelamento executado');
    } catch (error) {
      console.error('❌ Erro no cancelamento:', error);
    }
    
    // Lista depois
    console.log('📋 DEPOIS DO CANCELAMENTO:');
    const afterScheduled = await this.listAllNotifications();
    const afterActive = this.listActiveNotifications();
    
    // Filtra notificações do hábito
    const habitNotificationsAfter = afterScheduled.filter(n => 
      n.identifier.includes(habitId)
    );
    const activeHabitNotificationsAfter = afterActive.filter(n => 
      n.habitId === habitId
    );
    
    console.log(`🎯 Notificações do hábito ${habitId} DEPOIS: ${habitNotificationsAfter.length} agendadas, ${activeHabitNotificationsAfter.length} ativas`);
    
    // Resultado
    const scheduledCanceled = habitNotificationsBefore.length - habitNotificationsAfter.length;
    const activeCanceled = activeHabitNotificationsBefore.length - activeHabitNotificationsAfter.length;
    
    console.log(`📊 RESULTADO DO TESTE:`);
    console.log(`   Agendadas canceladas: ${scheduledCanceled}/${habitNotificationsBefore.length}`);
    console.log(`   Ativas canceladas: ${activeCanceled}/${activeHabitNotificationsBefore.length}`);
    
    if (habitNotificationsAfter.length === 0 && activeHabitNotificationsAfter.length === 0) {
      console.log('🎉 SUCESSO! Todas as notificações do hábito foram canceladas');
      return true;
    } else {
      console.log('⚠️ ATENÇÃO! Ainda restam notificações não canceladas');
      if (habitNotificationsAfter.length > 0) {
        console.log('📋 Agendadas remanescentes:');
        habitNotificationsAfter.forEach(n => console.log(`   - ${n.identifier}`));
      }
      if (activeHabitNotificationsAfter.length > 0) {
        console.log('📋 Ativas remanescentes:');
        activeHabitNotificationsAfter.forEach(n => console.log(`   - ${n.id}`));
      }
      return false;
    }
  }
  
  /**
   * Diagnóstico completo do sistema
   */
  static async fullDiagnosis() {
    console.log('🔍 DIAGNÓSTICO COMPLETO DO SISTEMA DE NOTIFICAÇÕES');
    console.log('================================================');
    
    // 1. Lista todas as notificações
    const scheduled = await this.listAllNotifications();
    
    console.log('\n');
    
    // 2. Lista notificações ativas
    const active = this.listActiveNotifications();
    
    console.log('\n');
    
    // 3. Agrupa por hábito
    console.log('📊 AGRUPAMENTO POR HÁBITO:');
    const habitGroups = new Map<string, any[]>();
    
    // Agrupa notificações agendadas
    scheduled.forEach(notification => {
      const id = notification.identifier;
      // Extrai habitId do ID da notificação
      let habitId = '';
      if (id.startsWith('habit_')) {
        const parts = id.split('_');
        if (parts.length >= 3) {
          habitId = parts[1];
        }
      }
      
      if (habitId) {
        if (!habitGroups.has(habitId)) {
          habitGroups.set(habitId, []);
        }
        habitGroups.get(habitId)?.push({
          type: 'scheduled',
          id: notification.identifier,
          title: notification.content.title
        });
      }
    });
    
    // Agrupa notificações ativas
    active.forEach(notification => {
      if (!habitGroups.has(notification.habitId)) {
        habitGroups.set(notification.habitId, []);
      }
      habitGroups.get(notification.habitId)?.push({
        type: 'active',
        id: notification.id,
        habitName: notification.habitName
      });
    });
    
    if (habitGroups.size === 0) {
      console.log('✅ Nenhuma notificação encontrada');
    } else {
      habitGroups.forEach((notifications, habitId) => {
        const scheduledCount = notifications.filter(n => n.type === 'scheduled').length;
        const activeCount = notifications.filter(n => n.type === 'active').length;
        
        console.log(`\n🎯 Hábito ID: ${habitId}`);
        console.log(`   📅 Agendadas: ${scheduledCount}`);
        console.log(`   🔥 Ativas: ${activeCount}`);
        
        if (notifications.length > 0) {
          notifications.forEach(n => {
            const emoji = n.type === 'scheduled' ? '📅' : '🔥';
            const name = n.habitName || n.title || 'N/A';
            console.log(`   ${emoji} ${n.id} (${name})`);
          });
        }
      });
    }
    
    console.log('\n================================================');
    console.log('🏁 DIAGNÓSTICO CONCLUÍDO');
    
    return {
      totalScheduled: scheduled.length,
      totalActive: active.length,
      habitGroups: Array.from(habitGroups.entries()),
      hasIssues: scheduled.length !== active.length
    };
  }
  
  /**
   * Limpeza de emergência - cancela TUDO
   */
  static async emergencyCleanup() {
    console.log('🚨 LIMPEZA DE EMERGÊNCIA - CANCELANDO TODAS AS NOTIFICAÇÕES');
    
    try {
      // Usar o método do lifecycle manager
      await notificationLifecycleManager.forceCleanupAll();
      
      // Verificar resultado
      const remaining = await Notifications.getAllScheduledNotificationsAsync();
      
      if (remaining.length === 0) {
        console.log('✅ LIMPEZA COMPLETA! Todas as notificações foram canceladas');
        return true;
      } else {
        console.log(`⚠️ LIMPEZA PARCIAL: ${remaining.length} notificações ainda restam`);
        remaining.forEach(n => console.log(`   - ${n.identifier}`));
        return false;
      }
    } catch (error) {
      console.error('❌ Erro na limpeza de emergência:', error);
      return false;
    }
  }
}

/**
 * Atalhos para uso rápido no console
 */
export const debugNotifications = {
  list: () => NotificationDebugger.listAllNotifications(),
  active: () => NotificationDebugger.listActiveNotifications(), 
  test: (habitId: string) => NotificationDebugger.testCancelHabitNotifications(habitId),
  diagnose: () => NotificationDebugger.fullDiagnosis(),
  cleanup: () => NotificationDebugger.emergencyCleanup()
};

// Para uso global no console
if (typeof global !== 'undefined') {
  (global as any).debugNotifications = debugNotifications;
}

