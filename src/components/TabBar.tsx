import { View, type LayoutChangeEvent } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../styles/colors';
import TabBarButton from './TabBarButton';
import { useEffect, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';

const labels = {
  alert: 'Alertas',
  form: 'Responda',
  info: 'Sobre',
  profile: 'Perfil',
  settings: 'Ajustes',
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ height: 20, width: 20 });
  const buttonWidth = dimensions.width / state.routes.length;
  const { colorScheme, setColorScheme } = useColorScheme();

  const onTabbarLayout = (event: LayoutChangeEvent) => {
    setDimensions({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width,
    });
  }

  const tabPositionX = useSharedValue(0);

  // 🔥 Atualiza o tabPositionX ao abrir a tab inicialmente
  useEffect(() => {
    tabPositionX.value = withSpring(buttonWidth * state.index, {
      duration: 1500,
    });
  }, [buttonWidth, state.index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: tabPositionX.value,
      }],
    }
  });

  return (
    <View onLayout={onTabbarLayout} className='absolute bottom-0 flex-row items-center w-full h-40 text-center shadow-xl bg-background2 rounded-e-lg'>
      <Animated.View
        className='absolute z-10 rounded-full shadow-lg left-[10px] -top-8 bg-primary shadow-primary'
        style={[{
          height: buttonWidth - 20,
          width: buttonWidth - 20,
        }, animatedStyle]}
      />

      <Animated.View
        className='absolute rounded-full bg-background -top-10'
        style={[{
          height: buttonWidth,
          width: buttonWidth,
        }, animatedStyle]}
      />

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, {
            duration: 1500,
          });

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
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
            routeName={route.name as "info" | "form" | "alert" | "profile" | "settings"}
            color={colors.black}
            label={text as string}
          />
        );
      })}
    </View>
  );
}