import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, FlatList, useColorScheme } from 'react-native';
import { YStack, Text, XStack } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFeed, flattenFeedPages } from '@/hooks/useFeed';
import { PostCard } from '@/components/feed/PostCard';
import { PostCardSkeleton } from '@/components/feed/PostCardSkeleton';
import { FeedEmptyError } from '@/components/feed/FeedEmptyError';
import { FeedListFooter } from '@/components/feed/FeedListFooter';
import { FeedTabFilter } from '@/components/feed/FeedTabFilter';
import type { Post, PostTier } from '@/types/api';

type TabValue = PostTier | 'all';

const SKELETON_COUNT = 4;
const skeletonData = Array.from({ length: SKELETON_COUNT }, (_, i) => `sk_${i}`);

const BG = { light: '#F5F5F7', dark: '#0D0D14' };

export function FeedScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const bg = scheme === 'dark' ? BG.dark : BG.light;

  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const tier: PostTier | undefined = activeTab === 'all' ? undefined : activeTab;

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeed(tier);

  const posts = useMemo(() => flattenFeedPages(data?.pages), [data?.pages]);
  const isRefreshing = isFetching && !isLoading && !isFetchingNextPage;

  const renderPost = useCallback(({ item }: { item: Post }) => (
    <PostCard post={item} />
  ), []);

  const renderSkeleton = useCallback(({ item }: { item: string }) => (
    <PostCardSkeleton key={item} />
  ), []);

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const refreshControl = (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={refetch}
      tintColor="#7C3AED"
      colors={['#7C3AED']}
    />
  );

  // Header + tabs live OUTSIDE the FlatList so tab switching never triggers list jump
  const TopBar = (
    <YStack style={{ backgroundColor: bg }}>
      <XStack paddingHorizontal="$4" paddingTop="$3" paddingBottom="$2" alignItems="center">
        <Text fontSize={22} fontWeight="800" color="$textPrimary" letterSpacing={-0.3}>
          Публикации
        </Text>
      </XStack>
      <FeedTabFilter active={activeTab} onChange={setActiveTab} />
    </YStack>
  );

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        {TopBar}
        <FlatList
          data={skeletonData}
          renderItem={renderSkeleton}
          scrollEnabled={false}
          style={{ backgroundColor: bg }}
          contentContainerStyle={{ backgroundColor: bg }}
        />
      </SafeAreaView>
    );
  }

  // ─── Error ─────────────────────────────────────────────────────────────────
  if (isError && posts.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        {TopBar}
        <FeedEmptyError onRetry={refetch} />
      </SafeAreaView>
    );
  }

  // ─── Feed ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      {TopBar}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        refreshControl={refreshControl}
        ListFooterComponent={<FeedListFooter isVisible={isFetchingNextPage} />}
        style={{ backgroundColor: bg }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16, backgroundColor: bg }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
}
