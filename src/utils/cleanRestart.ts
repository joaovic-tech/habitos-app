import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationLifecycleManager } from '@/services/NotificationLifecycleService';

/**
 * Limpa TUDO e reinicia o app do zero
 */
export async function cleanRestart() {
  console.log('🧹 LIMPEZA COMPLETA - REINÍCIO LIMPO...');
  
  try {
    // 1. Para e cancela todas as notificações
    console.log('1. Cancelando todas as notificações...');
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.dismissAllNotificationsAsync();
    
    // 2. Limpa o lifecycle manager
    console.log('2. Limpando lifecycle manager...');
    await notificationLifecycleManager.forceCleanupAll();
    
    // 3. Limpa storage de notificações ativas
    console.log('3. Limpando storage de notificações...');
    await AsyncStorage.removeItem('@notifications:active');
    
    // 4. Verifica se limpou tudo
    const remaining = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`4. Verificação: ${remaining.length} notificações restantes`);
    
    // 5. Se ainda há notificações, força remoção uma por uma
    if (remaining.length > 0) {
      console.log('5. Forçando remoção individual...');
      for (const notification of remaining) {
        try {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        } catch (error) {
          console.log(`Erro ao cancelar ${notification.identifier}:`, error);
        }
      }
    }
    
    // 6. Verificação final
    const finalCheck = await Notifications.getAllScheduledNotificationsAsync();
    
    console.log('✅ LIMPEZA COMPLETA FINALIZADA!');
    console.log(`📊 Status final: ${finalCheck.length} notificações restantes`);
    
    if (finalCheck.length === 0) {
      console.log('🎉 APP COMPLETAMENTE LIMPO!');
      console.log('💡 Agora você pode criar hábitos sem problemas');
    } else {
      console.log('⚠️ Algumas notificações persistem - pode ser necessário reiniciar o app');
    }
    
    return {
      success: finalCheck.length === 0,
      remainingCount: finalCheck.length,
      message: finalCheck.length === 0 
        ? 'App completamente limpo!' 
        : `${finalCheck.length} notificações ainda restam`
    };
    
  } catch (error) {
    console.error('❌ Erro durante limpeza:', error);
    return {
      success: false,
      error: error,
      message: 'Erro durante a limpeza'
    };
  }
}

/**
 * Comando rápido para executar no console
 */
export async function quickClean() {
  const result = await cleanRestart();
  console.log('RESULTADO DA LIMPEZA:', result);
  return result;
}

