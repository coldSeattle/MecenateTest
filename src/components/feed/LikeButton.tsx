import React, { useCallback } from 'react';
import { Pressable, useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { observer } from 'mobx-react-lite';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { XStack, Text } from 'tamagui';
import { MaterialIcons } from '@expo/vector-icons';
import { toggleLike } from '@/api/posts';
import { useFeedStore } from '@/stores/RootStore';
import { FEED_QUERY_KEY } from '@/hooks/useFeed';

interface LikeButtonProps {
  postId: string;
  initialIsLiked: boolean;
  initialLikesCount: number;
}

export const LikeButton = observer(function LikeButton({
  postId,
  initialIsLiked,
  initialLikesCount,
}: LikeButtonProps) {
  const feedStore = useFeedStore();
  const queryClient = useQueryClient();
  const isDark = useColorScheme() === 'dark';
  const scale = useSharedValue(1);

  const serverState = { isLiked: initialIsLiked, likesCount: initialLikesCount };
  const { isLiked, likesCount } = feedStore.getLikeState(postId, serverState);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const { mutate, isPending } = useMutation({
    mutationFn: () => toggleLike(postId),
    onSuccess: (data) => {
      feedStore.confirmLike(postId, data.data);
      queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEY, refetchType: 'none' });
    },
    onError: () => {
      feedStore.rollbackLike(postId, serverState);
    },
  });

  const handlePress = useCallback(() => {
    if (isPending) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(
      withTiming(0.75, { duration: 80 }),
      withSpring(1.25, { damping: 4, stiffness: 400, mass: 0.6 }),
      withSpring(1, { damping: 12, stiffness: 300 })
    );
    feedStore.applyOptimisticLike(postId, { isLiked, likesCount });
    mutate();
  }, [feedStore, postId, isLiked, likesCount, mutate, isPending, scale]);

  // Pill colors
  const pillBg = isLiked
    ? (isDark ? '#4A1020' : '#FFE4E9')
    : (isDark ? '#2A2A3A' : '#EEEEEF');
  const iconColor = isLiked ? '#F43F5E' : (isDark ? '#9090A8' : '#555560');
  const textColor = isLiked ? '#F43F5E' : (isDark ? '#9090A8' : '#555560');

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
    >
      <XStack
        alignItems="center"
        gap={5}
        paddingHorizontal={12}
        paddingVertical={6}
        borderRadius={999}
        style={{ backgroundColor: pillBg }}
      >
        <Animated.View style={animatedStyle}>
          <MaterialIcons
            name={isLiked ? 'favorite' : 'favorite-border'}
            size={18}
            color={iconColor}
          />
        </Animated.View>
        <Text fontSize={13} fontWeight="500" style={{ color: textColor }}>
          {likesCount > 0 ? String(likesCount) : '0'}
        </Text>
      </XStack>
    </Pressable>
  );
});
