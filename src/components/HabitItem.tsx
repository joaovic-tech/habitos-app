import { colors } from "@/styles/colors";
import { Feather } from "@expo/vector-icons";
import { FeatherIconName } from "@/types/feather-icons";
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
      className={`h-36 w-36 m-2 flex-1 transition-all duration-200 active:scale-95 ${
        selected ? "z-50" : ""
      }`}
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: selected ? 6 : 2,
      }}
    >
      <Animated.View
        style={{ transform: [{ scale }] }}
        className={`flex-1 p-3 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-200 bg-white dark:bg-gray-800 ${
          selected
            ? "border-primary ring-2 ring-primary/30"
            : "border-gray-200 dark:border-gray-700"
        }`}
      >
        {selected && (
          <Feather
            name="check"
            size={32}
            color={colors.primary}
            className="absolute top-2 right-2"
          />
        )}
        <Text className="mb-1 text-base font-bold text-center text-gray-900 dark:text-white">
          {name}
        </Text>
        <Text className="text-xs text-center text-gray-500 dark:text-gray-400">
          {description}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
