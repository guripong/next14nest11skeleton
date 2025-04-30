export interface ServiceResponse<T> {
  valid: boolean;
  data?: T;
  errorMsg?: string;
}
