import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  AccessibilityProps,
} from "react-native";
import { colors } from "@/styles/colors";
import { cn } from "@/lib/utils";

interface CustomSwitchProps extends AccessibilityProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  showLabel?: boolean;
  disabled?: boolean;
  className?: string;
  labelClasses?: string;
}

export function CustomSwitch({
  value,
  onValueChange,
  label,
  showLabel = true,
  disabled = false,
  className = "",
  labelClasses = "",
  ...accessibilityProps
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
    outputRange: [4, 50], // Left position when OFF vs ON
  });

  // Determine custom label text
  const labelText = () => {
    if (label) return label;
    return value ? "ON" : "OFF";
  };

  return (
    <View className={cn("flex-row items-center", className)}>
      {label && !showLabel && (
        <Text
          className={cn(
            "mr-2 text-sm text-neutral-700 dark:text-neutral-300",
            labelClasses
          )}
        >
          {label}
        </Text>
      )}

      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.8}
        onPress={() => !disabled && onValueChange(!value)}
        className="items-center justify-center"
        disabled={disabled}
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled }}
        accessibilityHint={`Alternar para ${value ? "desativado" : "ativado"}`}
        {...accessibilityProps}
      >
        <View
          className={cn(
            "py-5 rounded justify-center px-12 border-2",
            value
              ? "border-blue-500 bg-blue-600"
              : "border-neutral-900 bg-neutral-900",
            disabled && "opacity-50"
          )}
        >
          {showLabel && (
            <Text
              className={cn(
                "text-xs font-bold absolute text-white",
                labelClasses
              )}
              style={{
                left: value ? 8 : "auto",
                right: value ? "auto" : 8,
              }}
            >
              {labelText()}
            </Text>
          )}

          <Animated.View
            className={cn("w-8 h-8 rounded-full bg-neutral-50 absolute")}
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
    </View>
  );
}
