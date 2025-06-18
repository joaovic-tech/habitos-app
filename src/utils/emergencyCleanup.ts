import * as Notifications from 'expo-notifications';
import { notificationLifecycleManager } from '@/services/NotificationLifecycleService';

/**
 * COMANDO DE EMERGÊNCIA - Execute este código para parar todas as notificações
 * 
 * Uso no console ou em alguma tela de debug:
 * import { emergencyCleanup } from '@/utils/emergencyCleanup';
 * await emergencyCleanup();
 */
export async function emergencyCleanup() {
  console.log('🚨 INICIANDO LIMPEZA DE EMERGÊNCIA...');
  
  try {
    // 1. Force cleanup do lifecycle manager
    await notificationLifecycleManager.forceCleanupAll();
    
    // 2. Cancela TODAS as notificações agendadas
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // 3. Remove TODAS as notificações da tela
    await Notifications.dismissAllNotificationsAsync();
    
    // 4. Lista para confirmar que não há mais nenhuma
    const remaining = await Notifications.getAllScheduledNotificationsAsync();
    
    console.log('✅ LIMPEZA CONCLUÍDA!');
    console.log(`📊 Notificações restantes: ${remaining.length}`);
    
    if (remaining.length > 0) {
      console.log('⚠️ Ainda há notificações agendadas:', remaining.map(n => n.identifier));
    }
    
    return {
      success: true,
      remainingNotifications: remaining.length,
      message: `Limpeza concluída. ${remaining.length} notificações restantes.`
    };
    
  } catch (error) {
    console.error('❌ Erro na limpeza de emergência:', error);
    return {
      success: false,
      error: error,
      message: 'Erro durante a limpeza de emergência'
    };
  }
}

/**
 * Diagnóstica o estado atual das notificações
 */
export async function diagnoseNotificationState() {
  console.log('🔍 DIAGNÓSTICO DE NOTIFICAÇÕES...');
  
  try {
    // Notificações agendadas
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    
    // Notificações ativas no lifecycle manager
    const active = notificationLifecycleManager.getActiveNotifications();
    
    console.log('📊 DIAGNÓSTICO:');
    console.log(`- Notificações agendadas no sistema: ${scheduled.length}`);
    console.log(`- Notificações ativas no manager: ${active.length}`);
    
    // Lista notificações agendadas
    if (scheduled.length > 0) {
      console.log('📋 NOTIFICAÇÕES AGENDADAS:');
      scheduled.forEach((notification, index) => {
        const triggerInfo = notification.trigger && 'date' in notification.trigger 
          ? new Date(notification.trigger.date).toLocaleString()
          : 'Repetição';
        console.log(`  ${index + 1}. ${notification.identifier} - ${triggerInfo}`);
      });
    }
    
    // Lista notificações ativas
    if (active.length > 0) {
      console.log('🎯 NOTIFICAÇÕES ATIVAS:');
      active.forEach((notification, index) => {
        console.log(`  ${index + 1}. ${notification.id} - ${notification.habitName}`);
      });
    }
    
    return {
      scheduledCount: scheduled.length,
      activeCount: active.length,
      scheduled: scheduled,
      active: active
    };
    
  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error);
    return {
      error: error,
      message: 'Erro durante o diagnóstico'
    };
  }
}

/**
 * SOLUÇÃO RÁPIDA - Execute esta função para resolver o problema atual
 */
export async function quickFix() {
  console.log('⚡ APLICANDO SOLUÇÃO RÁPIDA...');
  
  // 1. Diagnóstica primeiro
  const diagnosis = await diagnoseNotificationState();
  
  // 2. Se há muitas notificações, faz limpeza
  if (diagnosis.scheduledCount > 5 || diagnosis.activeCount > 5) {
    console.log('🧽 Muitas notificações detectadas. Executando limpeza...');
    await emergencyCleanup();
  }
  
  // 3. Diagnóstica novamente
  const finalDiagnosis = await diagnoseNotificationState();
  
  console.log('✅ SOLUÇÃO RÁPIDA CONCLUÍDA!');
  return {
    before: diagnosis,
    after: finalDiagnosis,
    cleaned: diagnosis.scheduledCount !== finalDiagnosis.scheduledCount
  };
}

