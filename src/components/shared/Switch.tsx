import { colors } from "@/styles/colors";
import { Switch as NativeSwitch, useColorScheme } from "react-native";

function Switch({
  ...props
}: React.ComponentPropsWithoutRef<typeof NativeSwitch>) {
  const colorScheme = useColorScheme();

  const colorTheme = colorScheme === "dark" ? "#FFFAFF" : "#121214";

  const trackColor = props.trackColor || {
    false: "#4B4C50",
    true: "#4B4C50",
  };
  const thumbColor = props.thumbColor || colorTheme;
  const ios_backgroundColor = props.ios_backgroundColor || colorTheme;

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
