import { Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Tab() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 px-6 bg-neutral-200 dark:bg-neutral-900">
        <Text className="p-2 mx-auto text-center text-white bg-purple-600 rounded-lg font-dosis-bold">
          Form Screen
        </Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
