import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { useTheme } from "@/hooks/useTheme";

export interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput> {
  label?: string;
  labelClasses?: string;
  inputClasses?: string;
  icon?: keyof typeof Feather.glyphMap;
  onIconPress?: () => void;
}
const Input = forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  (
    {
      className,
      label,
      labelClasses,
      inputClasses,
      icon,
      onIconPress,
      ...props
    },
    ref
  ) => {
    const { colorScheme } = useTheme();
    const isDarkMode = colorScheme === "dark";

    return (
      <View className={cn("flex flex-col gap-1.5 w-full", className)}>
        {label && (
          <Text
            className={cn(
              "text-base text-neutral-600 dark:text-neutral-300 font-dosis-bold",
              labelClasses
            )}
          >
            {label}
          </Text>
        )}
        <View className="relative">
          <TextInput
            ref={ref}
            placeholderTextColor={isDarkMode ? colors.white : colors.gray}
            className={cn(
              inputClasses,
              `border border-neutral-300 dark:border-neutral-600 py-2.5 px-4 text-neutral-800 dark:text-neutral-200 rounded-lg w-full focus:border-primary bg-white dark:bg-neutral-800 font-dosis-bold text-lg pr-10`
            )}
            {...props}
          />
          {icon && (
            <TouchableOpacity
              onPress={onIconPress}
              className="absolute right-3 top-3"
              hitSlop={10}
            >
              <Feather name={icon} size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);

export { Input };
