/**
 * Central HTTP client for the Lumina API.
 * - Uses fetch (works in both server and browser).
 * - Reads JWT from localStorage on the browser and adds Authorization header.
 * - Normalizes { success, data, error, meta } responses.
 */

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: { page: number; limit: number; total: number };
}

export class ApiError extends Error {
  status: number;
  data?: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const TOKEN_KEY = 'lumina.token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

/**
 * Resolve the base URL.
 * - In the browser we use "/api" (Next.js rewrites forward it to the backend).
 * - On the server (SSR / route handlers) we hit the backend directly.
 */
function baseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  }
  return '/api';
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  auth?: boolean; // include Authorization header (default: true)
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(
    path.startsWith('/') ? `${baseUrl()}${path}` : `${baseUrl()}/${path}`,
    typeof window === 'undefined' ? 'http://localhost' : window.location.origin
  );
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue;
      url.searchParams.set(k, String(v));
    }
  }
  return typeof window === 'undefined' ? url.toString() : `${url.pathname}${url.search}`;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiEnvelope<T>> {
  const {
    method = 'GET',
    body,
    query,
    headers = {},
    auth = true,
    signal,
    cache,
    next,
  } = options;

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };
  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json';
  }
  if (auth) {
    const token = getToken();
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers: finalHeaders,
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
      signal,
      cache,
      // @ts-expect-error Next.js augmented option
      next,
    });
  } catch (err) {
    throw new ApiError((err as Error).message || 'Network error', 0);
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await res.json().catch(() => ({})) : ({} as ApiEnvelope);

  if (!res.ok) {
    const message =
      (payload as ApiEnvelope).error ||
      (payload as ApiEnvelope).message ||
      `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, payload);
  }

  return payload as ApiEnvelope<T>;
}

export const api = {
  get: <T = unknown>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...opts, method: 'GET' }),
  post: <T = unknown>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method'>) =>
    apiFetch<T>(path, { ...opts, method: 'POST', body }),
  put: <T = unknown>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method'>) =>
    apiFetch<T>(path, { ...opts, method: 'PUT', body }),
  patch: <T = unknown>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method'>) =>
    apiFetch<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T = unknown>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...opts, method: 'DELETE' }),
};
