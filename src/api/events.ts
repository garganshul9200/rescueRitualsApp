import {Event, EventFormValues} from '../types/event';
import {apiClient} from './client';
import {eventRoutes} from './routes';
import {ApiEvent, ApiSuccessResponse} from './types';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** API "7:00 AM" → form HH:mm */
function toFormTime(time: string) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) {
    return time;
  }

  let hour = Number(match[1]);
  const period = match[3].toUpperCase();

  if (period === 'AM' && hour === 12) {
    hour = 0;
  } else if (period === 'PM' && hour !== 12) {
    hour += 12;
  }

  return `${pad(hour)}:${match[2]}`;
}

/** Form HH:mm → API "07:00 AM" */
function toApiTime(time: string) {
  if (/AM|PM/i.test(time)) {
    return time;
  }

  let hour = Number(time.slice(0, 2));
  const minute = time.slice(3);
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${pad(hour)}:${minute} ${period}`;
}

function mapEvent(api: ApiEvent): Event {
  return {
    id: api._id,
    title: api.title,
    description: api.description,
    date: api.date.slice(0, 10),
    time: toFormTime(api.time),
    location: api.location,
    rsvpCount: api.attendies ?? 0,
  };
}

function toBody(input: EventFormValues) {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    date: input.date.trim(),
    time: toApiTime(input.time.trim()),
    location: input.location.trim(),
  };
}

export async function getEvents(query?: string): Promise<Event[]> {
  const {data} = await apiClient.get<ApiSuccessResponse<ApiEvent[]>>(
    eventRoutes.list,
  );

  const q = query?.trim().toLowerCase();
  return (data.data ?? [])
    .map(mapEvent)
    .filter(
      event =>
        !q ||
        [event.title, event.description, event.location]
          .join(' ')
          .toLowerCase()
          .includes(q),
    )
    .sort((a, b) =>
      `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
    );
}

export async function getEvent(id: string): Promise<Event> {
  const {data} = await apiClient.get<ApiSuccessResponse<ApiEvent>>(
    eventRoutes.detail(id),
  );
  return mapEvent(data.data);
}

export async function createEvent(input: EventFormValues): Promise<Event> {
  const {data} = await apiClient.post<ApiSuccessResponse<ApiEvent>>(
    eventRoutes.create,
    toBody(input),
  );
  return mapEvent(data.data);
}

export async function updateEvent(
  id: string,
  input: EventFormValues,
): Promise<void> {
  await apiClient.put(eventRoutes.update(id), toBody(input));
}

export async function deleteEvent(id: string): Promise<void> {
  await apiClient.delete(eventRoutes.remove(id));
}
