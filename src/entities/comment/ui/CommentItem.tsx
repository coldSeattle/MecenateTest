import React, { memo, useState, useCallback } from 'react';
import { Pressable, useColorScheme } from 'react-native';
import { XStack, YStack, Text } from 'tamagui';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Avatar } from '@shared/ui';
import type { Comment } from '@shared/types';

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = memo(function CommentItem({ comment }: CommentItemProps) {
  const isDark = useColorScheme() === 'dark';
  const textMuted = isDark ? '#6B6B80' : '#ABABAB';
  const textPrimary = isDark ? '#F0F0FF' : '#111111';
  const dividerColor = isDark ? '#2C2C3E' : '#F0F0F5';

  const [isLiked, setIsLiked] = useState(comment.isLiked ?? false);
  const [count, setCount] = useState(comment.likesCount ?? 0);

  const handleLike = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLiked((prev) => {
      const next = !prev;
      setCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      return next;
    });
  }, []);

  return (
    <XStack
      paddingHorizontal="$4"
      paddingVertical="$3"
      gap={10}
      alignItems="flex-start"
      style={{ borderBottomWidth: 1, borderBottomColor: dividerColor }}
    >
      <Avatar uri={comment.author.avatarUrl} size={34} displayName={comment.author.displayName} />

      <YStack flex={1} gap={3}>
        <Text fontSize={13} fontWeight="600" style={{ color: textPrimary }}>
          {comment.author.displayName}
        </Text>
        <Text fontSize={14} lineHeight={20} style={{ color: isDark ? '#C0C0D8' : '#333344' }}>
          {comment.text}
        </Text>
      </YStack>

      <Pressable
        onPress={handleLike}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={isLiked ? 'Убрать лайк' : 'Лайк'}
        style={{ alignItems: 'center', gap: 2, marginTop: 2 }}
      >
        <MaterialIcons
          name={isLiked ? 'favorite' : 'favorite-border'}
          size={16}
          color={isLiked ? '#F43F5E' : textMuted}
        />
        {count > 0 && (
          <Text fontSize={11} style={{ color: isLiked ? '#F43F5E' : textMuted }}>
            {count}
          </Text>
        )}
      </Pressable>
    </XStack>
  );
});
