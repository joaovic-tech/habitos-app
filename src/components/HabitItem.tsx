import { colors } from "@/styles/colors";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, Text, View, Animated } from "react-native";

type HabitItemProps = {
  name: string;
  description: string;
  selected?: boolean;
  onSelect?: () => void;
};

export function HabitItem({
  name,
  description,
  selected = false,
  onSelect,
}: HabitItemProps) {
  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    try {
      const animation = Animated.spring(scale, {
        toValue: selected ? 1 : 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      });
      animation.start();
      return () => {
        animation.stop();
      };
    } catch (error) {
      console.error("Animation error:", error);
    }
  }, [selected, scale]);

  return (
    <TouchableOpacity
      onPress={() => {
        if (onSelect) onSelect();
      }}
      className={`w-36 h-36 ${selected && "z-50"}`}
      activeOpacity={0.8}
    >
      <Animated.View
        style={{ transform: [{ scale }] }}
        className={`flex-1 p-3 rounded-lg ${
          selected
            ? "border-primary border"
            : "border border-gray-200 dark:border-gray-700"
        } flex flex-col items-center justify-center bg-white dark:bg-gray-800`}
      >
        {selected && (
          // Icon check
          <Feather
            name="check"
            size={35}
            color={colors.primary}
            className="absolute top-0 -right-4"
          />
        )}

        <Text
          className="text-sm font-bold text-gray-800 dark:text-white mb-1 text-center"
          numberOfLines={2}
        >
          {name}
        </Text>
        <Text
          className="text-xs text-gray-600 dark:text-gray-400 text-center"
          numberOfLines={3}
        >
          {description}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
