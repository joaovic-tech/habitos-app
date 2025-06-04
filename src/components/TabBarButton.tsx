import {
  View,
  Text,
  Pressable,
  useColorScheme,
  LayoutChangeEvent,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { icon } from "../constants/icon";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { colors } from "@/styles/colors";

type RouteName = keyof typeof icon;

interface TabBarButtonProps {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: RouteName;
  label: string;
}

export default function TabBarButton({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  label,
}: TabBarButtonProps) {
  const scale = useSharedValue(0);
  const [containerSize, setContainerSize] = useState({ height: 0, width: 0 });
  const containerRef = useRef<View>(null);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      {
        damping: 12,
        stiffness: 90,
        mass: 0.6,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 2,
      }
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);

    const yOffset =
      containerSize.height > 0 ? -(containerSize.height * 0.4) : -30;
    const top = interpolate(scale.value, [0, 1], [0, yOffset]);

    return {
      transform: [{ scale: scaleValue }, { translateY: top }],
    };
  }, [containerSize.height]);

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [0, 1]);

    return {
      opacity,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className={`z-20 flex-col flex-1 items-center justify-center gap-1 -top-8`}
      onLayout={onLayout}
      ref={containerRef}
    >
      <Animated.View
        style={animatedIconStyle}
        className="items-center justify-center"
      >
        {icon[routeName]({
          size: 30,
          color: isFocused ? colors.gray[500] : colors.gray[600],
          isFocused,
        })}
      </Animated.View>
      <Animated.Text
        style={[animatedTextStyle]}
        className="items-center m-auto text-base font-bold -bottom-4 text- text-text-light dark:text-gray-500"
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}
