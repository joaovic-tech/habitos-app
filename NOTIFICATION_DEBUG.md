# 🔧 Debug de Notificações

## Comandos para testar no console:

```javascript
// Importar o gerenciador
import { notificationLifecycleManager } from './src/services/NotificationLifecycleService';

// Ver notificações ativas
console.log(notificationLifecycleManager.getActiveNotifications());

// Cancelar todas as notificações de um hábito
await notificationLifecycleManager.cancelHabitNotifications('ID_DO_HABITO');

// Limpar notificações antigas
await notificationLifecycleManager.cleanupOldNotifications();

// Verificar se hábito tem notificação ativa
notificationLifecycleManager.hasActiveNotificationForHabit('ID_DO_HABITO');
```

## Como monitorar:

1. **Abra o console** do Metro/Expo
2. **Crie um hábito** com horário próximo
3. **Observe os logs**:
   - `🔔 Notificação recebida`
   - `📝 Notificação registrada`
   - `🗑️ Notificação cancelada (timeout)` após 1 minuto

## Comportamentos esperados:

### ✅ Notificação aparece:
- Sistema registra automaticamente
- Inicia timer de 1 minuto
- Logs mostram registro

### ✅ Após 1 minuto:
- Notificação desaparece automaticamente
- Log mostra "cancelada (timeout)"
- Remove da lista ativa

### ✅ Se usuário toca:
- Notificação desaparece imediatamente
- Log mostra "cancelada (user_interaction)"
- Cancela o timer

### ✅ Prevenção de duplicatas:
- Mesmo ID = cancela anterior
- Não acumula notificações
- Limpeza automática

## Problemas comuns:

### Notificações não cancelam:
1. Verifique se o serviço foi inicializado
2. Confirme se os IDs estão corretos
3. Verifique permissões de notificação

### Múltiplas notificações:
1. IDs únicos resolvem duplicatas
2. Timeout de 1 minuto limita acúmulo
3. Limpeza automática remove antigas

