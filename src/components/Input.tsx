import { forwardRef } from 'react';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';

import { cn } from '../lib/utils';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/styles/colors';

export interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput> {
  label?: string;
  labelClasses?: string;
  inputClasses?: string;
  icon?: any;
  onIconPress?: () => void;
  error?: string; // Adicione esta prop
}
const Input = forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, label, labelClasses, inputClasses, icon, onIconPress, error, ...props }, ref) => (
    <View className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && <Text className={cn('text-base text-gray-400 dark:text-gray-500', labelClasses)}>{label}</Text>}
      <View className="relative">
        <TextInput
          ref={ref}
          placeholderTextColor={error ? '#dc2626' : colors.gray[400]}
          className={cn(
            inputClasses,
            `border border-gray-400 py-2.5 px-4 dark:text-gray-500 rounded-lg w-full focus:border-primary ${error && 'border-red-600 focus:border-red-600'} bg-gray-500 dark:bg-gray-900 font-bold text-lg pr-10`
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
      {error && (
        <Text className="mt-1 text-xs text-red-500">{error}</Text>
      )}
    </View>
  )
);

export { Input };