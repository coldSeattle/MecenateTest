import React, { memo, useEffect } from 'react';
import { YStack } from 'tamagui';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';

const DOT_COUNT = 3;
const DOT_SIZE = 7;

function Dot({ index }: { index: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    const delay = index * 200;
    const timeout = setTimeout(() => {
      opacity.value = withRepeat(
        withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }, delay);
    return () => clearTimeout(timeout);
  }, [opacity, index]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2, backgroundColor: '#7C3AED', marginHorizontal: 3 }, style]}
    />
  );
}

interface FeedListFooterProps {
  isVisible: boolean;
}

export const FeedListFooter = memo(function FeedListFooter({ isVisible }: FeedListFooterProps) {
  if (!isVisible) return <View style={{ height: 16 }} />;

  return (
    <YStack paddingVertical={24} alignItems="center" justifyContent="center">
      <YStack flexDirection="row" alignItems="center">
        {Array.from({ length: DOT_COUNT }, (_, i) => <Dot key={i} index={i} />)}
      </YStack>
    </YStack>
  );
});

const _styles = StyleSheet.create({});
