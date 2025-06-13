import { Switch } from "@/components/Switch";
import { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearHabits, ITEMS_STORAGE_KEY } from "@/storage/habitsStorage";
import { colors } from "@/styles/colors";
import { useToast } from "@/components/shared/Toast";
import { Header } from "@/components/Header";
import { Gear } from "phosphor-react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/shared/Button";

export default function Tab() {
  const { colorScheme, toggleTheme, loading } = useTheme();
  const isDarkMode = colorScheme === "dark";
  const { toast } = useToast();

  // Animation for icon
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
  }, [colorScheme]);

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

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 px-6 pt-safe bg-neutral-200 dark:bg-neutral-900">
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

        <View className="items-center w-full p-6 shadow-lg rounded-2xl bg-white/80 dark:bg-neutral-800/90">
          <Text className="mb-4 text-2xl font-dosis-bold text-neutral-900 dark:text-white">
            Configurações
          </Text>
          <View className="flex-row items-center mb-4">
            <Text className="mr-4 text-lg font-dosis-semibold text-neutral-800 dark:text-neutral-200">
              Modo {isDarkMode ? "escuro" : "claro"}
            </Text>
            <Switch onValueChange={toggleTheme} value={isDarkMode} />
          </View>
          <Text className="mb-6 text-center text-neutral-600 font-dosis-regular dark:text-neutral-400">
            Altere o tema do aplicativo entre claro e escuro para sua
            preferência.
          </Text>

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
