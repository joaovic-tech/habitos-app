import { colors } from "@/styles/colors";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  title?: string;
  icon?: React.ReactElement;
  backRouter?: boolean;
};

export function Header({ title, icon, backRouter = false }: Props) {
  return (
    <View className="relative">
      {backRouter && (
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row gap-4 absolute top-3"
        >
          <Feather name="arrow-left" size={25} color={colors.secondary} />
          <Text className="text-gray-800 text-lg font-medium dark:text-gray-200">
            Voltar
          </Text>
        </TouchableOpacity>
      )}

      <View className="items-center px-6 py-3 m-auto bg-gray-500 dark:bg-gray-800 rounded-e-lg">
        <Text className="text-xl font-bold text-secondary">Hábitos+</Text>
      </View>

      {title && (
        <View className="flex-row items-center m-auto mt-16 mb-12 border-spacing-2">
          {icon && (
            <View className="p-2 mr-2 bg-gray-500 rounded dark:bg-gray-800">
              {icon}
            </View>
          )}
          <Text className="text-lg font-semibold dark:text-gray-500">
            {title}
          </Text>
        </View>
      )}
    </View>
  );
}
