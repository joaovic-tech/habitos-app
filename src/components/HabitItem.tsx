import { colors } from "@/styles/colors";
import { Feather } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { TouchableOpacity, Text, Animated } from "react-native";

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
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
        className={`flex-1 p-3 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-200 bg-white dark:bg-neutral-800 ${
          selected
            ? "border-blue-600 ring-2 ring-blue-600/30"
            : "border-neutral-200 dark:border-neutral-700"
        }`}
      >
        {selected && (
          <Feather
            name="check"
            size={32}
            color={colors.black}
            className="absolute top-2 right-2"
          />
        )}
        <Text className="mb-1 text-base text-center font-dosis-bold text-neutral-900 dark:text-white">
          {name}
        </Text>
        <Text className="text-xs text-center font-dosis-semibold text-neutral-600 dark:text-neutral-300">
          {description}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
