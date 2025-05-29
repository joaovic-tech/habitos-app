import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { cn } from "@/lib/utils";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/styles/colors";

const Input = forwardRef<
  ElementRef<typeof TextInput>,
  ComponentPropsWithoutRef<typeof TextInput> & {
    icon?: keyof typeof Feather.glyphMap;
    onIconPress?: () => void;
    isRequired?: boolean;
    placeholderClassName?: string;
    label?: string;
    labelClasses?: string;
    inputClasses?: string;
  }
>(
  (
    {
      className,
      placeholderClassName,
      icon,
      label,
      labelClasses,
      inputClasses,
      onIconPress,
      ...props
    },
    ref
  ) => {
    return (
      <View className={cn("flex flex-col gap-1.5 w-full", className)}>
        {label && (
          <Text
            className={cn(
              "text-base text-gray-400 dark:text-gray-500",
              labelClasses
            )}
          >
            {label}
          </Text>
        )}
        <View className="relative">
          <TextInput
            ref={ref}
            className={cn(
              inputClasses,
              `border border-gray-400 py-2.5 px-4 dark:text-gray-500 rounded-lg w-full focus:border-primary bg-gray-500 dark:bg-gray-900 font-bold text-lg pr-10`
            )}
            {...props}
          />
          {icon && (
            <TouchableOpacity
              onPress={onIconPress}
              className="absolute right-3 top-3"
              hitSlop={10}
            >
              <Feather name={icon} size={20} color={colors.gray[600]} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);

Input.displayName = "Input";

export { Input };
