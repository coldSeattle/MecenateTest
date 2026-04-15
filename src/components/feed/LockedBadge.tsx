import React, { memo } from 'react';
import { Image, StyleSheet, View, useColorScheme } from 'react-native';
import { YStack, Text } from 'tamagui';
import { MaterialIcons } from '@expo/vector-icons';

interface LockedBadgeProps {
  coverUrl?: string;
}

function SkeletonLine({ width, isDark }: { width: `${number}%`; isDark: boolean }) {
  return (
    <View
      style={[
        styles.skeletonLine,
        { width, backgroundColor: isDark ? '#2A2A3A' : '#E8E8EC' },
      ]}
    />
  );
}

export const LockedBadge = memo(function LockedBadge({ coverUrl }: LockedBadgeProps) {
  const isDark = useColorScheme() === 'dark';
  return (
    <YStack>
      {/* Blurred cover with overlay */}
      <View style={styles.imageContainer}>
        {coverUrl ? (
          <Image
            source={{ uri: coverUrl }}
            style={styles.cover}
            resizeMode="cover"
            blurRadius={18}
          />
        ) : (
          <View style={[styles.cover, styles.coverFallback]} />
        )}

        {/* Dark overlay */}
        <View style={styles.overlay} />

        {/* Centered lock content */}
        <YStack style={styles.content} alignItems="center" gap="$3">
          <View style={styles.iconCircle}>
            <MaterialIcons name="attach-money" size={26} color="#FFFFFF" />
          </View>

          <YStack alignItems="center" gap="$1" paddingHorizontal="$6">
            <Text fontSize={14} fontWeight="600" color="white" textAlign="center" lineHeight={20}>
              Контент скрыт пользователем.
            </Text>
            <Text fontSize={13} color="rgba(255,255,255,0.75)" textAlign="center" lineHeight={18}>
              Доступ открывается после доната
            </Text>
          </YStack>

          <YStack
            backgroundColor="$brand"
            borderRadius="$pill"
            paddingVertical={10}
            paddingHorizontal={32}
            cursor="pointer"
          >
            <Text fontSize={14} fontWeight="600" color="white">
              Отправить донат
            </Text>
          </YStack>
        </YStack>
      </View>

      {/* Skeleton lines — replacing the text content */}
      <YStack paddingHorizontal="$4" paddingVertical="$3" gap="$2">
        <SkeletonLine width="75%" isDark={isDark} />
        <SkeletonLine width="55%" isDark={isDark} />
      </YStack>
    </YStack>
  );
});

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    aspectRatio: 1.6,
    position: 'relative',
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  coverFallback: {
    backgroundColor: '#1A1A2E',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 20, 0.55)',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeletonLine: {
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E8E8EC',
  },
});
