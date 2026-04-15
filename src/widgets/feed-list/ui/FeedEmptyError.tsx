import React, { memo } from 'react';
import { YStack, Text } from 'tamagui';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MascotError } from '@shared/ui';

interface FeedEmptyErrorProps {
  onRetry: () => void;
}

export const FeedEmptyError = memo(function FeedEmptyError({ onRetry }: FeedEmptyErrorProps) {
  const btnScale = useSharedValue(1);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const handlePress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    btnScale.value = withSequence(
      withTiming(0.94, { duration: 80 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
    onRetry();
  };

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" gap="$5" paddingHorizontal="$6">
      <MascotError size={130} />

      <Text fontSize={16} fontWeight="600" color="$textPrimary" textAlign="center">
        Не удалось загрузить публикацию
      </Text>

      <Animated.View style={[{ width: '100%', alignItems: 'center' }, btnStyle]}>
        <YStack
          backgroundColor="$brand"
          borderRadius="$pill"
          paddingVertical="$3"
          paddingHorizontal="$8"
          onPress={handlePress}
          pressStyle={{ opacity: 0.88 }}
          cursor="pointer"
          width="100%"
          alignItems="center"
        >
          <Text fontSize={15} fontWeight="600" color="white">
            Повторить
          </Text>
        </YStack>
      </Animated.View>
    </YStack>
  );
});
