import { Image } from "react-native";
import alarmIconLight from "@/assets/alarm.png";
import alarmIconDark from "@/assets/alarm-dark.png";
import alarmHeader from "@/assets/alarmHeader.png";
import { BaseIconProps } from "@/constants/icon";

// Using Pick to select only the properties we need from BaseIconProps
type AlertIconProps = Pick<
  BaseIconProps,
  "size" | "isFocused" | "isIconHeader"
>;

export function AlertIcon({
  size = 28,
  isFocused = false,
  isIconHeader = false,
}: AlertIconProps) {
  const iconSource = isFocused ? alarmIconLight : alarmIconDark;

  return (
    <Image
      source={isIconHeader ? alarmHeader : iconSource}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}
