import { colors } from '@/styles/colors';
import { Switch as NativeSwitch, useColorScheme } from 'react-native';

function Switch({
  ...props
}: React.ComponentPropsWithoutRef<typeof NativeSwitch>) {
  const colorScheme = useColorScheme();

  const colorTheme = colorScheme === 'dark' ? colors.gray[500] : colors.gray[900];

  const trackColor = props.trackColor || {
    false: colors.gray[400],
    true: colors.gray[400],
  };
  const thumbColor = props.thumbColor || colorTheme;
  const ios_backgroundColor =
    props.ios_backgroundColor || colorTheme;

  return (
    <NativeSwitch
      trackColor={trackColor}
      thumbColor={thumbColor}
      ios_backgroundColor={ios_backgroundColor}
      {...props}
    />
  );
}

export { Switch };
