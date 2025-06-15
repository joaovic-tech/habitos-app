import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { Header } from "./shared/Header";
import { colorScheme } from "nativewind";
import { PencilSimpleLine, StackPlus } from "phosphor-react-native";
import { colors } from "@/styles/colors";

type StackScreenProps = {
  title: string;
};

export default function StackScreen({ title }: StackScreenProps) {
  const isScreenEditOrCreate =
    title === "Editar Hábito" || title === "Criar Hábito";
  const animationType = isScreenEditOrCreate
    ? "slide_from_right"
    : "slide_from_bottom";
  const icon = isScreenEditOrCreate ? (
    <StackPlus size={24} weight="duotone" color={colors.secondary} />
  ) : (
    <PencilSimpleLine size={24} weight="duotone" color={colors.secondary} />
  );

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        animation: animationType,
        statusBarStyle: colorScheme.get() === "dark" ? "light" : "dark",
        headerBackground: () => (
          <View className="flex-1 pt-safe-offset-4 bg-neutral-200 dark:bg-neutral-900">
            <Header backRouter={true} title={title} otherIcon={icon} />
          </View>
        ),
      }}
    />
  );
}
