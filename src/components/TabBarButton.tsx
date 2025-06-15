import { View, Pressable, LayoutChangeEvent, Dimensions } from "react-native";
import { useEffect, useState, useRef } from "react";
import { icon } from "../constants/icon";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { getIconSize, isSmallDevice } from "@/utils/screenUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CONFIG_STORAGE_KEY, ConfigUser } from "@/storage/configStorage";

type RouteName = keyof typeof icon;

interface TabBarButtonProps {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: RouteName;
}

export default function TabBarButton({
  onPress,
  onLongPress,
  isFocused,
  routeName,
}: TabBarButtonProps) {
  const scale = useSharedValue(0);
  const [containerSize, setContainerSize] = useState({ height: 0, width: 0 });
  const containerRef = useRef<View>(null);
  const { width: screenWidth } = Dimensions.get("window");
  const [animationEnabled, setAnimationEnabled] = useState<boolean>();

  // Tamanhos responsivos baseados no tamanho da tela
  const iconSize = getIconSize(screenWidth);
  const isSmallScreen = isSmallDevice();

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  useEffect(() => {
    Promise.resolve(AsyncStorage.getItem(CONFIG_STORAGE_KEY)).then((value) => {
      const config: ConfigUser = value ? JSON.parse(value) : {};
      setAnimationEnabled(config.animation);
    });
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      {
        duration: animationEnabled ? 1000 : 0,
        dampingRatio: 0.5,
        stiffness: 100,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      }
    );
  }, [scale, isFocused, animationEnabled]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(
      scale.value,
      [0, 1],
      [1, isSmallScreen ? 1.15 : 1.2]
    );

    // Ajusta o offset vertical baseado no tamanho do container e da tela
    const baseOffset =
      containerSize.height > 0 ? containerSize.height * 0.47 : 30;
    const responsiveOffset = isSmallScreen
      ? Math.min(baseOffset, 25)
      : baseOffset;
    const yOffset = -responsiveOffset;
    const top = interpolate(scale.value, [0, 1], [0, yOffset]);

    return {
      transform: [{ scale: scaleValue }, { translateY: top }],
    };
  }, [containerSize.height, isSmallScreen]);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className={`z-20 flex-col flex-1 items-center justify-center ${
        isFocused && "-top-3"
      } min-h-0`}
      onLayout={onLayout}
      ref={containerRef}
    >
      <Animated.View
        style={animatedIconStyle}
        className="items-center justify-center"
      >
        {icon[routeName]({
          size: isFocused ? iconSize * 1.3 : iconSize,
          color: isFocused ? "#fafafa" : "#6d6e71",
          isFocused,
        })}
      </Animated.View>
    </Pressable>
  );
}
