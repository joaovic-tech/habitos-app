import { Switch } from "@/components/Switch";
import { Feather } from "@expo/vector-icons";
import React, { useRef, useEffect } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export default function Tab() {
  const { colorScheme, toggleTheme, loading } = useTheme();
  const isDarkMode = colorScheme === "dark";

  // Animated value for rotation
  const rotation = useRef(new Animated.Value(0)).current;

  // Animate rotation when colorScheme changes
  useEffect(() => {
    rotation.setValue(0);
    Animated.timing(rotation, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [colorScheme]);

  // Interpolate rotation value to degrees
  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (loading) return null; // Evita flicker enquanto carrega o tema salvo

  return (
    <View className="items-center justify-center flex-1 px-6 bg-gray-200 gap-14 dark:bg-gray-900">
      <Animated.View style={{ transform: [{ rotate }] }}>
        {isDarkMode ? (
          <Feather name="moon" size={100} color="white" />
        ) : (
          <Feather name="sun" size={100} color="black" />
        )}
      </Animated.View>

      <View className="items-center w-full max-w-md p-6 text-center bg-gray-500 rounded-lg shadow-md dark:bg-gray-800">
        <Text className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Configurações
        </Text>
        <View className="flex-row items-center mb-2">
          <Text className="mr-4 text-lg text-gray-800 dark:text-gray-200">
            Modo {isDarkMode ? "escuro" : "claro"}
          </Text>
          <Switch onValueChange={toggleTheme} value={isDarkMode} />
        </View>
        <Text className="text-center text-gray-600 dark:text-gray-400">
          Altere o tema do aplicativo entre claro e escuro.
        </Text>
      </View>
    </View>
  );
}
