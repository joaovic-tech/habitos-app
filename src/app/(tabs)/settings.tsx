import { Switch } from "@/components/shared/Switch";
import { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearHabits, ITEMS_STORAGE_KEY } from "@/storage/habitsStorage";
import { colors } from "@/styles/colors";
import { useToast } from "@/components/shared/Toast";
import { Header } from "@/components/shared/Header";
import { Feather } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/shared/Button";

export default function Tab() {
  const {
    colorScheme,
    toggleTheme,
    loading,
    isAnimationEnabled, // Obter do hook
    toggleAnimation, // Obter do hook
  } = useTheme();
  const isDarkMode = colorScheme === "dark";
  const { toast } = useToast();

  // Animation for icon
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isAnimationEnabled) {
      // Usar isAnimationEnabled do hook
      rotation.setValue(1);
      scale.setValue(1);
      return;
    }
    rotation.setValue(0);
    scale.setValue(0.85);
    Animated.parallel([
      Animated.timing(rotation, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [colorScheme, isAnimationEnabled, rotation, scale]); // Adicionar isAnimationEnabled, rotation e scale às dependências

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Estado para feedback de exclusão
  const [deleting, setDeleting] = useState(false);

  // Função para excluir todos os hábitos
  const handleDeleteAllHabits = async () => {
    setDeleting(true);
    const storedHabits = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
    if (!storedHabits || JSON.parse(storedHabits).length === 0) {
      toast("Nenhum hábito encontrado para excluir.", "info");
      setDeleting(false);
      return;
    }

    Alert.alert(
      "Excluir todos os hábitos",
      "Tem certeza que deseja excluir todos os seus hábitos? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => setDeleting(false),
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await clearHabits();
              if (success) {
                setTimeout(() => {
                  toast(
                    "Todos os hábitos foram excluídos com sucesso!",
                    "success"
                  );
                }, 1000);
              } else {
                setTimeout(() => {
                  toast(
                    "Ocorreu um erro ao excluir os hábitos. Tente novamente.",
                    "destructive"
                  );
                }, 1000);
              }
            } catch (error) {
              console.error("Erro ao excluir hábitos:", error);
              setTimeout(() => {
                toast(
                  "Ocorreu um erro inesperado. Tente novamente.",
                  "destructive"
                );
              }, 1000);
            } finally {
              setTimeout(() => {
                setDeleting(false);
              }, 1000);
            }
          },
        },
      ]
    );
  };

  if (loading) return null;

  const starImageSource =
    colorScheme === "dark"
      ? require("@/assets/Star.png")
      : require("@/assets/Star-dark.png");

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 px-6 pt-safe bg-neutral-200 dark:bg-neutral-900">
        <Image
          source={starImageSource}
          className="absolute top-0 right-0 w-screen h-screen"
          resizeMode="stretch"
        />

        <Header title="Configurações" />

        <Animated.View
          style={{
            transform: [{ rotate }, { scale }],
          }}
          className="items-center justify-center p-6"
        >
          <Feather
            name={isDarkMode ? "moon" : "sun"}
            size={100}
            weight="duotone"
            color={isDarkMode ? colors.moonIcon : colors.sunIcon}
          />
        </Animated.View>

        <View className="relative flex-col items-center w-full gap-8 p-6 bg-white shadow-lg rounded-2xl dark:bg-neutral-800">
          <Text className="text-2xl font-dosis-bold text-neutral-900 dark:text-white">
            Configurações
          </Text>
          <View className="w-full border-2 bg-neutral-200 dark:bg-neutral-900 border-neutral-400 dark:border-neutral-600 rounded-xl">
            <View className="flex-row items-center justify-between w-full p-4 rounded-xl">
              <Text className="text-lg font-dosis-semibold text-neutral-800 dark:text-neutral-200">
                Modo {isDarkMode ? "Escuro" : "Claro"}
              </Text>
              <Switch onValueChange={toggleTheme} value={isDarkMode} />
            </View>
            <View className="w-full h-1 bg-neutral-400 dark:bg-neutral-600" />
            <View className="flex-row items-center justify-between w-full p-4 rounded-xl">
              <Text className="text-lg font-dosis-semibold text-neutral-800 dark:text-neutral-200">
                Animações
              </Text>
              <Switch
                onValueChange={toggleAnimation}
                value={isAnimationEnabled}
              />
            </View>
          </View>

          <Button
            label={
              !deleting ? (
                "Excluir todos os hábitos"
              ) : (
                <ActivityIndicator size="small" color="#fff" />
              )
            }
            variant="ghost"
            onPress={handleDeleteAllHabits}
            disabled={deleting}
            className={`${deleting && "pointer-events-none opacity-50"}`}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
