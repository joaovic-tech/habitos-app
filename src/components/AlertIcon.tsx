import React from "react";
import { Image } from "react-native";
import alarmIconLight from "@/assets/alarm.png";
import alarmIconDark from "@/assets/alarm-dark.png";
import { BaseIconProps } from "@/constants/icon";

// Using Pick to select only the properties we need from BaseIconProps
type AlertIconProps = Pick<BaseIconProps, 'size' | 'isFocused'>;

export function AlertIcon({ size = 28, isFocused = false }: AlertIconProps) {
  const iconSource = isFocused ? alarmIconLight : alarmIconDark;

  return (
    <Image
      source={iconSource}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}