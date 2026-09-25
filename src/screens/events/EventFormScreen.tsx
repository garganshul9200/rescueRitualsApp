import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getApiErrorMessage} from '../../api/errors';
import {ErrorState} from '../../components/ErrorState';
import {EventForm} from '../../components/EventForm';
import {LoadingState} from '../../components/LoadingState';
import {ScreenHeader} from '../../components/ScreenHeader';
import {createEvent, getEvent, updateEvent} from '../../api/events';
import {colors} from '../../theme';
import {EventFormErrors, EventFormValues} from '../../types/event';
import {EventsStackParamList} from '../../types/navigation';
import {hasFormErrors, validateEventForm} from '../../utils/validation';

type Props = NativeStackScreenProps<EventsStackParamList, 'EventForm'>;

const EMPTY_FORM: EventFormValues = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
};

export function EventFormScreen({navigation, route}: Props) {
  const eventId = route.params?.eventId;
  const isEditing = Boolean(eventId);

  const [values, setValues] = useState<EventFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<EventFormErrors>({});
  const [loading, setLoading] = useState(isEditing);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!eventId) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const event = await getEvent(eventId);
        if (cancelled) {
          return;
        }

        setValues({
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
        });
      } catch (err) {
        if (cancelled) {
          return;
        }
        setLoadError(getApiErrorMessage(err, 'Unable to load event.'));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const handleChange = <K extends keyof EventFormValues>(
    field: K,
    value: EventFormValues[K],
  ) => {
    setValues(current => ({...current, [field]: value}));
    if (errors[field]) {
      setErrors(current => {
        const next = {...current};
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    const nextErrors = validateEventForm(values);
    setErrors(nextErrors);

    if (hasFormErrors(nextErrors) || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      if (isEditing && eventId) {
        await updateEvent(eventId, values);
        Alert.alert('Event updated', `"${values.title}" has been saved.`, [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        const created = await createEvent(values);
        Alert.alert('Event created', `"${created.title}" is now live.`, [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (err) {
      Alert.alert(
        'Save failed',
        getApiErrorMessage(err, 'Unable to save event.'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={isEditing ? 'Edit Event' : 'Create Event'}
        onBack={() => navigation.goBack()}
      />

      {loading ? (
        <LoadingState message="Loading event…" />
      ) : loadError ? (
        <ErrorState
          message={loadError}
          onRetry={() => navigation.replace('EventForm', {eventId})}
        />
      ) : (
        <EventForm
          values={values}
          errors={errors}
          submitting={submitting}
          submitLabel={isEditing ? 'Save changes' : 'Create event'}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
