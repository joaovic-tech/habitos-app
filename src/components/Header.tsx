import { icon } from "@/constants/icon";
import { colors } from "@/styles/colors";
import { Feather } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View, ViewProps } from "react-native";

type Props = ViewProps & {
  title?: string;
  otherIcon?: React.ReactElement;
  backRouter?: boolean;
};

type AppRouteName =
  | "about"
  | "form"
  | "index"
  | "profile"
  | "settings"
  | "habitDetails"
  | "login"
  | "register"
  | "selectHabit"
  | "_sitemap"
  | "(tabs)";

export function Header({ title, otherIcon, backRouter = false }: Props) {
  const router = useRouter();
  const segments = useSegments();
  let currentRouteName: AppRouteName = segments[
    segments.length - 1
  ] as AppRouteName;

  if (currentRouteName === "(tabs)") {
    currentRouteName = "index";
  }

  return (
    <View className="relative z-50">
      {backRouter && (
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute flex-row gap-4 p-3"
        >
          <Feather name="arrow-left" size={25} color={colors.secondary} />
          <Text className="text-lg font-dosis-medium text-neutral-700 dark:text-neutral-200">
            Voltar
          </Text>
        </TouchableOpacity>
      )}

      <View className="flex-row items-center gap-4 p-2 mx-auto mb-12 rounded bg-neutral-100 dark:bg-neutral-800">
        {otherIcon ??
          (icon[currentRouteName as keyof typeof icon] // Garante que a chave é compatível com as chaves do objeto 'icon'
            ? icon[currentRouteName as keyof typeof icon]({
                size: 28,
                color: colors.secondary,
                isFocused: false,
                isIconHeader: currentRouteName === "index",
              })
            : null)}
        <Text className="text-lg font-dosis-semibold text-secondary">
          {title ? title : "Hábitos+"}
        </Text>
      </View>
    </View>
  );
}
