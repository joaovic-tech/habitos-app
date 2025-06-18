import * as Notifications from 'expo-notifications';

/**
 * PARE TUDO AGORA - Execute este código imediatamente
 */
export async function stopAllNotificationsNow() {
  console.log('🛑 PARANDO TODAS AS NOTIFICAÇÕES AGORA...');
  
  try {
    // 1. Cancela todas as notificações agendadas (múltiplas tentativas)
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ Tentativa 1: cancelAllScheduledNotificationsAsync');
    
    // 2. Remove todas da tela
    await Notifications.dismissAllNotificationsAsync();
    console.log('✅ Tentativa 2: dismissAllNotificationsAsync');
    
    // 3. Verifica se ainda há notificações
    let remaining = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`📊 Notificações restantes após primeira limpeza: ${remaining.length}`);
    
    // 4. Se ainda há notificações, cancela uma por uma
    if (remaining.length > 0) {
      console.log('🔄 Cancelando notificações uma por uma...');
      for (const notification of remaining) {
        try {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
          console.log(`✅ Cancelada: ${notification.identifier}`);
        } catch (error) {
          console.log(`❌ Erro ao cancelar ${notification.identifier}:`, error);
        }
      }
    }
    
    // 5. Verifica novamente
    remaining = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`📊 Notificações finais restantes: ${remaining.length}`);
    
    // 6. Se AINDA há notificações, tenta método mais agressivo
    if (remaining.length > 0) {
      console.log('🚨 MÉTODO AGRESSIVO - Cancelando com força...');
      
      // Tenta cancelar todas novamente
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      // Remove todas da tela novamente
      await Notifications.dismissAllNotificationsAsync();
      
      // Verifica resultado final
      const finalRemaining = await Notifications.getAllScheduledNotificationsAsync();
      console.log(`📊 Resultado final: ${finalRemaining.length} notificações`);
      
      return {
        success: finalRemaining.length === 0,
        remainingCount: finalRemaining.length,
        message: finalRemaining.length === 0 ? 'Todas as notificações foram paradas!' : `Ainda restam ${finalRemaining.length} notificações`
      };
    }
    
    console.log('🎉 SUCESSO! Todas as notificações foram paradas!');
    return {
      success: true,
      remainingCount: 0,
      message: 'Todas as notificações foram paradas com sucesso!'
    };
    
  } catch (error) {
    console.error('❌ Erro crítico ao parar notificações:', error);
    return {
      success: false,
      error: error,
      message: 'Erro crítico durante a parada de emergência'
    };
  }
}

/**
 * Reinicia o sistema de notificações do zero
 */
export async function restartNotificationSystem() {
  console.log('🔄 REINICIANDO SISTEMA DE NOTIFICAÇÕES...');
  
  try {
    // 1. Para tudo primeiro
    await stopAllNotificationsNow();
    
    // 2. Aguarda um pouco
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. Verifica permissões
    const permissions = await Notifications.getPermissionsAsync();
    console.log('🔐 Permissões:', permissions);
    
    // 4. Reconfigura o handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    
    console.log('✅ Sistema de notificações reiniciado!');
    return {
      success: true,
      message: 'Sistema reiniciado com sucesso!'
    };
    
  } catch (error) {
    console.error('❌ Erro ao reiniciar sistema:', error);
    return {
      success: false,
      error: error,
      message: 'Erro durante o reinicio'
    };
  }
}

