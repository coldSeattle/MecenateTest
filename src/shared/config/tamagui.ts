import { createTamagui, createTokens } from '@tamagui/core';
import { shorthands } from '@tamagui/shorthands';
import { tokens as defaultTokens } from '@tamagui/themes';
import { createInterFont } from '@tamagui/font-inter';
import { createAnimations } from '@tamagui/animations-react-native';

const animations = createAnimations({
  quick: {
    type: 'spring',
    damping: 22,
    mass: 1,
    stiffness: 280,
  },
  medium: {
    type: 'spring',
    damping: 14,
    mass: 0.9,
    stiffness: 120,
  },
  slow: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
  lazy: {
    type: 'spring',
    damping: 18,
    stiffness: 50,
  },
  bouncy: {
    type: 'spring',
    damping: 8,
    stiffness: 180,
    mass: 0.85,
  },
  tooltip: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
});

const headingFont = createInterFont({
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 15,
    6: 16,
    7: 17,
    8: 20,
    9: 24,
    10: 30,
  },
  weight: {
    4: '400',
    6: '500',
    7: '600',
    8: '700',
    9: '800',
  },
  letterSpacing: {
    7: 0,
    8: -0.3,
    9: -0.5,
    10: -1,
  },
  face: {
    700: { normal: 'InterBold' },
    800: { normal: 'InterBold' },
  },
});

const bodyFont = createInterFont(
  {
    face: {
      700: { normal: 'InterBold' },
    },
  },
  {
    sizeSize: (size) => Math.round(size * 1.05),
    sizeLineHeight: (size) => Math.round(size * 1.55),
  }
);

export const tokens = createTokens({
  ...defaultTokens,
  color: {
    ...defaultTokens.color,
    brand: '#7C3AED',
    brandLight: '#A78BFA',
    brandDark: '#5B21B6',
    brandSurface: '#EDE9FE',
    like: '#F43F5E',
    gold: '#F59E0B',
    success: '#10B981',
    error: '#EF4444',
    pageBg: '#F5F5F7',
    cardBg: '#FFFFFF',
    darkBg: '#0D0D14',
    darkCard: '#16161F',
    darkSurface: '#1E1E2C',
    darkBorder: '#2C2C3E',
    textPrimary: '#111111',
    textSecondary: '#6B6B6B',
    textMuted: '#ABABAB',
    textInverse: '#FFFFFF',
    borderLight: '#E8E8EC',
    darkTextPrimary: '#F0F0FF',
    darkTextSecondary: '#9090A8',
    darkTextMuted: '#55556A',
  },
  space: {
    ...defaultTokens.space,
    true: 12,
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 40,
    10: 48,
    11: 56,
    12: 64,
  },
  size: {
    ...defaultTokens.size,
    true: 44,
    avatar_sm: 32,
    avatar_md: 40,
    avatar_lg: 56,
  },
  radius: {
    ...defaultTokens.radius,
    true: 8,
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    card: 12,
    pill: 999,
    avatar: 999,
  },
  zIndex: {
    ...defaultTokens.zIndex,
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
});

const lightTheme = {
  background: tokens.color.pageBg,
  backgroundHover: '#ECECEF',
  backgroundPress: '#E5E5EA',
  backgroundFocus: '#ECECEF',
  backgroundStrong: tokens.color.cardBg,
  backgroundTransparent: 'transparent',
  cardBg: tokens.color.cardBg,
  color: tokens.color.textPrimary,
  colorHover: '#333333',
  colorPress: '#555555',
  colorFocus: tokens.color.textPrimary,
  shadowColor: 'rgba(0,0,0,0.08)',
  shadowColorHover: 'rgba(0,0,0,0.12)',
  borderColor: tokens.color.borderLight,
  borderColorHover: '#D0D0D8',
  borderColorFocus: tokens.color.brand,
  borderColorPress: tokens.color.brand,
  placeholderColor: tokens.color.textMuted,
  brand: tokens.color.brand,
  brandLight: tokens.color.brandLight,
  brandDark: tokens.color.brandDark,
  brandSurface: tokens.color.brandSurface,
  textPrimary: tokens.color.textPrimary,
  textSecondary: tokens.color.textSecondary,
  textMuted: tokens.color.textMuted,
  like: tokens.color.like,
};

const darkTheme = {
  background: tokens.color.darkBg,
  backgroundHover: tokens.color.darkSurface,
  backgroundPress: '#25253A',
  backgroundFocus: tokens.color.darkSurface,
  backgroundStrong: tokens.color.darkCard,
  backgroundTransparent: 'transparent',
  cardBg: tokens.color.darkCard,
  color: tokens.color.darkTextPrimary,
  colorHover: '#C8C8E0',
  colorPress: tokens.color.darkTextSecondary,
  colorFocus: tokens.color.darkTextPrimary,
  shadowColor: 'rgba(0,0,0,0.5)',
  shadowColorHover: 'rgba(0,0,0,0.7)',
  borderColor: tokens.color.darkBorder,
  borderColorHover: '#38384E',
  borderColorFocus: tokens.color.brand,
  borderColorPress: tokens.color.brand,
  placeholderColor: tokens.color.darkTextMuted,
  brand: tokens.color.brand,
  brandLight: tokens.color.brandLight,
  brandDark: tokens.color.brandDark,
  brandSurface: '#2D1B69',
  textPrimary: tokens.color.darkTextPrimary,
  textSecondary: tokens.color.darkTextSecondary,
  textMuted: tokens.color.darkTextMuted,
  like: tokens.color.like,
};

const tamaguiConfig = createTamagui({
  animations,
  defaultTheme: 'light',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  tokens,
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    gtXs: { minWidth: 661 },
    gtSm: { minWidth: 801 },
    gtMd: { minWidth: 1021 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
});

export type AppConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
