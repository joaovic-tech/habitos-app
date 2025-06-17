import { View, Text, Image } from "react-native";
import { Button } from "./shared/Button";
import { colorScheme } from "nativewind";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { requestPermissionsAsync } from "@/services/NotificationService";
import { saveConfig, getConfig } from "@/storage/configStorage";
import { router } from "expo-router";

interface PermissionScreenProps {
  onPermissionGranted: () => void;
}

export function PermissionScreen({
  onPermissionGranted,
}: PermissionScreenProps) {
  const starImageSource =
    colorScheme.get() === "dark"
      ? require("@/assets/Star.png")
      : require("@/assets/Star-dark.png");

  const handleRequestPermissions = async () => {
    const status = await requestPermissionsAsync();
    try {
      // Obtém as configurações atuais para não sobrescrever outras configurações
      const currentConfig = await getConfig();

      if (status.granted) {
        // Salva a permissão nas configurações mantendo outras configs
        await saveConfig({
          ...currentConfig,
          permissionNotification: true,
        });
        // Notifica o componente pai que a permissão foi concedida
        onPermissionGranted();
      } else {
        console.log("Permissão negada para notificações.");
        // Salva que o usuário negou a permissão
        await saveConfig({
          ...currentConfig,
          permissionNotification: false,
        });
        // Não recarrega mais a página, deixa o fluxo natural do layout acontecer
        onPermissionGranted(); // Isso fará o layout decidir o que mostrar
      }
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-neutral-200 dark:bg-neutral-900">
        <Image
          source={starImageSource}
          className="absolute top-0 right-0 w-screen h-screen opacity-50"
          resizeMode="stretch"
        />
        <View className="items-center justify-start flex-1 gap-6 px-6">
          <Text className="text-4xl text-center text-neutral-800 dark:text-neutral-100 font-dosis-bold">
            Bem vindo ao App Hábitos
          </Text>

          <Text className="text-base text-center text-neutral-600 dark:text-neutral-300 font-dosis">
            Para continuar, permita que o app envie notificações para te ajudar
            a manter seus hábitos em dia.
          </Text>

          <Button
            label="Permitir Notificações"
            variant="primary"
            onPress={async () => handleRequestPermissions()}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
