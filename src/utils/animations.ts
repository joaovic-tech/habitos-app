import { Animated, Easing } from 'react-native';

export const animateValue = (
  animatedValue: Animated.Value,
  toValue: number,
  duration = 300,
  easing = Easing.out(Easing.cubic),
  callback?: () => void
) => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    easing,
    useNativeDriver: true,
  }).start(callback);
};
