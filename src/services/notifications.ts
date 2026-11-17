import * as Notifications from 'expo-notifications';
import { AndroidImportance, AndroidNotificationPriority } from 'expo-notifications';
import { Platform } from 'react-native';

// Configuração do comportamento da notificação enquanto o app está aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'web') return false;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('workout-timer', {
          name: 'Cronômetro de Descanso',
          importance: AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#16A34A',
        });
      } catch (channelErr) {
        console.warn('[Notifications] Canal Android não pôde ser configurado:', channelErr);
      }
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.warn('[Notifications] Permissão de notificação não disponível:', error);
    return false;
  }
};

export const scheduleRestCompleteNotification = async (seconds: number): Promise<string | null> => {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Descanso Finalizado!',
        body: 'Hora de iniciar a próxima série. Vamos pra cima!',
        sound: 'default',
        priority: AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, Math.round(seconds)),
        repeats: false,
      },
    });
    return id;
  } catch (error) {
    console.warn('Erro ao agendar notificação de descanso:', error);
    return null;
  }
};

export const cancelRestNotification = async (notificationId?: string | null) => {
  try {
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  } catch (error) {
    console.warn('Erro ao cancelar notificação:', error);
  }
};

export const scheduleDailyWorkoutReminder = async (hour = 18, minute = 0) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💪 Hora de Treinar!',
        body: 'Seu treino do dia te aguarda no GymFlow. Mantenha o foco!',
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute,
        repeats: true,
      },
    });
  } catch (error) {
    console.warn('Erro ao agendar lembrete diário:', error);
  }
};
