import React, { memo, useEffect } from 'react';
import Svg, {
  Ellipse,
  Circle,
  Path,
  G,
  Defs,
  RadialGradient,
  Stop,
  LinearGradient,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';

interface MascotErrorProps {
  size?: number;
}

export const MascotError = memo(function MascotError({ size = 120 }: MascotErrorProps) {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Gentle float
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    // Subtle sway
    rotate.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(4, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [translateY, rotate]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[{ width: size, height: size }, animStyle]}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          {/* Body gradient */}
          <RadialGradient id="bodyGrad" cx="50%" cy="40%" rx="50%" ry="55%">
            <Stop offset="0%" stopColor="#C084FC" />
            <Stop offset="100%" stopColor="#7C3AED" />
          </RadialGradient>
          {/* Gill gradient */}
          <LinearGradient id="gillGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#F0ABFC" />
            <Stop offset="100%" stopColor="#E879F9" />
          </LinearGradient>
          {/* Shadow */}
          <RadialGradient id="shadowGrad" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="#7C3AED" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Shadow under body */}
        <Ellipse cx="60" cy="112" rx="28" ry="5" fill="url(#shadowGrad)" />

        {/* ── Left gills (feathery axolotl plumes) ── */}
        {/* Left outer gill */}
        <Path
          d="M 28 52 Q 14 30 20 14 Q 24 8 28 16 Q 22 32 30 50"
          fill="url(#gillGrad)"
          opacity="0.9"
        />
        {/* Left mid gill */}
        <Path
          d="M 34 48 Q 24 28 30 14 Q 33 8 36 15 Q 28 30 36 46"
          fill="url(#gillGrad)"
        />
        {/* Left inner gill */}
        <Path
          d="M 40 46 Q 34 28 38 16 Q 40 10 43 16 Q 38 30 42 44"
          fill="url(#gillGrad)"
          opacity="0.85"
        />

        {/* ── Right gills ── */}
        {/* Right outer gill */}
        <Path
          d="M 92 52 Q 106 30 100 14 Q 96 8 92 16 Q 98 32 90 50"
          fill="url(#gillGrad)"
          opacity="0.9"
        />
        {/* Right mid gill */}
        <Path
          d="M 86 48 Q 96 28 90 14 Q 87 8 84 15 Q 92 30 84 46"
          fill="url(#gillGrad)"
        />
        {/* Right inner gill */}
        <Path
          d="M 80 46 Q 86 28 82 16 Q 80 10 77 16 Q 82 30 78 44"
          fill="url(#gillGrad)"
          opacity="0.85"
        />

        {/* ── Main body ── */}
        <Ellipse cx="60" cy="76" rx="32" ry="36" fill="url(#bodyGrad)" />

        {/* Body highlight */}
        <Ellipse cx="52" cy="60" rx="10" ry="14" fill="white" opacity="0.12" />

        {/* ── Belly ── */}
        <Ellipse cx="60" cy="82" rx="18" ry="20" fill="#A855F7" opacity="0.5" />

        {/* ── Left small leg ── */}
        <Ellipse cx="34" cy="100" rx="8" ry="5" fill="#7C3AED"
          transform="rotate(-25, 34, 100)" />
        <Ellipse cx="27" cy="105" rx="4" ry="3" fill="#9333EA"
          transform="rotate(-15, 27, 105)" />

        {/* ── Right small leg ── */}
        <Ellipse cx="86" cy="100" rx="8" ry="5" fill="#7C3AED"
          transform="rotate(25, 86, 100)" />
        <Ellipse cx="93" cy="105" rx="4" ry="3" fill="#9333EA"
          transform="rotate(15, 93, 105)" />

        {/* ── Eyes ── */}
        {/* Left eye */}
        <Circle cx="48" cy="68" r="7" fill="white" />
        <Circle cx="49" cy="68" r="4.5" fill="#1E1040" />
        <Circle cx="50.5" cy="66.5" r="1.5" fill="white" />
        {/* Right eye */}
        <Circle cx="72" cy="68" r="7" fill="white" />
        <Circle cx="73" cy="68" r="4.5" fill="#1E1040" />
        <Circle cx="74.5" cy="66.5" r="1.5" fill="white" />

        {/* ── Blush ── */}
        <Ellipse cx="40" cy="76" rx="6" ry="3.5" fill="#F0ABFC" opacity="0.6" />
        <Ellipse cx="80" cy="76" rx="6" ry="3.5" fill="#F0ABFC" opacity="0.6" />

        {/* ── Sad mouth ── */}
        <Path
          d="M 54 82 Q 60 78 66 82"
          stroke="#6D28D9"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Tear drop ── */}
        <Path
          d="M 44 74 Q 42 79 44 81 Q 46 79 44 74"
          fill="#93C5FD"
          opacity="0.9"
        />
      </Svg>
    </Animated.View>
  );
});
