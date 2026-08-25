/**
 * WhatsGPS Vehicles & Status Service (Sections 4.2, 4.7, 4.8)
 */

import { whatsgpsClient } from './client';
import {
  MapCoordinateType,
  type WhatsGPSResponse,
  type WhatsGPSVehicle,
  type WhatsGPSVehicleStatus,
} from './types';

// Mock vehicles with realistic Ivory Coast coordinates (Abidjan)
const MOCK_VEHICLES: (WhatsGPSVehicle & { status: WhatsGPSVehicleStatus })[] = [
  {
    carId: 1001,
    userId: 102537,
    imei: '868014041234567',
    carNO: 'A 1234 BE',
    machineName: 'Toyota Hilux 4x4',
    machineType: 'S16',
    carType: 2,
    simNO: '+2250701020304',
    driverName: 'Karim Diallo',
    driverTel: '+225 07 11 22 33 44',
    fuelConsumption: 9,
    serviceState: 0,
    status: {
      carId: 1001,
      online: true,
      pointTime: new Date().toISOString(),
      lat: 5.3215,
      lon: -4.0185,
      speed: 42,
      dir: 110,
      accState: 1,
      voltage: 12600,
      batteryPercent: 88,
      isStop: false,
      cumulativeMileage: 87450,
    },
  },
  {
    carId: 1002,
    userId: 102537,
    imei: '868014047654321',
    carNO: 'B 5678 CA',
    machineName: 'Renault Kangoo',
    machineType: 'S08',
    carType: 3,
    simNO: '+2250705060708',
    driverName: 'Mamadou Touré',
    driverTel: '+225 05 55 66 77 88',
    fuelConsumption: 6,
    serviceState: 0,
    status: {
      carId: 1002,
      online: true,
      pointTime: new Date(Date.now() - 3600000).toISOString(),
      lat: 5.3421,
      lon: -4.0723,
      speed: 0,
      dir: 0,
      accState: 0,
      voltage: 12400,
      batteryPercent: 95,
      isStop: true,
      stopTime: 3600,
      cumulativeMileage: 123200,
    },
  },
  {
    carId: 1003,
    userId: 102537,
    imei: '868014049876543',
    carNO: 'C 9012 DA',
    machineName: 'Peugeot Partner',
    machineType: 'GT06',
    carType: 3,
    simNO: '+2250709101112',
    driverName: 'Ibrahim Koné',
    driverTel: '+225 01 23 45 67 89',
    fuelConsumption: 7,
    serviceState: 0,
    status: {
      carId: 1003,
      online: false,
      pointTime: new Date(Date.now() - 86400000).toISOString(),
      lat: 5.3789,
      lon: -3.9921,
      speed: 0,
      dir: 0,
      accState: 0,
      voltage: 11900,
      batteryPercent: 32,
      isStop: true,
      cumulativeMileage: 64100,
    },
  },
];

export const vehiclesService = {
  /**
   * 4.2.1 Get Vehicle by Car ID
   */
  async getVehicleById(carId: number): Promise<WhatsGPSResponse<WhatsGPSVehicle>> {
    const res = await whatsgpsClient.request<WhatsGPSVehicle>('/car/getByCarId.do', { carId });

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      const match = MOCK_VEHICLES.find((v) => v.carId === carId) || MOCK_VEHICLES[0];
      return { ret: 1, data: match };
    }

    return res;
  },

  /**
   * 4.2.2 Get Vehicle Details and Live Status Data
   */
  async getVehicleAndStatus(
    carId: number,
    mapType: MapCoordinateType = MapCoordinateType.ORIGINAL_WGS84
  ): Promise<WhatsGPSResponse<{ vehicle: WhatsGPSVehicle; status: WhatsGPSVehicleStatus }>> {
    const res = await whatsgpsClient.request<{ vehicle: WhatsGPSVehicle; status: WhatsGPSVehicleStatus }>(
      '/car/getCarAndStatus.do',
      { carId, mapType }
    );

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      const match = MOCK_VEHICLES.find((v) => v.carId === carId) || MOCK_VEHICLES[0];
      return {
        ret: 1,
        data: {
          vehicle: match,
          status: match.status,
        },
      };
    }

    return res;
  },

  /**
   * 4.2.3 Get Vehicle info by IMEI
   */
  async getVehicleByImei(imei: string): Promise<WhatsGPSResponse<WhatsGPSVehicle>> {
    const res = await whatsgpsClient.request<WhatsGPSVehicle>('/car/getByImei.do', { imei });

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      const match = MOCK_VEHICLES.find((v) => v.imei === imei) || MOCK_VEHICLES[0];
      return { ret: 1, data: match };
    }

    return res;
  },

  /**
   * 4.2.6 Paging queries of vehicles for a given user
   */
  async getVehiclesByUserId(
    userId?: number,
    pageNO = 1,
    rowCount = 20
  ): Promise<WhatsGPSResponse<WhatsGPSVehicle[]>> {
    const res = await whatsgpsClient.request<WhatsGPSVehicle[]>('/car/getByUserIdPage.do', {
      userId: userId ?? whatsgpsClient.getUserId(),
      pageNO,
      rowCount,
    });

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      return {
        ret: 1,
        total: MOCK_VEHICLES.length,
        data: MOCK_VEHICLES,
      };
    }

    return res;
  },

  /**
   * 4.8.1 Acquisition of vehicle status according to vehicle IDs (comma separated)
   */
  async getVehiclesStatusByIds(
    carIds: number[],
    mapType: MapCoordinateType = MapCoordinateType.ORIGINAL_WGS84
  ): Promise<WhatsGPSResponse<WhatsGPSVehicleStatus[]>> {
    const res = await whatsgpsClient.request<WhatsGPSVehicleStatus[]>('/carStatus/getByCarIds.do', {
      carIds: carIds.join(','),
      mapType,
    });

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      const statuses = MOCK_VEHICLES.filter((v) => carIds.includes(v.carId)).map((v) => v.status);
      return {
        ret: 1,
        data: statuses.length > 0 ? statuses : MOCK_VEHICLES.map((v) => v.status),
      };
    }

    return res;
  },

  /**
   * 4.8.2 Acquisition of all vehicles status for the logged-in or targeted user
   */
  async getVehiclesStatusByUserId(
    userId?: number,
    mapType: MapCoordinateType = MapCoordinateType.ORIGINAL_WGS84
  ): Promise<WhatsGPSResponse<WhatsGPSVehicleStatus[]>> {
    const res = await whatsgpsClient.request<WhatsGPSVehicleStatus[]>('/carStatus/getByUserId.do', {
      targetUserId: userId ?? whatsgpsClient.getUserId(),
      mapType,
    });

    if (res.ret !== 1 && whatsgpsClient.isMockEnabled()) {
      return {
        ret: 1,
        data: MOCK_VEHICLES.map((v) => v.status),
      };
    }

    return res;
  },

  /**
   * 4.2.8 Modification of vehicle information
   */
  async updateVehicle(params: {
    carId: number;
    machineName?: string;
    carNO?: string;
    carType?: number;
    serviceTime?: string;
    simNO?: string;
    driverName?: string;
    driverTel?: string;
    email?: string;
    address?: string;
    remark?: string;
    fuelConsumption?: number;
  }): Promise<WhatsGPSResponse<void>> {
    return whatsgpsClient.request<void>('/car/update.do', params);
  },

  /**
   * 4.7.3 Search by device name or IMEI
   */
  async searchByKeyword(condition: string): Promise<WhatsGPSResponse<WhatsGPSVehicle[]>> {
    return whatsgpsClient.request<WhatsGPSVehicle[]>('/search/queryByMachineNameOrImei.do', {
      condition,
    });
  },
};
