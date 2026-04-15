import React, { memo, useCallback } from 'react';
import { Image, StyleSheet, Pressable } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { useRouter } from 'expo-router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
import { Avatar, VerifiedBadge, CommentBadge, ExpandableText } from '@shared/ui';
import { LockedBadge } from '@features/locked-post';
import { LikeButton } from '@features/like-post';
import type { Post } from '@shared/types';

dayjs.extend(relativeTime);
dayjs.locale('ru');

interface PostCardProps {
  post: Post;
}

export const PostCard = memo(function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  const { id, author, title, preview, coverUrl, likesCount, commentsCount, isLiked, tier } = post;
  const isPaid = tier === 'paid';

  const handlePress = useCallback(() => {
    router.push(`/post/${id}`);
  }, [id, router]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      style={({ pressed }) => ({ opacity: pressed ? 0.97 : 1 })}
    >
      <YStack backgroundColor="$cardBg" marginBottom={8}>
        <XStack alignItems="center" gap="$2" paddingHorizontal="$4" paddingTop="$3" paddingBottom="$3">
          <Avatar uri={author.avatarUrl} size={36} displayName={author.displayName} />
          <XStack alignItems="center" gap={4} flex={1}>
            <Text fontSize={14} fontWeight="600" color="$textPrimary" numberOfLines={1}>
              {author.displayName}
            </Text>
            {author.isVerified && <VerifiedBadge size={13} />}
          </XStack>
        </XStack>

        {isPaid ? (
          <LockedBadge coverUrl={coverUrl} />
        ) : (
          <>
            {!!coverUrl && (
              <Image
                source={{ uri: coverUrl }}
                style={styles.cover}
                resizeMode="cover"
                accessibilityLabel={`Cover for ${title}`}
              />
            )}
            <YStack paddingHorizontal="$4" paddingTop="$3" paddingBottom="$1" gap="$1">
              <Text fontSize={16} fontWeight="700" color="$textPrimary" lineHeight={22}>
                {title}
              </Text>
              {!!preview && (
                <ExpandableText text={preview} numberOfLines={2} fontSize={14} lineHeight={20} color="#6B6B6B" />
              )}
            </YStack>
            <XStack alignItems="center" gap="$2" paddingHorizontal="$4" paddingTop="$2" paddingBottom="$3">
              <LikeButton postId={id} initialIsLiked={isLiked} initialLikesCount={likesCount} />
              <CommentBadge count={commentsCount} />
            </XStack>
          </>
        )}
      </YStack>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  cover: { width: '100%', aspectRatio: 1.6 },
});
