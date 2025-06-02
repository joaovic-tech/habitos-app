import React, { useEffect } from "react";

import { View, Text, TouchableOpacity, Animated } from "react-native";

import { colors } from "@/styles/colors";

import { CustomSwitch } from "@/components/CustomSwitch";

import { Feather } from "@expo/vector-icons";

import { animateValue } from "@/utils/animations";

export type HabitItem = {
  id: string;

  title: string;

  description: string;

  time: string;

  enabled: boolean;
};

type HabitCardProps = {
  item: HabitItem;

  onToggle: (id: string) => void;

  onDelete: (id: string) => void;

  isNew?: boolean;

  animationStyle?: any;
};

export function HabitCard({
  item,

  onToggle,

  onDelete,

  isNew = false,

  animationStyle,
}: HabitCardProps) {
  // Animation values

  const opacity = React.useRef(new Animated.Value(isNew ? 0 : 1)).current;

  const translateY = React.useRef(new Animated.Value(isNew ? -50 : 0)).current;

  const scale = React.useRef(new Animated.Value(isNew ? 0.8 : 1)).current;

  useEffect(() => {
    if (isNew) {
      // Start with 0 opacity and translate

      animateValue(opacity, 1, 500);

      animateValue(translateY, 0, 600);

      animateValue(scale, 1, 500);
    }
  }, [isNew, opacity, translateY, scale]);

  const animatedStyle = {
    opacity,

    transform: [{ translateY }, { scale }],
  };

  return (
    <Animated.View
      className={`w-full mb-3 rounded-lg border border-gray-800 ${
        isNew ? "bg-primary" : "bg-gray-700"
      } ${item.enabled ? "border-gray-600" : "border-gray-800 opacity-0"}`}
      style={[
        { opacity: item.enabled ? 1 : 0.5 },

        isNew ? animatedStyle : animationStyle,
      ]}
    >
      <View className="flex-row items-center justify-between p-3 bg-gray-800">
        <View className="flex-1">
          <Text className="text-white font-medium text-base">
            {item.title} - {item.time}
          </Text>

          <Text className="text-gray-400 text-xs">{item.description}</Text>
        </View>

        <View className="flex-row items-center gap-4">
          <CustomSwitch
            value={item.enabled}
            onValueChange={() => onToggle(item.id)}
            showLabel={true}
          />

          <TouchableOpacity
            className="bg-red-600 rounded-md p-2 border-2 border-red-500"
            onPress={() => onDelete(item.id)}
          >
            <Feather name="trash-2" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
