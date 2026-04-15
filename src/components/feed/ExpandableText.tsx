import React, { memo, useState, useCallback } from 'react';
import { Text, type NativeSyntheticEvent, type TextLayoutEventData } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface ExpandableTextProps {
  text: string;
  numberOfLines?: number;
  fontSize?: number;
  color?: string;
  lineHeight?: number;
}

export const ExpandableText = memo(function ExpandableText({
  text,
  numberOfLines = 2,
  fontSize = 14,
  color = '#6B6B6B',
  lineHeight = 20,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  // height in lines that we animate to
  const heightAnim = useSharedValue(lineHeight * numberOfLines);

  const onFullTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      const totalLines = e.nativeEvent.lines.length;
      if (totalLines > numberOfLines) {
        setIsTruncated(true);
      }
    },
    [numberOfLines]
  );

  const handleExpand = useCallback(() => {
    setExpanded(true);
    // animate height to auto isn't possible directly — we measure via onLayout
    heightAnim.value = withTiming(9999, { duration: 300, easing: Easing.out(Easing.quad) });
  }, [heightAnim]);

  const animatedStyle = useAnimatedStyle(() => ({
    overflow: 'hidden',
    maxHeight: expanded ? 9999 : heightAnim.value,
  }));

  return (
    <>
      {/* Hidden full text to measure line count */}
      {!isTruncated && (
        <Text
          onTextLayout={onFullTextLayout}
          style={{ position: 'absolute', opacity: 0, fontSize, lineHeight }}
          numberOfLines={0}
        >
          {text}
        </Text>
      )}

      {/* Visible animated text */}
      <Animated.View style={animatedStyle}>
        <Text
          style={{ fontSize, color, lineHeight }}
          numberOfLines={expanded ? undefined : numberOfLines}
        >
          {text}
        </Text>
      </Animated.View>

      {/* "Показать еще" — shown below when truncated and not expanded */}
      {isTruncated && !expanded && (
        <Text
          onPress={handleExpand}
          style={{ fontSize, color: '#7C3AED', marginTop: 2 }}
        >
          Показать еще
        </Text>
      )}
    </>
  );
});
