import React, { useCallback } from 'react';
import {
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { YStack, XStack, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
import { getPost } from '@entities/post/api';
import { addComment } from '@entities/comment/api';
import { useComments, flattenCommentPages, commentsQueryKey } from '@entities/comment/lib/useComments';
import { usePostWebSocket } from '@entities/post/lib/usePostWebSocket';
import { CommentItem, CommentInput } from '@entities/comment';
import { LikeButton } from '@features/like-post';
import { LockedBadge } from '@features/locked-post';
import { Avatar, VerifiedBadge, CommentBadge } from '@shared/ui';
import type { CommentsResponse } from '@shared/types';

dayjs.extend(relativeTime);
dayjs.locale('ru');

interface PostDetailScreenProps {
  postId: string;
}

export function PostDetailScreen({ postId }: PostDetailScreenProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isDark = useColorScheme() === 'dark';

  const bg = isDark ? '#0D0D14' : '#FFFFFF';
  const headerBorder = isDark ? '#2C2C3E' : '#E8E8EC';
  const arrowColor = isDark ? '#F0F0FF' : '#111111';
  const iconBg = isDark ? '#2D1B69' : '#F0EEFF';
  const muteColor = isDark ? '#55556A' : '#ABABAB';
  const sectionBg = isDark ? '#0D0D14' : '#FFFFFF';
  const sectionLabelColor = isDark ? '#F0F0FF' : '#111111';

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    retry: 2,
  });

  const {
    data: commentsData,
    isLoading: commentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchComments,
  } = useComments(postId);
  const comments = flattenCommentPages(commentsData?.pages);

  const handleNewComments = useCallback(() => { refetchComments(); }, [refetchComments]);
  usePostWebSocket({ postId, onNewComments: handleNewComments });

  const handleLoadNew = useCallback(() => { refetchComments(); }, [refetchComments]);

  const { mutate: submitComment, isPending: isSubmitting } = useMutation({
    mutationFn: (text: string) => addComment(postId, text),
    onSuccess: (response) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newComment = response.data.comment;
      queryClient.setQueryData<{ pages: CommentsResponse[]; pageParams: unknown[] }>(
        commentsQueryKey(postId),
        (old) => {
          if (!old) return old;
          const pages = [...old.pages];
          pages[0] = {
            ...pages[0],
            data: { ...pages[0].data, comments: [newComment, ...pages[0].data.comments] },
          };
          return { ...old, pages };
        }
      );
    },
  });

  const post = data?.data.post;

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        <Header onBack={() => router.back()} borderColor={headerBorder} arrowColor={arrowColor} />
        <YStack flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" color="#7C3AED" />
        </YStack>
      </SafeAreaView>
    );
  }

  if (isError || !post) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        <Header onBack={() => router.back()} borderColor={headerBorder} arrowColor={arrowColor} />
        <YStack flex={1} alignItems="center" justifyContent="center" gap="$5" paddingHorizontal="$6">
          <YStack width={72} height={72} borderRadius="$avatar" style={{ backgroundColor: iconBg }} alignItems="center" justifyContent="center">
            <MaterialIcons name="wifi-off" size={30} color="#7C3AED" />
          </YStack>
          <YStack alignItems="center" gap="$2">
            <Text fontSize={17} fontWeight="700" color="$textPrimary" textAlign="center">
              Не удалось загрузить публикацию
            </Text>
            <Text fontSize={14} color="$textSecondary" textAlign="center" lineHeight={20}>
              Проверьте подключение к интернету и попробуйте снова
            </Text>
          </YStack>
          <YStack backgroundColor="$brand" borderRadius="$pill" paddingVertical="$3" paddingHorizontal="$8" onPress={() => refetch()} pressStyle={{ opacity: 0.85 }} cursor="pointer" minWidth={180} alignItems="center">
            <Text fontSize={15} fontWeight="600" color="white">Повторить</Text>
          </YStack>
        </YStack>
      </SafeAreaView>
    );
  }

  const isPaid = post.tier === 'paid';
  const timeAgo = dayjs(post.createdAt).fromNow();
  const commentCount = commentsData?.pages[0]?.data ? comments.length : post.commentsCount;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <Header onBack={() => router.back()} borderColor={headerBorder} arrowColor={arrowColor} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: bg }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <XStack alignItems="center" gap="$2" paddingHorizontal="$4" paddingVertical="$3">
            <Avatar uri={post.author.avatarUrl} size={40} displayName={post.author.displayName} />
            <YStack flex={1} gap={2}>
              <XStack alignItems="center" gap={4}>
                <Text fontSize={15} fontWeight="600" color="$textPrimary">{post.author.displayName}</Text>
                {post.author.isVerified && <VerifiedBadge size={14} />}
              </XStack>
              <Text fontSize={12} style={{ color: muteColor }}>{timeAgo}</Text>
            </YStack>
          </XStack>

          {isPaid ? (
            <LockedBadge coverUrl={post.coverUrl} />
          ) : (
            <>
              {!!post.coverUrl && (
                <Image source={{ uri: post.coverUrl }} style={styles.cover} resizeMode="cover" />
              )}
              <YStack paddingHorizontal="$4" paddingTop="$3" gap="$2">
                <Text fontSize={20} fontWeight="800" color="$textPrimary" lineHeight={28}>{post.title}</Text>
                <Text fontSize={15} color="$textSecondary" lineHeight={24}>{post.body || post.preview}</Text>
              </YStack>
            </>
          )}

          {!isPaid && (
            <XStack alignItems="center" gap="$4" paddingHorizontal="$4" paddingTop="$3" paddingBottom="$2">
              <LikeButton postId={post.id} initialIsLiked={post.isLiked} initialLikesCount={post.likesCount} />
              <CommentBadge count={post.commentsCount} />
            </XStack>
          )}

          <YStack style={{ backgroundColor: sectionBg }}>
            <XStack alignItems="center" justifyContent="space-between" paddingHorizontal="$4" paddingTop="$4" paddingBottom="$2">
              <Text fontSize={15} fontWeight="700" style={{ color: sectionLabelColor }}>
                {commentCount > 0 ? `${commentCount} комментари${commentCount === 1 ? 'й' : 'я'}` : 'Комментарии'}
              </Text>
              <Pressable onPress={handleLoadNew} accessibilityRole="button" hitSlop={8}>
                <Text fontSize={14} fontWeight="600" style={{ color: '#7C3AED' }}>Сначала новые</Text>
              </Pressable>
            </XStack>

            {commentsLoading ? (
              <YStack paddingVertical="$4" alignItems="center">
                <ActivityIndicator size="small" color="#7C3AED" />
              </YStack>
            ) : comments.length === 0 ? (
              <YStack paddingVertical="$4" paddingHorizontal="$4">
                <Text fontSize={14} style={{ color: muteColor }}>Пока нет комментариев. Будьте первым!</Text>
              </YStack>
            ) : (
              <>
                {comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)}
                {hasNextPage && (
                  <Pressable onPress={() => fetchNextPage()} disabled={isFetchingNextPage} style={{ alignItems: 'center', paddingVertical: 16 }} accessibilityRole="button">
                    {isFetchingNextPage ? (
                      <ActivityIndicator size="small" color="#7C3AED" />
                    ) : (
                      <Text fontSize={14} fontWeight="600" style={{ color: '#7C3AED' }}>Загрузить ещё</Text>
                    )}
                  </Pressable>
                )}
              </>
            )}
          </YStack>
        </ScrollView>

        <CommentInput onSubmit={submitComment} isSubmitting={isSubmitting} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface HeaderProps {
  onBack: () => void;
  borderColor: string;
  arrowColor: string;
}

function Header({ onBack, borderColor, arrowColor }: HeaderProps) {
  return (
    <XStack height={52} alignItems="center" paddingHorizontal="$3" style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: borderColor }}>
      <Pressable onPress={onBack} hitSlop={12} accessibilityRole="button" accessibilityLabel="Назад">
        <MaterialIcons name="arrow-back" size={24} color={arrowColor} />
      </Pressable>
      <Text flex={1} textAlign="center" fontSize={17} fontWeight="600" color="$textPrimary" marginRight={36}>
        Детальный пост
      </Text>
    </XStack>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 8 },
  cover: { width: '100%', aspectRatio: 1.6 },
});
