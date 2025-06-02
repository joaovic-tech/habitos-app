import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { colors } from "@/styles/colors";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: "primary" | "secondary" | "outline";
  labelClasses?: string;
}

function Button({
  label,
  variant = "primary",
  labelClasses = "",
  className = "",
  ...props
}: ButtonProps) {
  // Define button styles based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return "bg-primary";
      case "secondary":
        return "bg-secondary";
      case "outline":
        return "bg-transparent border border-primary";
      default:
        return "bg-primary";
    }
  };

  // Define text styles based on variant
  const getTextStyle = () => {
    return variant === "outline" ? "text-primary" : "text-white";
  };

  return (
    <TouchableOpacity
      className={`w-full shadow shadow-blue-500 border-2 border-blue-500 py-4 rounded-lg items-center justify-center mb-4 mt-2 ${getButtonStyle()} ${className}`}
      activeOpacity={0.8}
      {...props}
    >
      <Text className={`font-bold text-lg ${getTextStyle()} ${labelClasses}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export { Button };
