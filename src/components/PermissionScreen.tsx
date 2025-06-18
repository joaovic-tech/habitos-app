import { View, Text, Image } from "react-native";
import { Button } from "./shared/Button";
import { colorScheme } from "nativewind";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { requestPermissionsAsync } from "@/services/NotificationService";
import { saveConfig, getConfig } from "@/storage/configStorage";

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
      const currentConfig = await getConfig();
      if (status.granted) {
        await saveConfig({
          ...currentConfig,
          permissionNotification: true,
        });
        onPermissionGranted();
      } else {
        await saveConfig({
          ...currentConfig,
          permissionNotification: false,
        });
        onPermissionGranted();
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
          className="absolute top-0 right-0 w-screen h-screen opacity-40"
          resizeMode="cover"
        />
        <View className="items-center justify-center flex-1 px-6">
          <View className="items-center w-full max-w-xl gap-8 p-8 border border-blue-100 shadow-lg bg-white/80 dark:bg-neutral-800/80 rounded-3xl dark:border-neutral-700">
            <View className="relative items-center w-20 h-20">
              <View className="absolute items-center w-20 h-20 p-2 text-center bg-blue-600 rounded-lg animate-bounce">
                <Text className="m-auto text-5xl text-white">H</Text>
              </View>
            </View>

            <Text className="text-4xl tracking-tight text-center text-blue-600 font-dosis-bold">
              Bem-vindo ao App Hábitos
            </Text>
            <Text className="mb-2 text-lg text-center text-neutral-700 dark:text-neutral-200 font-dosis">
              Para continuar, permita que o app envie notificações para te
              ajudar a manter seus hábitos em dia.
            </Text>
            <Button
              label="Permitir Notificações"
              variant="primary"
              className="mt-2 shadow-md shadow-blue-300 dark:shadow-blue-900"
              onPress={handleRequestPermissions}
            />
            <Text className="mt-2 text-xs text-center text-neutral-500 dark:text-neutral-400">
              Você pode alterar essa permissão depois nas configurações do seu
              dispositivo.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
