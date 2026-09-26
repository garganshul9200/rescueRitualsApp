# Events App

React Native client for browsing and managing events. It lists upcoming events, searches them locally, and creates, edits, and deletes events through the Events API.

## Features

- Upcoming events list, sorted by date and time, with pull to refresh
- Search across title, description, and location
- Event detail with date, time, location, description, and attendee count
- Create and edit events in a modal form
- Delete an event with confirmation
- Local RSVP toggle on the detail screen (not sent to the API)
- Loading, empty, and error states, including retry

## Tech stack

- React Native 0.87 and React 19
- TypeScript
- React Navigation (native stack)
- Axios
- Node.js 22.11 or newer

## Prerequisites

Complete the [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment) for your platform before running the app.

## Getting started

Install dependencies:

```sh
npm install
```

Start Metro:

```sh
npm start
```

In a second terminal, run the app.

### Android

```sh
npm run android
```

### iOS

Install CocoaPods the first time you clone the repo, and again after native dependency changes:

```sh
bundle install
bundle exec pod install
```

Then:

```sh
npm run ios
```

The app talks to a hosted API. No local backend is required. The base URL is set in `src/api/config.ts`.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Metro bundler |
| `npm run android` | Build and run on Android |
| `npm run ios` | Build and run on iOS |
| `npm run build_android` | Assemble an Android release APK |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest |

## API

Requests go to `https://events-backend-985226427488.asia-south1.run.app/api`.

| Method | Path | Use |
| --- | --- | --- |
| `GET` | `/events` | List events |
| `GET` | `/events/:id` | Event detail |
| `POST` | `/events` | Create an event |
| `PUT` | `/events/:id` | Update an event |
| `DELETE` | `/events/:id` | Delete an event |

Create and update send `title`, `description`, `date` (`YYYY-MM-DD`), `time` (`hh:mm AM/PM`), and `location`. The client stores time as `HH:mm` and converts it at the API boundary. Search filters the list response on the device; it is not a query parameter.

Form rules: title 3–80 characters, description 10–500, location 3–120, and date and time are required.

## Project structure

```
App.tsx                      App shell and navigation container
src/api/                     Axios client, routes, and event requests
src/components/              Shared UI (cards, form, states, header)
src/navigation/              Events stack
src/screens/events/          List, detail, and form screens
src/theme/                   Colors, spacing, and typography
src/types/                   Event and navigation types
src/utils/                   Form validation
```

## Screens

1. **Events list** — default screen. Tap a card for details, or the + button to create an event.
2. **Event detail** — view, RSVP locally, edit, or delete.
3. **Event form** — modal for creating an event, or editing one when opened with an `eventId`.
