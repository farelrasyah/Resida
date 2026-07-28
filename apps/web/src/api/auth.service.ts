import { request } from './client';
import type { ApiResponse, LoginResponseData, User } from '../types/api.types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  login: async (emailOrCredentials: string | LoginCredentials, password?: string): Promise<ApiResponse<LoginResponseData>> => {
    const payload = typeof emailOrCredentials === 'string'
      ? { email: emailOrCredentials, password: password || '' }
      : emailOrCredentials;

    return request<LoginResponseData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return request<User>('/auth/me', {
      method: 'GET',
    });
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return request<null>('/auth/logout', {
      method: 'POST',
    });
  },
};
