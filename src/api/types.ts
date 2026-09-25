export type ApiEvent = {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendies: number;
  __v?: number;
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  message?: string;
};
