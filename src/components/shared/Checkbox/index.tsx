// Move the existing Checkbox component here
import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { cn } from "@/lib/utils";
import { colors } from "@/styles/colors";

interface CheckboxProps {
  label?: React.ReactNode;
  initialValue?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({
  label,
  initialValue = false,
  onChange,
  className,
}: CheckboxProps) {
  const [checked, setChecked] = useState(initialValue);

  const handlePress = () => {
    const newValue = !checked;
    setChecked(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      className={cn("flex-row items-center", className)}
    >
      <View
        className={cn(
          "w-5 h-5 justify-center items-center rounded-md border",
          checked ? "bg-blue-600 border-blue-600" : "border-neutral-400"
        )}
      >
        {checked && <Feather name="check" size={14} color={"#FFFAFF"} />}
      </View>
      {label && (
        <View className="ml-2">
          {typeof label === "string" ? (
            <Text className="text-sm text-neutral-700 font-dosis-semibold dark:text-neutral-300">
              {label}
            </Text>
          ) : (
            label
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
