import { HabitsList } from "@/components/HabitsList";
import { Header } from "@/components/shared/Header";
import { getConfig } from "@/storage/configStorage";
import { allowsNotificationsAsync } from "@/services/NotificationService";
import { colors } from "@/styles/colors";
import { router, useFocusEffect } from "expo-router";
import { colorScheme } from "nativewind";
import { PlusCircle } from "phosphor-react-native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function AlertScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDarkMode = colorScheme.get() === "dark";
  const [hasInfoNotification, setHasInfoNotification] = useState(false);

  // Navigate to habit selection screen
  const handleAddHabit = () => {
    setIsSubmitting(true);
    router.push("/selectHabit");
  };

  // Reset estados
  useFocusEffect(
    useCallback(() => {
      setIsSubmitting(false);
    }, [])
  );

  const InfoPermission = () => {
    return (
      <View className="absolute top-0 z-50 w-screen p-4 bg-yellow-100 border border-yellow-300 rounded-lg dark:bg-yellow-700 dark:border-yellow-600">
        <FlatList
          data={[
            "Este aplicativo precisa de permissão para enviar notificações.",
            "Para que o aplicativo possa te ajudar a manter seus hábitos, é necessário permitir o envio de notificações.",
            "Você pode alterar essa configuração no seu dispositivo indo em Configurações > Aplicativos > Hábitos App > Permissões e ative as permissões de Notificações.",
          ]}
          renderItem={({ item, index }) => (
            <View className="mb-2">
              <Text className="text-base text-yellow-800 dark:text-yellow-100 font-dosis-semibold">
                {index + 1}. {item}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item}
          ItemSeparatorComponent={() => (
            <View className="h-px my-2 bg-yellow-300 dark:bg-yellow-600" />
          )}
        />
        <TouchableOpacity
          onPress={() => setHasInfoNotification(false)}
          className="self-end px-3 py-1 mt-2 bg-yellow-500 rounded-md dark:bg-yellow-600"
        >
          <Text className="font-bold text-white font-dosis-semibold">
            Entendi
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    async function loadUserConfig() {
      try {
        const [userConfig, hasSystemPermission] = await Promise.all([
          getConfig(),
          allowsNotificationsAsync(),
        ]);

        setHasInfoNotification(
          !hasSystemPermission || userConfig.permissionNotification === false
        );
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    }

    loadUserConfig();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-neutral-200 dark:bg-neutral-900">
        <View className="flex-1 px-6">
          <Header title="Hábitos" />
          {hasInfoNotification && <InfoPermission />}

          <TouchableOpacity
            onPress={handleAddHabit}
            disabled={isSubmitting}
            className={`${
              isSubmitting && "pointer-events-none opacity-50"
            } ml-auto mb-2`}
          >
            <PlusCircle
              size={33}
              color={isDarkMode ? colors.white : colors.black}
              weight="duotone"
            />
          </TouchableOpacity>

          <HabitsList />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
