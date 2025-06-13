import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  label: string | React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "destructive" | "ghost";
  labelClasses?: string;
  className?: string;
  icon?: any;
}

export function Button({
  label,
  variant = "primary",
  labelClasses = "",
  className = "",
  icon,
  ...props
}: ButtonProps) {
  // Define button styles based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 border-2 border-blue-500";
      case "secondary":
        return "bg-secondary";
      case "outline":
        return "bg-transparent border border-blue-600";
      case "destructive":
        return "bg-red-600 border border-red-400";
      case "ghost":
        return "bg-neutral-800 dark:bg-neutral-200";
      default:
        return "bg-blue-600";
    }
  };

  // Define text styles based on variant
  const getTextStyle = () => {
    switch (variant) {
      case "outline":
        return "text-blue-600";
      case "ghost":
        return "text-neutral-200 dark:text-neutral-800";
      default:
        return "text-white";
    }
  };

  return (
    <TouchableOpacity
      className={`w-full shadow-sm flex-row dark:shadow-none py-3 rounded-lg items-center justify-center gap-4 ${getButtonStyle()} ${className}`}
      activeOpacity={0.8}
      {...props}
      disabled={props.disabled}
    >
      <Text
        className={`font-dosis-bold text-lg ${getTextStyle()} ${labelClasses}`}
      >
        {label}
      </Text>
      {icon && <>{icon}</>}
    </TouchableOpacity>
  );
}
