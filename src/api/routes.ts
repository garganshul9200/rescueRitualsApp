/**
 * Central route map for the Events API.
 * Paths are relative to API_BASE_URL (`…/api`).
 */
export const eventRoutes = {
  list: '/events',
  detail: (id: string) => `/events/${id}`,
  create: '/events',
  update: (id: string) => `/events/${id}`,
  remove: (id: string) => `/events/${id}`,
} as const;
