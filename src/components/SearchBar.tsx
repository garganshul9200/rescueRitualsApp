import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {colors, radius, spacing, typography} from '../theme';

const SEARCH_DEBOUNCE_MS = 400;

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search events',
}: SearchBarProps) {
  const [text, setText] = useState(value);
  const onChangeTextRef = useRef(onChangeText);
  onChangeTextRef.current = onChangeText;

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (text !== value) {
        onChangeTextRef.current(text);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [text, value]);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>
        🔍️
      </Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    minHeight: 48,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  icon: {
    ...typography.body,
    color: colors.textMuted,
    fontSize: 18,
  },
  input: {
    flex: 1,
    minHeight: 48,
    color: colors.text,
    paddingVertical: spacing.sm,
    ...typography.body,
  },
});
