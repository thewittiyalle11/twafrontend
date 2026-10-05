import type { ApiError } from '@twa/shared';

export class ApiClientError extends Error {
  status: number;
  details?: ApiError;

  constructor(message: string, status: number, details?: ApiError) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.details = details;
  }
}

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return (
      (window as unknown as { __API_BASE_URL__?: string }).__API_BASE_URL__ ??
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      process.env.VITE_API_BASE_URL ??
      '/api'
    );
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.VITE_API_BASE_URL ?? '/api';
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('twa_auth_token', token);
    else localStorage.removeItem('twa_auth_token');
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('twa_auth_token');
  }
  return null;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let errorBody: ApiError | undefined;
    try {
      errorBody = await response.json();
    } catch {
      // ignore
    }
    throw new ApiClientError(
      errorBody?.message ?? `Request failed with status ${response.status}`,
      response.status,
      errorBody
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function buildQuery<T extends { [K in keyof T]: string | number | undefined }>(params: T): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}
