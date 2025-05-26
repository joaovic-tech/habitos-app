import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { cn } from '../lib/utils';

// TODO: make controlled (optional)
interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof View> {
  label?: string;
  labelClasses?: string;
  checkboxClasses?: string;
}
function Checkbox({
  label,
  labelClasses,
  checkboxClasses,
  className,
  ...props
}: CheckboxProps) {
  const [isChecked, setChecked] = useState(false);

  const toggleCheckbox = () => {
    setChecked(prev => !prev);
  };

  return (
    <View
      className={cn('flex flex-row items-center gap-2', className)}
      {...props}
    >
      <TouchableOpacity onPress={toggleCheckbox} className='flex flex-row items-center gap-2'>
        <View
          className={cn(
            'w-4 h-4 border border-gray-400 rounded bg-background flex justify-center items-center',
            {
              'border-primary': isChecked,
            },
            checkboxClasses
          )}
        >
          {isChecked && <Text className="text-xs text-primary">✓</Text>}
        </View>
        {label && (
          <Text className={cn('text-gray-600', labelClasses)}>{label}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export { Checkbox };
