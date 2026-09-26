import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getApiErrorMessage} from '../../api/errors';
import {EmptyState} from '../../components/EmptyState';
import {ErrorState} from '../../components/ErrorState';
import {EventCard} from '../../components/EventCard';
import {LoadingState} from '../../components/LoadingState';
import {SearchBar} from '../../components/SearchBar';
import {getEvents} from '../../api/events';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {Event} from '../../types/event';
import {EventsStackParamList} from '../../types/navigation';

type Props = NativeStackScreenProps<EventsStackParamList, 'EventsList'>;

export function EventsListScreen({navigation}: Props) {
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadEvents = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      setEvents(await getEvents());
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load events.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const visibleEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return events;
    }

    return events.filter(event =>
      [event.title, event.description, event.location]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [events, searchQuery]);

  if (loading && !refreshing) {
    return <LoadingState message="Loading events…" />;
  }

  if (error && events.length === 0) {
    return <ErrorState message={error} onRetry={() => loadEvents()} />;
  }

  const countLabel = searchQuery
    ? visibleEvents.length === 0
      ? 'No results'
      : `${visibleEvents.length} found`
    : events.length === 0
      ? 'Nothing planned yet'
      : `${events.length} upcoming`;

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleEvents}
        keyExtractor={(item: Event) => item.id}
        renderItem={({item}) => (
          <EventCard
            event={item}
            onPress={id => navigation.navigate('EventDetail', {eventId: id})}
          />
        )}
        refreshing={refreshing}
        onRefresh={() => loadEvents(true)}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 40,
          },
          visibleEvents.length === 0 && styles.emptyList,
        ]}
        ListHeaderComponent={
          <View>
            <Text style={styles.heading}>Upcoming Events</Text>
            <Text style={styles.subheading}>{countLabel}</Text>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search events"
            />
            {error ? <Text style={styles.inlineError}>{error}</Text> : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title={searchQuery ? 'No matches' : 'No events yet'}
            message={
              searchQuery
                ? 'Try a different search term.'
                : 'Tap + to create your first event.'
            }
            actionLabel={searchQuery ? undefined : 'Create event'}
            onAction={
              searchQuery ? undefined : () => navigation.navigate('EventForm')
            }
          />
        }
      />
      <Pressable
        onPress={() => navigation.navigate('EventForm')}
        style={[styles.fab, {bottom: spacing.lg + insets.bottom}]}>
        <Text style={styles.fabLabel}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  emptyList: {
    flexGrow: 1,
  },
  heading: {
    ...typography.hero,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subheading: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  inlineError: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.fab,
  },
  fabLabel: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 30,
  },
});
