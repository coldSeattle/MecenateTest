import React, { memo, useState, useCallback, useRef } from 'react';
import {
  TextInput,
  Pressable,
  useColorScheme,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { XStack } from 'tamagui';
import { MaterialIcons } from '@expo/vector-icons';

interface CommentInputProps {
  onSubmit: (text: string) => void;
  isSubmitting?: boolean;
}

export const CommentInput = memo(function CommentInput({
  onSubmit,
  isSubmitting = false,
}: CommentInputProps) {
  const isDark = useColorScheme() === 'dark';
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const bg = isDark ? '#0D0D14' : '#FFFFFF';
  const borderColor = isDark ? '#2C2C3E' : '#E8E8EC';
  const inputBg = isDark ? '#1C1C2E' : '#F5F5F7';
  const placeholderColor = isDark ? '#55556A' : '#ABABAB';
  const textColor = isDark ? '#F0F0FF' : '#111111';
  const canSend = text.trim().length > 0 && !isSubmitting;

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;
    onSubmit(trimmed);
    setText('');
    inputRef.current?.blur();
  }, [text, isSubmitting, onSubmit]);

  return (
    <XStack
      paddingHorizontal="$4"
      paddingVertical="$3"
      gap={10}
      alignItems="flex-end"
      style={{
        backgroundColor: bg,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: borderColor,
      }}
    >
      <XStack
        flex={1}
        borderRadius={20}
        paddingHorizontal={14}
        paddingVertical={10}
        style={{ backgroundColor: inputBg }}
      >
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={setText}
          placeholder="Ваш текст"
          placeholderTextColor={placeholderColor}
          multiline
          returnKeyType="send"
          blurOnSubmit
          onSubmitEditing={handleSend}
          style={[styles.input, { color: textColor }]}
        />
      </XStack>

      <Pressable
        onPress={handleSend}
        disabled={!canSend}
        style={[
          styles.sendBtn,
          { backgroundColor: canSend ? '#7C3AED' : isDark ? '#2A2A3A' : '#D8D8E8' },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Отправить комментарий"
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <MaterialIcons
            name="arrow-upward"
            size={20}
            color={canSend ? 'white' : isDark ? '#55556A' : '#ABABAB'}
          />
        )}
      </Pressable>
    </XStack>
  );
});

const styles = StyleSheet.create({
  input: { fontSize: 15, lineHeight: 20, maxHeight: 100, padding: 0, flex: 1 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});
