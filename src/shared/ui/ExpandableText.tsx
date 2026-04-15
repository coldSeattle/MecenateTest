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
  const heightAnim = useSharedValue(lineHeight * numberOfLines);

  const onFullTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      if (e.nativeEvent.lines.length > numberOfLines) setIsTruncated(true);
    },
    [numberOfLines]
  );

  const handleExpand = useCallback(() => {
    setExpanded(true);
    heightAnim.value = withTiming(9999, { duration: 300, easing: Easing.out(Easing.quad) });
  }, [heightAnim]);

  const animatedStyle = useAnimatedStyle(() => ({
    overflow: 'hidden',
    maxHeight: expanded ? 9999 : heightAnim.value,
  }));

  return (
    <>
      {!isTruncated && (
        <Text
          onTextLayout={onFullTextLayout}
          style={{ position: 'absolute', opacity: 0, fontSize, lineHeight }}
          numberOfLines={0}
        >
          {text}
        </Text>
      )}
      <Animated.View style={animatedStyle}>
        <Text style={{ fontSize, color, lineHeight }} numberOfLines={expanded ? undefined : numberOfLines}>
          {text}
        </Text>
      </Animated.View>
      {isTruncated && !expanded && (
        <Text onPress={handleExpand} style={{ fontSize, color: '#7C3AED', marginTop: 2 }}>
          Показать еще
        </Text>
      )}
    </>
  );
});
