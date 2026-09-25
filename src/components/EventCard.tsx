import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {moderateScale, scale} from 'react-native-size-matters';
import {Event} from '../types/event';
import {colors, radius, shadows, spacing, typography} from '../theme';

type EventCardProps = {
  event: Event;
  onPress: (eventId: string) => void;
};

function formatWhen(date: string, time: string) {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  if (!year || Number.isNaN(hours)) {
    return `${date} · ${time}`;
  }

  const value = new Date(year, month - 1, day, hours, minutes || 0);
  return `${value.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })} · ${value.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })}`;
}

function EventCardComponent({event, onPress}: EventCardProps) {
  const initial = event.title.trim().charAt(0).toUpperCase() || '?';

  return (
    <Pressable
      onPress={() => onPress(event.id)}
      style={({pressed}) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <Text style={styles.meta} numberOfLines={1}>
          {formatWhen(event.date, event.time)}
        </Text>

        <Text style={styles.location} numberOfLines={1}>
          {event.location}
        </Text>

        <Text style={styles.count}>
          {event.rsvpCount} {event.rsvpCount === 1 ? 'person' : 'people'}
        </Text>
      </View>

      <View style={styles.chevronBtn}>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

export const EventCard = memo(EventCardComponent);

const AVATAR_SIZE = moderateScale(32);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.94,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  chevronBtn: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginLeft: spacing.sm,
  },
  chevron: {
    fontSize: scale(26),
    color: colors.textMuted,
    marginTop: -7,
  },
  meta: {
    ...typography.caption,
    color: colors.primary,
    marginBottom: 2,
  },
  location: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  count: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
