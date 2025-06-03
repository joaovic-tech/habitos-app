import "@/styles/global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  SafeAreaView,
  ActivityIndicator,
  View,
  Text,
  Image,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { colors } from "@/styles/colors";
import { 
  Dosis_400Regular,
  Dosis_500Medium,
  Dosis_600SemiBold,
  Dosis_700Bold
} from '@expo-google-fonts/dosis';

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    Dosis_400Regular,
    Dosis_500Medium,
    Dosis_600SemiBold,
    Dosis_700Bold,
    ...FontAwesome.font,
  });

  const { loading } = useTheme();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || loading) {
    return (
      <View className="flex-1 items-center text-center justify-center bg-gray-200 dark:bg-gray-900">
        <Image
          source={require("../../assets/images/icon.png")}
          style={{ width: 100, height: 100, marginTop: 20 }}
        />
        <ActivityIndicator size={50} color={colors.primary} className="mt-28" />
        <Text className="text-gray-700 dark:text-gray-300">Loading...</Text>
      </View>
    );
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <SafeAreaView className="flex-1">
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            statusBarHidden: false,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
