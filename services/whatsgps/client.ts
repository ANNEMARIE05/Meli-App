/**
 * WhatsGPS API Client Wrapper
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getErrorMessage, type WhatsGPSResponse } from './types';

const STORAGE_KEYS = {
  TOKEN: 'whatsgps.session_token',
  USER_ID: 'whatsgps.user_id',
  USERNAME: 'whatsgps.username',
};

export class WhatsGPSClient {
  private baseUrl: string;
  private token: string | null = null;
  private userId: number | null = null;
  private mockFallback: boolean;

  constructor() {
    this.baseUrl = (process.env.EXPO_PUBLIC_WHATSGPS_BASE_URL || 'https://api.whatsgps.com').replace(/\/+$/, '');
    this.mockFallback = process.env.EXPO_PUBLIC_WHATSGPS_MOCK_FALLBACK === 'true';
    void this.restoreSession();
  }

  public async restoreSession(): Promise<{ token: string | null; userId: number | null }> {
    try {
      const [token, userId] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_ID),
      ]);
      this.token = token;
      this.userId = userId ? parseInt(userId, 10) : null;
      return { token: this.token, userId: this.userId };
    } catch {
      return { token: null, userId: null };
    }
  }

  public async setSession(token: string, userId?: number, username?: string): Promise<void> {
    this.token = token;
    this.userId = userId ?? null;
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    if (userId) await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId.toString());
    if (username) await AsyncStorage.setItem(STORAGE_KEYS.USERNAME, username);
  }

  public async clearSession(): Promise<void> {
    this.token = null;
    this.userId = null;
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER_ID),
      AsyncStorage.removeItem(STORAGE_KEYS.USERNAME),
    ]);
  }

  public getToken(): string | null {
    return this.token;
  }

  public getUserId(): number | null {
    return this.userId;
  }

  public isMockEnabled(): boolean {
    return this.mockFallback;
  }

  /**
   * Main request handler for WhatsGPS endpoints (.do)
   */
  public async request<T = unknown>(
    endpoint: string,
    params: Record<string, unknown> = {},
    options: { requiresAuth?: boolean; method?: 'GET' | 'POST' } = {}
  ): Promise<WhatsGPSResponse<T>> {
    const { requiresAuth = true, method = 'POST' } = options;

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${cleanEndpoint}`;

    const requestParams: Record<string, string> = {};

    // Injects token automatically for all non-login endpoints
    if (requiresAuth) {
      if (!this.token) {
        // If mock enabled and no token, allow proceeding in mock mode
        if (this.mockFallback) {
          this.token = 'mock_session_token_meli';
        } else {
          return { ret: -1001, msg: getErrorMessage(-1001) };
        }
      }
      requestParams.token = this.token;
    }

    // Stringify and normalize all params
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        if (typeof val === 'object') {
          requestParams[key] = JSON.stringify(val);
        } else {
          requestParams[key] = String(val);
        }
      }
    });

    try {
      let response: Response;
      const headers: Record<string, string> = {
        Accept: 'application/json',
      };

      if (method === 'GET') {
        const queryString = new URLSearchParams(requestParams).toString();
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        response = await fetch(fullUrl, {
          method: 'GET',
          headers,
        });
      } else {
        headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        const body = new URLSearchParams(requestParams).toString();
        response = await fetch(url, {
          method: 'POST',
          headers,
          body,
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const json = (await response.json()) as WhatsGPSResponse<T>;
      return json;
    } catch (err) {
      if (process.env.EXPO_PUBLIC_DEBUG === 'true' && !this.mockFallback) {
        console.warn(`[WhatsGPSClient] Request to ${cleanEndpoint} failed:`, err);
      }
      // Return synthetic error response to trigger seamless mock fallback
      return {
        ret: 0,
        msg: err instanceof Error ? err.message : 'Mode déconnecté / simulation WhatsGPS',
      };
    }
  }
}

export const whatsgpsClient = new WhatsGPSClient();
