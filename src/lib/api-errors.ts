export interface NormalizedApiError {
  message: string;
  statusCode?: number;
}

export function normalizeApiError(error: unknown, fallback = 'Something went wrong. Please try again.'): NormalizedApiError {
  if (error && typeof error === 'object') {
    if ('message' in error && typeof (error as { message?: unknown }).message === 'string') {
      return {
        message: (error as { message: string }).message,
        statusCode: 'statusCode' in error && typeof (error as { statusCode?: unknown }).statusCode === 'number'
          ? (error as { statusCode: number }).statusCode
          : undefined,
      };
    }

    if ('error' in error && typeof (error as { error?: unknown }).error === 'string') {
      return {
        message: (error as { error: string }).error,
      };
    }
  }

  return { message: fallback };
}
