import React, {useState} from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {colors, radius, spacing, typography} from '../theme';

type Mode = 'date' | 'time';

type Props = {
  label: string;
  mode: Mode;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function toPickerDate(value: string, mode: Mode): Date {
  if (!value) {
    return new Date();
  }

  if (mode === 'date') {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const [hours, minutes] = value.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes || 0, 0, 0);
  return date;
}

function fromPickerDate(date: Date, mode: Mode): string {
  if (mode === 'date') {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatValue(value: string, mode: Mode): string {
  if (!value) {
    return `Select ${mode}`;
  }

  const date = toPickerDate(value, mode);
  return mode === 'date'
    ? date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : date.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      });
}

export function DateTimeField({label, mode, value, error, onChange}: Props) {
  const [open, setOpen] = useState(false);
  const selected = toPickerDate(value, mode);

  const apply = (event: DateTimePickerEvent, next?: Date) => {
    if (Platform.OS === 'android') {
      setOpen(false);
      if (event.type !== 'set' || !next) {
        return;
      }
    }
    if (next) {
      onChange(fromPickerDate(next, mode));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.input, error && styles.inputError]}>
        <Text style={[styles.value, !value && styles.placeholder]}>
          {formatValue(value, mode)}
        </Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {open && Platform.OS === 'android' && (
        <DateTimePicker value={selected} mode={mode} onChange={apply} />
      )}

      {Platform.OS === 'ios' && (
        <Modal transparent visible={open} animationType="slide">
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <Pressable style={styles.doneWrap} onPress={() => setOpen(false)}>
              <Text style={styles.done}>Done</Text>
            </Pressable>
            <DateTimePicker
              value={selected}
              mode={mode}
              display="spinner"
              onChange={apply}
            />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {marginBottom: spacing.lg},
  label: {
    ...typography.label,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  input: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  inputError: {borderWidth: 1.5, borderColor: colors.danger},
  value: {...typography.body, color: colors.text},
  placeholder: {color: colors.textMuted},
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  backdrop: {flex: 1, backgroundColor: colors.overlay},
  sheet: {backgroundColor: colors.surface, paddingBottom: spacing.xl},
  doneWrap: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  done: {...typography.bodyStrong, color: colors.primary},
});
