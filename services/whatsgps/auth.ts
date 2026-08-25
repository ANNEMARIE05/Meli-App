/**
 * WhatsGPS Auth & User Management Service (Section 4.1)
 */

import { whatsgpsClient } from './client';
import {
  type WhatsGPSResponse,
  type WhatsGPSUserData,
  UserType,
} from './types';

export interface LoginParams {
  name: string;
  password: string;
  timeZoneSecond?: number; // Default: 0 or UTC offset in seconds
  lang?: 'zh_CN' | 'zh_HK' | 'en' | 'fr' | 'ar' | 'vi';
}

export interface LoginResult {
  token: string;
  userId: number;
  userName: string;
  name: string;
  userType: UserType;
  parentId?: number;
}

export interface CarStatusCount {
  allCount: number;
  onlineCount: number;
  offlineCount: number;
  notActiveCount: number;
  userId: number;
  userName: string;
  name: string;
  userType: UserType;
}

export const authService = {
  /**
   * 4.1.1 Login - Returns token and user metadata
   */
  async login(params: LoginParams): Promise<WhatsGPSResponse<LoginResult>> {
    const res = await whatsgpsClient.request<LoginResult>(
      '/user/login.do',
      {
        name: params.name,
        password: params.password,
        timeZoneSecond: params.timeZoneSecond ?? 0,
        lang: params.lang ?? 'fr',
      },
      { requiresAuth: false, method: 'POST' }
    );

    if (res.ret === 1 && res.data?.token) {
      await whatsgpsClient.setSession(res.data.token, res.data.userId, res.data.userName);
    } else if (whatsgpsClient.isMockEnabled()) {
      // Mock login for offline / development testing
      const mockResult: LoginResult = {
        token: 'mock_token_' + Date.now(),
        userId: 102537,
        userName: params.name || 'meli_fleet_manager',
        name: 'Meli Transport',
        userType: UserType.GENERAL_USER,
      };
      await whatsgpsClient.setSession(mockResult.token, mockResult.userId, mockResult.userName);
      return { ret: 1, data: mockResult, msg: 'Connecté (Mode Simulation)' };
    }

    return res;
  },

  /**
   * 4.1.2 Access to user information
   */
  async getUserInfo(userId?: number): Promise<WhatsGPSResponse<WhatsGPSUserData>> {
    const res = await whatsgpsClient.request<WhatsGPSUserData>('/user/getByUserId.do', {
      userId: userId ?? whatsgpsClient.getUserId(),
    });

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      return {
        ret: 1,
        data: {
          userId: userId || 102537,
          userName: 'meli_fleet_manager',
          name: 'Hamed Kouadio',
          userType: UserType.GENERAL_USER,
          linkMan: 'Hamed Kouadio',
          linkPhone: '+225 07 12 34 56 78',
          email: 'h.kouadio@meli.app',
          allCount: 5,
          onlineCount: 3,
          offlineCount: 1,
          notActiveCount: 1,
        },
      };
    }

    return res;
  },

  /**
   * 4.1.3 Get Vehicle Status Statistics (Total, online, offline, inactive)
   */
  async getCarStatusCount(includeSubFlag = false): Promise<WhatsGPSResponse<CarStatusCount>> {
    const res = await whatsgpsClient.request<CarStatusCount>('/user/getCarStatusCount.do', {
      includeSubFlag,
    });

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      return {
        ret: 1,
        data: {
          allCount: 5,
          onlineCount: 3,
          offlineCount: 1,
          notActiveCount: 1,
          userId: 102537,
          userName: 'meli_fleet_manager',
          name: 'Meli Fleet Abidjan',
          userType: UserType.GENERAL_USER,
        },
      };
    }

    return res;
  },

  /**
   * 4.1.4 Get sub-users by parent ID with pagination
   */
  async getUsersByParentId(parentId?: number, pageNO = 1, rowCount = 20): Promise<WhatsGPSResponse<WhatsGPSUserData[]>> {
    return whatsgpsClient.request<WhatsGPSUserData[]>('/user/getByParentIdPage.do', {
      parentId: parentId ?? whatsgpsClient.getUserId(),
      pageNO,
      rowCount,
    });
  },

  /**
   * 4.1.6 Add new sub-user
   */
  async addUser(userData: Partial<WhatsGPSUserData> & { userName: string; password: string; name: string }): Promise<WhatsGPSResponse<{ userId: number }>> {
    return whatsgpsClient.request<{ userId: number }>('/user/add.do', {
      parentId: userData.parentId ?? whatsgpsClient.getUserId(),
      userType: userData.userType ?? UserType.VEHICLE_USER,
      ...userData,
    });
  },

  /**
   * 4.1.7 Update user information
   */
  async updateUser(userData: Partial<WhatsGPSUserData> & { userId: number }): Promise<WhatsGPSResponse<void>> {
    return whatsgpsClient.request<void>('/user/update.do', userData);
  },

  /**
   * 4.1.8 Delete user
   */
  async deleteUser(userId: number): Promise<WhatsGPSResponse<void>> {
    return whatsgpsClient.request<void>('/user/del.do', { userId });
  },

  /**
   * 4.1.9 Modify logged-in user password
   */
  async updatePassword(oldPassword: string, newPassword: string): Promise<WhatsGPSResponse<void>> {
    return whatsgpsClient.request<void>('/user/updatePsw.do', {
      oldPassword,
      newPassword,
    });
  },

  /**
   * 4.1.10 Reset user password (by admin/parent)
   */
  async resetPassword(userId: number, newPassword = 'password123', userType = UserType.VEHICLE_USER): Promise<WhatsGPSResponse<void>> {
    return whatsgpsClient.request<void>('/user/resetPsw.do', {
      id: userId,
      type: userType,
      password: newPassword,
    });
  },
};
