import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {EventFormErrors, EventFormValues} from '../types/event';
import {colors, spacing, typography} from '../theme';
import {Button} from './Button';
import {DateTimeField} from './DateTimeField';
import {TextField} from './TextField';

type EventFormProps = {
  values: EventFormValues;
  errors: EventFormErrors;
  submitting: boolean;
  submitLabel: string;
  onChange: <K extends keyof EventFormValues>(
    field: K,
    value: EventFormValues[K],
  ) => void;
  onSubmit: () => void;
};

export function EventForm({
  values,
  errors,
  submitting,
  submitLabel,
  onChange,
  onSubmit,
}: EventFormProps) {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>Fill in the basics. You can edit later.</Text>

        <TextField
          label="Title"
          value={values.title}
          onChangeText={text => onChange('title', text)}
          error={errors.title}
          placeholder="Event title"
          maxLength={80}
          returnKeyType="next"
          autoCapitalize="sentences"
        />

        <TextField
          label="Description"
          value={values.description}
          onChangeText={text => onChange('description', text)}
          error={errors.description}
          placeholder="What should people know?"
          multiline
          maxLength={500}
          autoCapitalize="sentences"
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <DateTimeField
              label="Date"
              mode="date"
              value={values.date}
              error={errors.date}
              onChange={value => onChange('date', value)}
            />
          </View>
          <View style={styles.half}>
            <DateTimeField
              label="Time"
              mode="time"
              value={values.time}
              error={errors.time}
              onChange={value => onChange('time', value)}
            />
          </View>
        </View>

        <TextField
          label="Location"
          value={values.location}
          onChangeText={text => onChange('location', text)}
          error={errors.location}
          placeholder="Venue or address"
          maxLength={120}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />

        <Button
          label={submitLabel}
          onPress={onSubmit}
          loading={submitting}
          style={styles.submit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  intro: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  half: {
    flex: 1,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
