import React, { memo } from 'react';
import { Pressable, useColorScheme, StyleSheet, View, Text } from 'react-native';
import type { PostTier } from '@/types/api';

type TabValue = PostTier | 'all';

const TABS: { value: TabValue; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'free', label: 'Бесплатные' },
  { value: 'paid', label: 'Платные' },
];

interface FeedTabFilterProps {
  active: TabValue;
  onChange: (value: TabValue) => void;
}

export const FeedTabFilter = memo(function FeedTabFilter({ active, onChange }: FeedTabFilterProps) {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1C1C2E' : '#F2F2F7' }]}>
      {TABS.map((tab) => {
        const isActive = tab.value === active;
        return (
          <Pressable
            key={tab.value}
            onPress={() => onChange(tab.value)}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <View style={[styles.pill, isActive && styles.pillActive]}>
              <Text
                style={[
                  styles.label,
                  { color: isActive ? '#7C3AED' : '#888888' },
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 999,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
  },
  pill: {
    height: 34,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
  },
  pillActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    includeFontPadding: false,
  },
});
