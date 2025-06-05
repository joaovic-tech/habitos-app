import { colors } from "@/styles/colors";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Constants from "expo-constants";

type Props = {
  title?: string;
  icon?: React.ReactElement;
  backRouter?: boolean;
};

export function Header({ title, icon, backRouter = false }: Props) {
  const statusBarHeight = Constants.statusBarHeight || 0;

  return (
    <View style={{ paddingTop: statusBarHeight }} className="relative">
      {backRouter && (
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute flex-row gap-4 p-3 top-3"
        >
          <Feather name="arrow-left" size={25} color={colors.secondary} />
          <Text className="text-lg font-medium text-neutral-700 dark:text-neutral-200">
            Voltar
          </Text>
        </TouchableOpacity>
      )}

      <View className="flex-row items-center gap-4 p-2 mx-auto mb-12 bg-neutral-100 rounded dark:bg-neutral-800">
        {icon && icon}
        <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
          {title ? title : "Hábitos+"}
        </Text>
      </View>
    </View>
  );
}
