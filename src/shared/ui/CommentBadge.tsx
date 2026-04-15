import React, { memo } from 'react';
import { useColorScheme } from 'react-native';
import { XStack, Text } from 'tamagui';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CommentBadgeProps {
  count: number;
}

export const CommentBadge = memo(function CommentBadge({ count }: CommentBadgeProps) {
  const isDark = useColorScheme() === 'dark';
  const pillBg = isDark ? '#2A2A3A' : '#EEEEEF';
  const color = isDark ? '#9090A8' : '#555560';

  return (
    <XStack
      alignItems="center"
      gap={5}
      paddingHorizontal={12}
      paddingVertical={6}
      borderRadius={999}
      style={{ backgroundColor: pillBg }}
    >
      <MaterialCommunityIcons name="message-outline" size={17} color={color} />
      <Text fontSize={13} fontWeight="500" style={{ color }}>
        {count > 0 ? String(count) : '0'}
      </Text>
    </XStack>
  );
});
