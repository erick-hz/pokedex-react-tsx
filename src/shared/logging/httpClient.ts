import { logger } from '@shared/logging/logger';

export class HttpRequestError extends Error {
  readonly status: number;
  readonly url: string;
  readonly method: string;

  constructor(status: number, url: string, method = 'GET') {
    super(`Request failed: ${status}`);
    this.name = 'HttpRequestError';
    this.status = status;
    this.url = url;
    this.method = method;
  }
}

export async function requestJson<T>(
  url: string,
  options?: RequestInit,
  scope = 'api',
): Promise<T> {
  const method = options?.method ?? 'GET';

  try {
    const response = options ? await fetch(url, options) : await fetch(url);

    if (!response.ok) {
      const level = response.status >= 500 ? 'error' : 'warn';

      logger[level]('HTTP request failed', {
        scope,
        url,
        method,
        status: response.status,
      });

      throw new HttpRequestError(response.status, url, method);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof HttpRequestError) {
      throw error;
    }

    logger.error('HTTP request crashed before receiving a valid response', {
      scope,
      url,
      method,
      error,
    });

    throw error;
  }
}
