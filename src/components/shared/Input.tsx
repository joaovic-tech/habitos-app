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
              "text-base text-neutral-600 dark:text-neutral-300",
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
              `border border-neutral-300 dark:border-neutral-600 py-2.5 px-4 text-neutral-800 dark:text-neutral-200 rounded-lg w-full focus:border-primary bg-white dark:bg-neutral-800 font-bold text-lg pr-10`
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

Input.displayName = "Input";

export { Input };
