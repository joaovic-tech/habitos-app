import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { colors } from "@/styles/colors";

type CustomSwitchProps = {
  value: boolean;
  onValueChange: () => void;
  showLabel?: boolean;
};

export function CustomSwitch({
  value,
  onValueChange,
  showLabel = true,
}: CustomSwitchProps) {
  // Animation value for the thumb position
  const thumbPosition = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  // Update animation when value changes
  useEffect(() => {
    Animated.spring(thumbPosition, {
      toValue: value ? 1 : 0,
      bounciness: 4,
      speed: 12,
      useNativeDriver: false,
    }).start();
  }, [value, thumbPosition]);

  // Interpolate position for the thumb
  const thumbLeft = thumbPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 48], // Left position when OFF vs ON
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onValueChange}
      className="justify-center items-center"
    >
      <View
        className={`py-5 rounded justify-center px-12 border-2 ${
          value ? " border-blue-500 bg-primary" : "border-gray-900 bg-gray-900"
        }`}
      >
        {showLabel && (
          <Text
            className="text-xs font-bold absolute"
            style={{
              color: "white",
              left: value ? 8 : "auto",
              right: value ? "auto" : 8,
            }}
          >
            {value ? "ON" : "OFF"}
          </Text>
        )}

        <Animated.View
          className="w-8 h-8 rounded-full bg-white absolute"
          style={[
            { left: thumbLeft },
            {
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}
