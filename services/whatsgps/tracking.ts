/**
 * WhatsGPS Position, Historical Trajectory & Travel Statistics (Sections 4.3 & 4.12)
 */

import { whatsgpsClient } from './client';
import {
  MapCoordinateType,
  type WhatsGPSLocationPoint,
  type WhatsGPSResponse,
  type WhatsGPSSpeedingDetail,
  type WhatsGPSStopDetail,
  type WhatsGPSTravelStats,
} from './types';

// Mock path in Abidjan (Plateau to Cocody)
const MOCK_TRACK_POINTS: WhatsGPSLocationPoint[] = [
  { carId: 1001, pointDt: '2026-08-24 07:30:00', lat: 5.3215, lon: -4.0185, speed: 0, dir: 90, isStop: true },
  { carId: 1001, pointDt: '2026-08-24 07:35:00', lat: 5.3245, lon: -4.0142, speed: 28, dir: 45, isStop: false },
  { carId: 1001, pointDt: '2026-08-24 07:40:00', lat: 5.3312, lon: -4.0089, speed: 45, dir: 30, isStop: false },
  { carId: 1001, pointDt: '2026-08-24 07:45:00', lat: 5.3398, lon: -4.0035, speed: 52, dir: 25, isStop: false },
  { carId: 1001, pointDt: '2026-08-24 07:50:00', lat: 5.3481, lon: -3.9982, speed: 38, dir: 15, isStop: false },
  { carId: 1001, pointDt: '2026-08-24 07:55:00', lat: 5.3564, lon: -3.9928, speed: 15, dir: 10, isStop: false },
  { carId: 1001, pointDt: '2026-08-24 08:00:00', lat: 5.3592, lon: -3.9915, speed: 0, dir: 0, isStop: true, stopTime: 900 },
];

export const trackingService = {
  /**
   * 4.3.1 Query history track points between two UTC dates
   * Date format: yyyy-MM-dd HH:mm:ss
   */
  async queryHistoryTrack(params: {
    carId: number;
    startTime: string;
    endTime: string;
    mapType?: MapCoordinateType;
    filter?: boolean;
  }): Promise<WhatsGPSResponse<WhatsGPSLocationPoint[]>> {
    const res = await whatsgpsClient.request<WhatsGPSLocationPoint[]>('/position/queryHistory.do', {
      carId: params.carId,
      startTime: params.startTime,
      endTime: params.endTime,
      mapType: params.mapType ?? MapCoordinateType.ORIGINAL_WGS84,
      filter: params.filter ?? false,
    });

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      return {
        ret: 1,
        data: MOCK_TRACK_POINTS,
      };
    }

    return res;
  },

  /**
   * 4.12.13 Travel Statistics (Distance between start and end time)
   */
  async getTravelStatistics(params: {
    carId: number;
    startTime: string;
    endTime: string;
  }): Promise<WhatsGPSResponse<WhatsGPSTravelStats>> {
    const res = await whatsgpsClient.request<WhatsGPSTravelStats>('/position/distanceSta.do', params);

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      return {
        ret: 1,
        data: {
          carId: params.carId,
          startTime: params.startTime,
          endTime: params.endTime,
          mileage: 18400, // 18.4 km in meters
          startLat: 5.3215,
          startLon: -4.0185,
          endLat: 5.3592,
          endLon: -3.9915,
        },
      };
    }

    return res;
  },

  /**
   * 4.12.5 Parking / Stops details during a period
   */
  async getParkingDetails(params: {
    carId: number;
    startTime: string;
    endTime: string;
    acc?: boolean;
    pageNO?: number;
    rowCount?: number;
  }): Promise<WhatsGPSResponse<WhatsGPSStopDetail[]>> {
    const res = await whatsgpsClient.request<WhatsGPSStopDetail[]>('/position/getStopDetail.do', {
      ...params,
      pageNO: params.pageNO ?? 1,
      rowCount: params.rowCount ?? 20,
    });

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      return {
        ret: 1,
        data: [
          {
            carId: params.carId,
            pointDt: params.startTime,
            state: 0,
            time: 900, // 15 mins
            lat: 5.3592,
            lon: -3.9915,
            remark: 'Arrêt Cocody Centre',
          },
        ],
      };
    }

    return res;
  },

  /**
   * 4.12.7 Speeding Details
   */
  async getSpeedingDetails(params: {
    carId: number;
    startTime: string;
    endTime: string;
    pageNO?: number;
    rowCount?: number;
  }): Promise<WhatsGPSResponse<WhatsGPSSpeedingDetail[]>> {
    return whatsgpsClient.request<WhatsGPSSpeedingDetail[]>('/position/getOverSpeedDetail.do', {
      ...params,
      pageNO: params.pageNO ?? 1,
      rowCount: params.rowCount ?? 20,
    });
  },

  /**
   * Format JS Date to WhatsGPS required UTC string format (yyyy-MM-dd HH:mm:ss)
   */
  formatDateToUtcString(date: Date): string {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },
};
