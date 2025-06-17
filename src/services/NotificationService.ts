import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "App hábitos com notificações agora em funcionamento",
    },
    trigger: null,
  });
}

export {
  allowsNotificationsAsync,
  requestPermissionsAsync,
  schedulePushNotification,
};
