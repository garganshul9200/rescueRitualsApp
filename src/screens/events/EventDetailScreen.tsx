import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {moderateScale} from 'react-native-size-matters';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getApiErrorMessage} from '../../api/errors';
import {Button} from '../../components/Button';
import {ErrorState} from '../../components/ErrorState';
import {HeaderTextButton} from '../../components/HeaderTextButton';
import {LoadingState} from '../../components/LoadingState';
import {ScreenHeader} from '../../components/ScreenHeader';
import {deleteEvent, getEvent} from '../../api/events';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {Event} from '../../types/event';
import {EventsStackParamList} from '../../types/navigation';

type Props = NativeStackScreenProps<EventsStackParamList, 'EventDetail'>;

function formatDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  if (!year) {
    return date;
  }
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  if (Number.isNaN(hours)) {
    return time;
  }
  const value = new Date();
  value.setHours(hours, minutes || 0, 0, 0);
  return value.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function EventDetailScreen({navigation, route}: Props) {
  const insets = useSafeAreaInsets();
  const {eventId} = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const loadEvent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEvent(await getEvent(eventId));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load this event.'));
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useFocusEffect(
    useCallback(() => {
      loadEvent();
    }, [loadEvent]),
  );

  const handleDelete = () => {
    if (!event || deleting) {
      return;
    }

    const {id, title} = event;

    Alert.alert(
      'Delete event?',
      `"${title}" will be permanently removed. This can't be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteEvent(id);
              navigation.goBack();
            } catch (err) {
              Alert.alert(
                'Delete failed',
                getApiErrorMessage(err, 'Unable to delete event.'),
              );
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Details"
        onBack={() => navigation.goBack()}
        right={
          event ? (
            <HeaderTextButton
              label="Edit"
              onPress={() =>
                navigation.navigate('EventForm', {eventId: event.id})
              }
            />
          ) : null
        }
      />

      {loading && !event ? (
        <LoadingState message="Loading event…" />
      ) : error && !event ? (
        <ErrorState message={error} onRetry={loadEvent} />
      ) : !event ? (
        <ErrorState
          title="Event unavailable"
          message="This event could not be found."
          onRetry={() => navigation.goBack()}
        />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.count}>
              {event.rsvpCount} {event.rsvpCount === 1 ? 'person' : 'people'}
            </Text>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.subtitle}>
              {formatDate(event.date)} · {formatTime(event.time)}
            </Text>

            <View style={styles.card}>
              <Row label="Date" value={formatDate(event.date)} />
              <View style={styles.divider} />
              <Row label="Time" value={formatTime(event.time)} />
              <View style={styles.divider} />
              <Row label="Location" value={event.location} />
            </View>

            <Text style={styles.section}>About</Text>
            <Text style={styles.description}>{event.description}</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>

          <View
            style={[styles.footer, {paddingBottom: spacing.lg + insets.bottom}]}>
            <Button
              label={confirmed ? 'Entry confirmed' : 'RSVP'}
              variant={confirmed ? 'ghost' : 'primary'}
              onPress={() => setConfirmed(v => !v)}
              disabled={deleting}
              style={styles.rsvpButton}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete event"
              disabled={deleting}
              onPress={handleDelete}
              style={({pressed}) => [
                styles.deleteButton,
                pressed && !deleting && styles.deletePressed,
                deleting && styles.deleteDisabled,
              ]}>
              {deleting ? (
                <ActivityIndicator color={colors.danger} />
              ) : (
                <Image
                  source={require('../../assets/icons/bin.png')}
                  style={styles.binIcon}
                  resizeMode="contain"
                />
              )}
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  count: {
    ...typography.caption,
    color: colors.textMuted,
  },
  title: {
    ...typography.hero,
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  row: {
    paddingVertical: spacing.md,
  },
  rowLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  rowValue: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  section: {
    ...typography.label,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  rsvpButton: {
    flex: 1,
  },
  deleteButton: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deletePressed: {
    opacity: 0.85,
    transform: [{scale: 0.96}],
  },
  deleteDisabled: {
    opacity: 0.5,
  },
  binIcon: {
    width: moderateScale(28),
    height: moderateScale(28),
    tintColor: colors.danger,
  },
});
