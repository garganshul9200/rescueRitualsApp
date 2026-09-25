import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors, spacing, typography} from '../theme';

type HeaderTextButtonProps = {
  label: string;
  onPress: () => void;
};

export function HeaderTextButton({label, onPress}: HeaderTextButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
});
