import { normalizeApiError } from './api-errors';

export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export function toApiError(error: unknown, fallback: string): ApiError {
  const normalized = normalizeApiError(error, fallback);
  return new ApiError(normalized.message, normalized.statusCode);
}
