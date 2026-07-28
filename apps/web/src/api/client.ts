import type { ApiResponse } from '../types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export class ApiError extends Error {
  public status: number;
  public errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('resida_token') || localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('resida_token', token);
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('resida_token');
    localStorage.removeItem('auth_token');
  }
};

type OnUnauthorizedCallback = () => void;
let unauthorizedListener: OnUnauthorizedCallback | null = null;

export const setUnauthorizedListener = (listener: OnUnauthorizedCallback | null) => {
  unauthorizedListener = listener;
};

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is NOT FormData, set Content-Type to application/json
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, config);
    const data: ApiResponse<T> = await response.json().catch(() => ({
      success: false,
      message: 'Gagal memproses respon dari server',
      data: null as T,
    }));

    if (!response.ok) {
      if (response.status === 401) {
        setAuthToken(null);
        if (unauthorizedListener) {
          unauthorizedListener();
        }
      }

      throw new ApiError(
        data.message || `HTTP ${response.status} Error`,
        response.status,
        data.errors
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Koneksi ke server gagal',
      0
    );
  }
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> => {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    return request<T>(url, { method: 'GET' });
  },

  post: <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put: <T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  upload: <T>(endpoint: string, formData: FormData, method: 'POST' | 'PUT' = 'POST'): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, {
      method,
      body: formData,
    });
  },
};
