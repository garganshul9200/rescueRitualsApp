export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  rsvpCount: number;
}

export type EventFormValues = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
};

export type EventFormErrors = Partial<Record<keyof EventFormValues, string>>;
