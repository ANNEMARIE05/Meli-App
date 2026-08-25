/**
 * WhatsGPS Electronic Fence (Geofencing) & Binding Service (Sections 4.4 & 4.5)
 */

import { whatsgpsClient } from './client';
import {
  FenceShapeType,
  MapCoordinateType,
  type WhatsGPSElectronicFence,
  type WhatsGPSResponse,
} from './types';

// Mock fences for demonstration in Abidjan
const MOCK_FENCES: WhatsGPSElectronicFence[] = [
  {
    carFenceId: 501,
    name: 'Zone Sécurisée Plateau',
    type: FenceShapeType.CIRCLE,
    radius: 1500, // 1.5 km
    points: '-4.0185,5.3215', // lon,lat center
    inSwitch: true,
    outSwitch: true,
    boundCarCount: 2,
  },
  {
    carFenceId: 502,
    name: 'Périmètre Grand Abidjan',
    type: FenceShapeType.POLYGON,
    points: '-4.10,5.25;-3.90,5.25;-3.90,5.45;-4.10,5.45',
    inSwitch: false,
    outSwitch: true,
    boundCarCount: 3,
  },
];

export const geofenceService = {
  /**
   * 4.4.1 Add Electronic Fence
   */
  async addFence(params: {
    name: string;
    type: FenceShapeType; // 0: Circle, 1: Polygon
    points: string; // "lon,lat" for circle or "lon,lat;lon,lat;..." for polygon
    radius?: number; // In meters (if Circle)
    inSwitch?: boolean;
    outSwitch?: boolean;
    mapType?: MapCoordinateType;
  }): Promise<WhatsGPSResponse<{ carFenceId: number }>> {
    const res = await whatsgpsClient.request<{ carFenceId: number }>('/carFence/add.do', {
      name: params.name,
      type: params.type,
      points: params.points,
      radius: params.radius ?? 500,
      inSwitch: params.inSwitch ?? true,
      outSwitch: params.outSwitch ?? true,
      mapType: params.mapType ?? MapCoordinateType.ORIGINAL_WGS84,
    });

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      const newId = Math.floor(Math.random() * 9000) + 1000;
      MOCK_FENCES.push({
        carFenceId: newId,
        name: params.name,
        type: params.type,
        points: params.points,
        radius: params.radius,
        inSwitch: params.inSwitch,
        outSwitch: params.outSwitch,
        boundCarCount: 0,
      });
      return { ret: 1, data: { carFenceId: newId } };
    }

    return res;
  },

  /**
   * 4.4.2 Update Electronic Fence
   */
  async updateFence(params: {
    carFenceId: number;
    name?: string;
    type?: FenceShapeType;
    points?: string;
    radius?: number;
    inSwitch?: boolean;
    outSwitch?: boolean;
  }): Promise<WhatsGPSResponse<void>> {
    return whatsgpsClient.request<void>('/carFence/update.do', params);
  },

  /**
   * 4.4.5 Delete Electronic Fence
   */
  async deleteFence(carFenceId: number): Promise<WhatsGPSResponse<void>> {
    const res = await whatsgpsClient.request<void>('/carFence/del.do', { carFenceId });

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      const idx = MOCK_FENCES.findIndex((f) => f.carFenceId === carFenceId);
      if (idx !== -1) MOCK_FENCES.splice(idx, 1);
      return { ret: 1 };
    }

    return res;
  },

  /**
   * 4.4.3 Get Fences by User ID
   */
  async getFencesByUserId(mapType: MapCoordinateType = MapCoordinateType.ORIGINAL_WGS84): Promise<WhatsGPSResponse<WhatsGPSElectronicFence[]>> {
    const res = await whatsgpsClient.request<WhatsGPSElectronicFence[]>('/carFence/getByUserId.do', {
      mapType,
    });

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      return { ret: 1, data: MOCK_FENCES };
    }

    return res;
  },

  /**
   * 4.5.1 Batch binding vehicles to a fence
   */
  async bindFenceToVehicles(carFenceId: number, carIds: number[]): Promise<WhatsGPSResponse<void>> {
    return whatsgpsClient.request<void>('/carFenceBound/boundBatch.do', {
      carFenceId,
      carIds: carIds.join(','),
    });
  },

  /**
   * 4.5.3 Batch unbinding vehicles from a fence
   */
  async unbindFenceFromVehicles(carFenceId: number, carIds: number[]): Promise<WhatsGPSResponse<void>> {
    return whatsgpsClient.request<void>('/carFenceBound/unBoundBatch.do', {
      carFenceId,
      carIds: carIds.join(','),
    });
  },

  /**
   * 4.5.9 Check electronic fences bound to a specific vehicle
   */
  async getFencesForVehicle(carId: number, mapType: MapCoordinateType = MapCoordinateType.ORIGINAL_WGS84): Promise<WhatsGPSResponse<WhatsGPSElectronicFence[]>> {
    const res = await whatsgpsClient.request<WhatsGPSElectronicFence[]>('/carFenceBound/getByUserIdAndCarId.do', {
      carId,
      mapType,
    });

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      return { ret: 1, data: [MOCK_FENCES[0]] };
    }

    return res;
  },
};
