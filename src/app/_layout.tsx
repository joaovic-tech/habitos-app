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
  Dosis_700Bold,
} from "@expo-google-fonts/dosis";
import { ToastProvider } from "@/components/shared/Toast";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
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
      <View className="items-center justify-center flex-1 text-center bg-neutral-100 dark:bg-neutral-900">
        <Image
          source={require("../../assets/images/icon.png")}
          style={{ width: 100, height: 100, marginTop: 20 }}
        />
        <ActivityIndicator size={50} color={colors.primary} className="mt-28" />
        <Text className="text-neutral-700 dark:text-neutral-200">
          Loading...
        </Text>
      </View>
    );
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { loading, colorScheme } = useTheme();

  return (
    <ToastProvider>
      <SafeAreaView className="flex-1 bg-neutral-200 dark:bg-neutral-800">
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              statusBarStyle: colorScheme === "dark" ? "light" : "dark",
            }}
          />
        </Stack>
      </SafeAreaView>
    </ToastProvider>
  );
}
