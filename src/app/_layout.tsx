import "@/styles/global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, Image } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { colors } from "@/styles/colors";
import { getConfig, saveConfig } from "@/storage/configStorage"; // Adicionar saveConfig
import {
  Dosis_400Regular,
  Dosis_500Medium,
  Dosis_600SemiBold,
  Dosis_700Bold,
} from "@expo-google-fonts/dosis";
import { ToastProvider } from "@/components/shared/Toast";
import { PermissionScreen } from "@/components/PermissionScreen";
import { allowsNotificationsAsync } from "@/services/NotificationService";
import { getAll as getAllHabits } from "@/storage/habitsStorage";
import { cancelAllNotifications } from "@/services/HabitSchedulerService";

// Inicializa o gerenciador de ciclo de vida das notificações
import "@/services/NotificationLifecycleService";

// Inicializa o debugger de notificações (dev only)
import "@/utils/notificationDebugger";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Dosis_400Regular,
    Dosis_500Medium,
    Dosis_600SemiBold,
    Dosis_700Bold,
    ...FontAwesome.font,
  });
  const [hasPermissionNotification, setHasPermissionNotification] =
    useState(false);

  const { loading } = useTheme();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    async function loadUserConfig() {
      try {
        // Limpa notificações órfãs se não houver hábitos na inicialização
        const habits = await getAllHabits();
        if (habits.length === 0) {
          await cancelAllNotifications();
        }

        const [userConfig, permissionSystem] = await Promise.all([
          getConfig(),
          allowsNotificationsAsync(),
        ]);

        const permissionNotificationSaved = userConfig.permissionNotification;
        const isPermitted = permissionNotificationSaved || permissionSystem;
        const isPermissionInitialized = permissionNotificationSaved === null;

        if (isPermissionInitialized) {
          setHasPermissionNotification(false);
          return;
        }

        if (isPermitted) {
          setHasPermissionNotification(true);

          // Se o usuário tem permissão do sistema, atualiza o AsyncStorage e o estado
          await saveConfig({
            ...userConfig,
            permissionNotification: permissionSystem,
          });
          return;
        }

        if (!isPermitted) {
          setHasPermissionNotification(true);
          return;
        }

        // Caso padrão (não deve chegar aqui, mas mantemos por segurança)
        setHasPermissionNotification(false);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        setHasPermissionNotification(false);
      }
    }

    loadUserConfig();
  }, []);

  if (!loaded || loading) {
    return (
      <View className="items-center justify-center flex-1 text-center bg-neutral-100 dark:bg-neutral-900">
        <Image
          source={require("../../assets/images/icon.png")}
          style={{ width: 100, height: 100, marginTop: 20 }}
        />
        <ActivityIndicator size={50} color={colors.primary} className="mt-28" />
        <Text className="text-neutral-700 dark:text-neutral-200 font-dosis-bold">
          Loading...
        </Text>
      </View>
    );
  }

  if (!hasPermissionNotification) {
    return (
      <PermissionScreen
        onPermissionGranted={() => setHasPermissionNotification(true)}
      />
    );
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { colorScheme } = useTheme();

  return (
    <ToastProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            statusBarStyle: colorScheme === "dark" ? "light" : "dark",
          }}
        />
      </Stack>
    </ToastProvider>
  );
}
