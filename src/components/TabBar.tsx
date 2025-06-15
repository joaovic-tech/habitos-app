import { View, type LayoutChangeEvent, Dimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import TabBarButton from "./TabBarButton";
import { useEffect, useState } from "react";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getTabBarHeight, isSmallDevice } from "@/utils/screenUtils";
import { CONFIG_STORAGE_KEY, ConfigUser } from "@/storage/configStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const labels = {
  index: "Alertas",
  form: "Responda",
  about: "Sobre",
  profile: "Perfil",
  settings: "Ajustes",
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const [animationEnabled, setAnimationEnabled] = useState<boolean>();

  const updateTabPosition = (
    targetIndex: number,
    availableWidth: number,
    numberOfRoutes: number,
    tabPositionX: SharedValue<number>
  ) => {
    Promise.resolve(AsyncStorage.getItem(CONFIG_STORAGE_KEY)).then((value) => {
      const config: ConfigUser = value ? JSON.parse(value) : {};
      setAnimationEnabled(config.animation);
    });

    const actualButtonWidth = availableWidth / numberOfRoutes;
    tabPositionX.value = withSpring(actualButtonWidth * targetIndex, {
      duration: animationEnabled ? 4000 : 0,
      dampingRatio: 0.5,
      stiffness: 100,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    });
  };

  const buttonWidth = dimensions.width
    ? Math.max(60, Math.min(80, dimensions.width / state.routes.length))
    : Math.max(60, Math.min(80, screenWidth / state.routes.length));

  const onTabbarLayout = (event: LayoutChangeEvent) => {
    setDimensions({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);

  useEffect(() => {
    const availableWidth = dimensions.width || screenWidth;
    updateTabPosition(
      state.index,
      availableWidth,
      state.routes.length,
      tabPositionX
    );
  }, [
    dimensions.width,
    state.index,
    screenWidth,
    state.routes.length,
    tabPositionX,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabPositionX.value }],
  }));

  // Altura responsiva da TabBar usando utilitário
  const tabBarHeight = getTabBarHeight(screenHeight);
  const isSmall = isSmallDevice();

  // Altura total incluindo safe area para dispositivos com notch
  const totalTabBarHeight = tabBarHeight + insets.bottom;

  // Tamanhos responsivos para os elementos da TabBar
  const floatingButtonInnerSize = Math.min(
    buttonWidth * (isSmall ? 0.85 : 0.9),
    isSmall ? 56 : 60
  );
  const floatingButtonSize = floatingButtonInnerSize * 1.5;

  return (
    <View
      onLayout={onTabbarLayout}
      style={{
        height: totalTabBarHeight,
        paddingBottom: insets.bottom,
      }}
      className="bottom-0 flex-row items-center w-full bg-white dark:bg-neutral-800"
    >
      {/* Fundo do botão central */}
      <Animated.View
        style={[
          {
            height: floatingButtonSize,
            width: floatingButtonSize,
            top: -(tabBarHeight * 0.5),
            left: (buttonWidth - floatingButtonSize) / 2,
          },
          animatedStyle,
        ]}
        className="absolute bg-white border-t-8 border-white rounded-full border-x-8 dark:border-neutral-800 dark:bg-neutral-800"
      />

      {/* Botão azul central */}
      <Animated.View
        style={[
          {
            height: floatingButtonInnerSize,
            width: floatingButtonInnerSize,
            top: -(tabBarHeight * 0.35),
            left: (buttonWidth - floatingButtonInnerSize) / 2,
          },
          animatedStyle,
        ]}
        className="absolute z-10 bg-blue-600 rounded-full shadow-blue-600/25"
      ></Animated.View>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const availableWidth = dimensions.width || screenWidth;
          updateTabPosition(
            index,
            availableWidth,
            state.routes.length,
            tabPositionX
          );

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name as keyof typeof labels}
          />
        );
      })}
    </View>
  );
}
