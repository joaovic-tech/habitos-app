import {
  View,
  Text,
  Pressable,
  useColorScheme,
  LayoutChangeEvent,
  Dimensions,
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
import { getIconSize, isSmallDevice } from "@/utils/responsive";

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
  const { width: screenWidth } = Dimensions.get("window");
  
  // Tamanhos responsivos baseados no tamanho da tela
  const iconSize = getIconSize(screenWidth);
  const isSmallScreen = isSmallDevice();
  
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
    const scaleValue = interpolate(scale.value, [0, 1], [1, isSmallScreen ? 1.15 : 1.2]);

    // Ajusta o offset vertical baseado no tamanho do container e da tela
    const baseOffset = containerSize.height > 0 ? containerSize.height * 0.47 : 30;
    const responsiveOffset = isSmallScreen ? Math.min(baseOffset, 25) : baseOffset;
    const yOffset = -responsiveOffset;
    const top = interpolate(scale.value, [0, 1], [0, yOffset]);

    return {
      transform: [{ scale: scaleValue }, { translateY: top }],
    };
  }, [containerSize.height, isSmallScreen]);

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
      className={`z-20 flex-col flex-1 items-center justify-center ${
        isSmallScreen ? "gap-0.5" : "gap-1"
      } top-0 min-h-0`}
      onLayout={onLayout}
      ref={containerRef}
      style={{ minWidth: isSmallScreen ? 60 : 70 }}
    >
      <Animated.View
        style={animatedIconStyle}
        className="items-center justify-center"
      >
        {icon[routeName]({
          size: iconSize,
          color: isFocused ? "#fafafa" : "#6d6e71",
          isFocused,
        })}
      </Animated.View>
      <Animated.Text
        style={[animatedTextStyle]}
        className={`items-center m-auto ${
          isSmallScreen ? "text-xs" : "text-sm"
        } font-bold top-0 ${
          isFocused
            ? "text-primary dark:text-primary"
            : "text-neutral-500 dark:text-neutral-400"
        }`}
        numberOfLines={1}
        adjustsFontSizeToFit={isSmallScreen}
        minimumFontScale={0.8}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}
