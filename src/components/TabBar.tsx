import { View, type LayoutChangeEvent, Dimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import TabBarButton from "./TabBarButton";
import { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getTabBarHeight, isSmallDevice } from "@/utils/responsive";

const labels = {
  index: "Alertas",
  form: "Responda",
  about: "Sobre",
  profile: "Perfil",
  settings: "Ajustes",
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  
  // Calcula a largura do botão com base na largura da tela e número de abas
  // Garante que não seja menor que 60px nem maior que 80px para manter a usabilidade
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
    // Calcula a posição considerando a largura real disponível
    const availableWidth = dimensions.width || screenWidth;
    const actualButtonWidth = availableWidth / state.routes.length;
    
    tabPositionX.value = withSpring(actualButtonWidth * state.index, {
      damping: 15,
      stiffness: 80,
      mass: 0.8,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
    });
  }, [dimensions.width, state.index, screenWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabPositionX.value }],
  }));

  // Altura responsiva da TabBar usando utilitário
  const tabBarHeight = getTabBarHeight(screenHeight);
  const isSmall = isSmallDevice();
  
  // Altura total incluindo safe area para dispositivos com notch
  const totalTabBarHeight = tabBarHeight + insets.bottom;
  
  // Tamanhos responsivos para os elementos da TabBar
  const floatingButtonSize = Math.min(buttonWidth * (isSmall ? 0.85 : 0.9), isSmall ? 56 : 60);
  const floatingButtonInnerSize = floatingButtonSize - (isSmall ? 14 : 16);

  return (
    <View
      onLayout={onTabbarLayout}
      style={{ 
        height: totalTabBarHeight,
        paddingBottom: insets.bottom,
      }}
      className="absolute bottom-0 flex-row items-center w-full bg-white dark:bg-neutral-800"
    >
      {/* Fundo do botão central */}
      <Animated.View
        style={[
          {
            height: floatingButtonSize,
            width: floatingButtonSize,
            top: -(tabBarHeight * 0.45),
            left: (buttonWidth - floatingButtonSize) / 2,
          },
          animatedStyle,
        ]}
        className="absolute rounded-full shadow-lg bg-neutral-200 dark:bg-neutral-900"
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
        className="absolute z-10 rounded-full shadow-xl bg-primary shadow-primary/25"
      />

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          // Calcula a posição considerando a largura real disponível
          const availableWidth = dimensions.width || screenWidth;
          const actualButtonWidth = availableWidth / state.routes.length;
          
          tabPositionX.value = withSpring(actualButtonWidth * index, {
            damping: 15,
            stiffness: 80,
            mass: 0.8,
            overshootClamping: false,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 2,
          });

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

        const text = labels[label as keyof typeof labels] || label;

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={
              route.name as "about" | "form" | "index" | "profile" | "settings"
            }
            label={text as string}
          />
        );
      })}
    </View>
  );
}
