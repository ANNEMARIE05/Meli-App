/**
 * WhatsGPS Alarms, Notifications & Switches Service (Sections 4.9 & 4.13)
 */

import { whatsgpsClient } from './client';
import {
  type WhatsGPSAlarm,
  type WhatsGPSAlarmSwitch,
  type WhatsGPSResponse,
  VehicleAlarmType,
} from './types';

// Mock Alarms
const MOCK_ALARMS: WhatsGPSAlarm[] = [
  {
    alarmId: 'ALM-101',
    carId: 1001,
    machineName: 'Toyota Hilux 4x4',
    alarmType: VehicleAlarmType.VIBRATION,
    alarmTime: new Date(Date.now() - 15 * 60000).toISOString(),
    lat: 5.3215,
    lon: -4.0185,
    speed: 0,
    isNew: true,
    remark: 'Vibration anormale détectée à l’arrêt',
  },
  {
    alarmId: 'ALM-102',
    carId: 1003,
    machineName: 'Peugeot Partner',
    alarmType: VehicleAlarmType.LOW_POWER,
    alarmTime: new Date(Date.now() - 120 * 60000).toISOString(),
    lat: 5.3789,
    lon: -3.9921,
    speed: 0,
    isNew: true,
    remark: 'Batterie du traceur faible (< 15%)',
  },
  {
    alarmId: 'ALM-103',
    carId: 1001,
    machineName: 'Toyota Hilux 4x4',
    alarmType: VehicleAlarmType.SPEEDING,
    alarmTime: new Date(Date.now() - 24 * 3600000).toISOString(),
    lat: 5.3398,
    lon: -4.0035,
    speed: 94,
    isNew: false,
    remark: 'Vitesse de 94 km/h au-delà de la limite (80 km/h)',
  },
];

export const alarmsService = {
  /**
   * 4.9.1 Query User unread alarms
   */
  async getUnreadAlarms(params?: {
    focus?: boolean;
    alarmTypes?: string; // Comma separated IDs
    targetUserId?: number;
  }): Promise<WhatsGPSResponse<WhatsGPSAlarm[]>> {
    const res = await whatsgpsClient.request<WhatsGPSAlarm[]>('/carAlarm/getNotReadByUser.do', {
      focus: params?.focus ?? false,
      alarmTypes: params?.alarmTypes,
      targetUserId: params?.targetUserId ?? whatsgpsClient.getUserId(),
    });

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      return { ret: 1, data: MOCK_ALARMS };
    }

    return res;
  },

  /**
   * 4.9.4 Query unread alarms for a specific vehicle
   */
  async getAlarmsByCarId(carId: number): Promise<WhatsGPSResponse<WhatsGPSAlarm[]>> {
    const res = await whatsgpsClient.request<WhatsGPSAlarm[]>('/carAlarm/getNotReadByUserCarId.do', {
      carId,
    });

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      return {
        ret: 1,
        data: MOCK_ALARMS.filter((a) => a.carId === carId),
      };
    }

    return res;
  },

  /**
   * 4.9.5 Mark alarm as read (use alarmId = -1 to mark all read)
   */
  async markAlarmRead(alarmId: string | number): Promise<WhatsGPSResponse<void>> {
    const res = await whatsgpsClient.request<void>('/carAlarm/updateRead.do', {
      alarmId: String(alarmId),
    });

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      if (String(alarmId) === '-1') {
        MOCK_ALARMS.forEach((a) => {
          a.isNew = false;
        });
      } else {
        const item = MOCK_ALARMS.find((a) => String(a.alarmId) === String(alarmId));
        if (item) item.isNew = false;
      }
      return { ret: 1 };
    }

    return res;
  },

  /**
   * 4.13.2 Check all alarm switches configured for the user
   */
  async getAlarmSwitches(userId?: number, lang = 'fr'): Promise<WhatsGPSResponse<WhatsGPSAlarmSwitch[]>> {
    return whatsgpsClient.request<WhatsGPSAlarmSwitch[]>('/userCarAlarmSwitch/getAllByUserId.do', {
      userId: userId ?? whatsgpsClient.getUserId(),
      lang,
    });
  },

  /**
   * 4.13.3 Add or update alarm switch configuration
   */
  async updateAlarmSwitch(type: VehicleAlarmType, isOpen: boolean): Promise<WhatsGPSResponse<void>> {
    return whatsgpsClient.request<void>('/userCarAlarmSwitch/addOrUpdate.do', {
      type,
      isOpen,
    });
  },

  /**
   * 4.13.4 Batch update alarm switches
   */
  async batchUpdateAlarmSwitches(params: {
    openTypes?: number[];
    closeTypes?: number[];
    userId?: number;
  }): Promise<WhatsGPSResponse<void>> {
    return whatsgpsClient.request<void>('/userCarAlarmSwitch/addOrUpdateBatch.do', {
      userId: params.userId ?? whatsgpsClient.getUserId(),
      openTypes: params.openTypes?.join(','),
      closeTypes: params.closeTypes?.join(','),
    });
  },
};
