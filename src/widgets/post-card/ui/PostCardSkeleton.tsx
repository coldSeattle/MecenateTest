import React, { memo, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolateColor,
  type SharedValue,
} from 'react-native-reanimated';
import { YStack, XStack } from 'tamagui';

function SkeletonBox({
  width,
  height,
  borderRadius = 6,
  progress,
  isDark,
}: {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  progress: SharedValue<number>;
  isDark: boolean;
}) {
  const base = isDark ? '#1E1E2C' : '#EBEBEB';
  const high = isDark ? '#2A2A3A' : '#F5F5F5';

  const style = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [base, high]),
  }));

  return <Animated.View style={[{ width: width as number, height, borderRadius }, style]} />;
}

export const PostCardSkeleton = memo(function PostCardSkeleton() {
  const progress = useSharedValue(0);
  const isDark = useColorScheme() === 'dark';
  const cardBg = isDark ? '#16161F' : '#FFFFFF';

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [progress]);

  return (
    <YStack style={{ backgroundColor: cardBg, marginBottom: 8 }}>
      <XStack alignItems="center" gap={10} paddingHorizontal={16} paddingVertical={12}>
        <SkeletonBox width={36} height={36} borderRadius={18} progress={progress} isDark={isDark} />
        <SkeletonBox width={120} height={13} progress={progress} isDark={isDark} />
      </XStack>
      <SkeletonBox width={'100%'} height={200} borderRadius={0} progress={progress} isDark={isDark} />
      <YStack paddingHorizontal={16} paddingTop={12} paddingBottom={12} gap={8}>
        <SkeletonBox width={'70%'} height={16} progress={progress} isDark={isDark} />
        <SkeletonBox width={'100%'} height={13} progress={progress} isDark={isDark} />
        <SkeletonBox width={'85%'} height={13} progress={progress} isDark={isDark} />
        <XStack gap={20} paddingTop={4}>
          <SkeletonBox width={44} height={18} progress={progress} isDark={isDark} />
          <SkeletonBox width={44} height={18} progress={progress} isDark={isDark} />
        </XStack>
      </YStack>
    </YStack>
  );
});
