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
          className="absolute flex-row gap-4 top-3"
        >
          <Feather name="arrow-left" size={25} color={colors.secondary} />
          <Text className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Voltar
          </Text>
        </TouchableOpacity>
      )}

      <View className="flex-row items-center gap-4 p-2 mx-auto mb-12 bg-gray-500 rounded dark:bg-gray-800">
        {icon && icon}
        <Text className="text-lg font-semibold dark:text-gray-500">
          {title ? title : "Hábitos+"}
        </Text>
      </View>
    </View>
  );
}
