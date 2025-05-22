import { View, Text, Pressable } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import { icon } from '../constants/icon';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors } from '@/styles/colors';

type RouteName = keyof typeof icon;

interface TabBarButtonProps {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: RouteName;
  color: string;
  label: string;
}

export default function TabBarButton({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  color,
  label,
}: TabBarButtonProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused, {
      duration: 350,
    });
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.0]);
    const top = interpolate(scale.value, [0, 1], [0, -30]);

    return {
      transform: [
        { scale: scaleValue },
        { translateY: top },
      ],
    }
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [0, 1]);

    return {
      opacity,
    }
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className={`z-20 flex-col flex-1 items-center justify-center gap-1 -top-8`}
    >
      <Animated.View
        style={animatedIconStyle}
      >
        {icon[routeName]({
          size: 30,
          color: isFocused ? colors.text : colors.text2,
        })}
      </Animated.View>
      <Animated.Text
        style={[animatedTextStyle]}
        className="text-base font-bold -bottom-4 text-text"
      >
        {label}
      </Animated.Text>
    </Pressable>
  )
}