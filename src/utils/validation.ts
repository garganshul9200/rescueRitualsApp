import {EventFormErrors, EventFormValues} from '../types/event';

type Field = keyof EventFormValues;

function required(value: string, label: string): string | undefined {
  if (!value) {
    return `${label} is required.`;
  }
}

function lengthBetween(
  value: string,
  label: string,
  min: number,
  max: number,
): string | undefined {
  if (value.length < min) {
    return `${label} must be at least ${min} characters.`;
  }
  if (value.length > max) {
    return `${label} must be ${max} characters or fewer.`;
  }
}

export function validateEventForm(values: EventFormValues): EventFormErrors {
  const title = values.title.trim();
  const description = values.description.trim();
  const location = values.location.trim();
  const date = values.date.trim();
  const time = values.time.trim();

  const checks: Array<[Field, string | undefined]> = [
    ['title', required(title, 'Title') ?? lengthBetween(title, 'Title', 3, 80)],
    [
      'description',
      required(description, 'Description') ??
        lengthBetween(description, 'Description', 10, 500),
    ],
    [
      'date',
      required(date, 'Date'),
    ],
    [
      'time',
      required(time, 'Time'),
    ],
    [
      'location',
      required(location, 'Location') ??
        lengthBetween(location, 'Location', 3, 120),
    ],
  ];

  return Object.fromEntries(
    checks.filter(([, message]) => message),
  ) as EventFormErrors;
}

export function hasFormErrors(errors: EventFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
