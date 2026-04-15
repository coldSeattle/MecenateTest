import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { TamaguiProvider } from 'tamagui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import config from '../tamagui.config';
import { StoreProvider, rootStore } from '@/stores/RootStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5 * 60_000,
      staleTime: 60_000,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    rootStore.auth.init().then(() => setIsReady(true));
  }, []);

  if (!isReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TamaguiProvider config={config} defaultTheme={isDark ? 'dark' : 'light'}>
          {/* expo-status-bar автоматически выбирает dark/light контент по теме */}
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <QueryClientProvider client={queryClient}>
            <StoreProvider value={rootStore}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen
                  name="post/[id]"
                  options={{
                    animation: 'slide_from_right',
                  }}
                />
              </Stack>
            </StoreProvider>
          </QueryClientProvider>
        </TamaguiProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
