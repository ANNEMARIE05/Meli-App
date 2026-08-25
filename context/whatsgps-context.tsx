/**
 * WhatsGPS React Context & Custom Hooks
 * Provides global state management, polling, and helper hooks for fleet tracking
 */

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import {
  authService,
  vehiclesService,
  alarmsService,
  geofenceService,
  trackingService,
  type WhatsGPSVehicle,
  type WhatsGPSVehicleStatus,
  type WhatsGPSAlarm,
  type WhatsGPSElectronicFence,
  type WhatsGPSLocationPoint,
  type WhatsGPSTravelStats,
  FenceShapeType,
  MapCoordinateType,
} from '@/services/whatsgps';

type WhatsGPSContextValue = {
  ready: boolean;
  connected: boolean;
  vehicles: WhatsGPSVehicle[];
  statuses: Record<number, WhatsGPSVehicleStatus>;
  alarms: WhatsGPSAlarm[];
  fences: WhatsGPSElectronicFence[];
  unreadAlarmsCount: number;
  statusCounts: {
    allCount: number;
    onlineCount: number;
    offlineCount: number;
    notActiveCount: number;
  };
  refreshAll: () => Promise<void>;
  refreshVehicles: () => Promise<void>;
  refreshStatuses: () => Promise<void>;
  refreshAlarms: () => Promise<void>;
  refreshFences: () => Promise<void>;
  markAlarmAsRead: (alarmId: string | number) => Promise<void>;
  createFence: (fence: {
    name: string;
    type: FenceShapeType;
    points: string;
    radius?: number;
    carIds?: number[];
  }) => Promise<boolean>;
  deleteFence: (fenceId: number) => Promise<boolean>;
  getVehicleStatus: (carId: number) => WhatsGPSVehicleStatus | undefined;
};

const WhatsGPSContext = createContext<WhatsGPSContextValue | null>(null);

export function WhatsGPSProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [connected, setConnected] = useState(false);
  const [vehicles, setVehicles] = useState<WhatsGPSVehicle[]>([]);
  const [statuses, setStatuses] = useState<Record<number, WhatsGPSVehicleStatus>>({});
  const [alarms, setAlarms] = useState<WhatsGPSAlarm[]>([]);
  const [fences, setFences] = useState<WhatsGPSElectronicFence[]>([]);
  const [statusCounts, setStatusCounts] = useState({
    allCount: 0,
    onlineCount: 0,
    offlineCount: 0,
    notActiveCount: 0,
  });

  const pollingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshVehicles = useCallback(async () => {
    try {
      const res = await vehiclesService.getVehiclesByUserId();
      if (res.ret === 1 && res.data) {
        setVehicles(res.data);
      }
    } catch (e) {
      console.warn('[WhatsGPS] Erreur chargement véhicules:', e);
    }
  }, []);

  const refreshStatuses = useCallback(async () => {
    try {
      const res = await vehiclesService.getVehiclesStatusByUserId();
      if (res.ret === 1 && res.data) {
        const map: Record<number, WhatsGPSVehicleStatus> = {};
        res.data.forEach((s) => {
          map[s.carId] = s;
        });
        setStatuses(map);
      }

      const countRes = await authService.getCarStatusCount();
      if (countRes.ret === 1 && countRes.data) {
        setStatusCounts({
          allCount: countRes.data.allCount,
          onlineCount: countRes.data.onlineCount,
          offlineCount: countRes.data.offlineCount,
          notActiveCount: countRes.data.notActiveCount,
        });
      }
    } catch (e) {
      console.warn('[WhatsGPS] Erreur rafraîchissement statuts:', e);
    }
  }, []);

  const refreshAlarms = useCallback(async () => {
    try {
      const res = await alarmsService.getUnreadAlarms();
      if (res.ret === 1 && res.data) {
        setAlarms(res.data);
      }
    } catch (e) {
      console.warn('[WhatsGPS] Erreur chargement alarmes:', e);
    }
  }, []);

  const refreshFences = useCallback(async () => {
    try {
      const res = await geofenceService.getFencesByUserId();
      if (res.ret === 1 && res.data) {
        setFences(res.data);
      }
    } catch (e) {
      console.warn('[WhatsGPS] Erreur chargement clôtures:', e);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshVehicles(), refreshStatuses(), refreshAlarms(), refreshFences()]);
  }, [refreshVehicles, refreshStatuses, refreshAlarms, refreshFences]);

  const markAlarmAsRead = useCallback(
    async (alarmId: string | number) => {
      await alarmsService.markAlarmRead(alarmId);
      await refreshAlarms();
    },
    [refreshAlarms]
  );

  const createFence = useCallback(
    async (fenceData: { name: string; type: FenceShapeType; points: string; radius?: number; carIds?: number[] }) => {
      const res = await geofenceService.addFence({
        name: fenceData.name,
        type: fenceData.type,
        points: fenceData.points,
        radius: fenceData.radius,
      });
      if (res.ret === 1 && res.data?.carFenceId) {
        if (fenceData.carIds && fenceData.carIds.length > 0) {
          await geofenceService.bindFenceToVehicles(res.data.carFenceId, fenceData.carIds);
        }
        await refreshFences();
        return true;
      }
      return false;
    },
    [refreshFences]
  );

  const deleteFence = useCallback(
    async (fenceId: number) => {
      const res = await geofenceService.deleteFence(fenceId);
      if (res.ret === 1) {
        await refreshFences();
        return true;
      }
      return false;
    },
    [refreshFences]
  );

  const getVehicleStatus = useCallback(
    (carId: number) => {
      return statuses[carId];
    },
    [statuses]
  );

  // Initial login & initialization
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const loginRes = await authService.login({
          name: process.env.EXPO_PUBLIC_WHATSGPS_USERNAME || 'meli_demo_user',
          password: process.env.EXPO_PUBLIC_WHATSGPS_PASSWORD || '123456',
        });
        if (mounted) {
          setConnected(loginRes.ret === 1);
          await refreshAll();
        }
      } catch (err) {
        console.warn('[WhatsGPSProvider] Erreur initialisation:', err);
      } finally {
        if (mounted) setReady(true);
      }
    })();

    // Setup live status polling every 10 seconds
    pollingTimer.current = setInterval(() => {
      void refreshStatuses();
      void refreshAlarms();
    }, 10000);

    return () => {
      mounted = false;
      if (pollingTimer.current) clearInterval(pollingTimer.current);
    };
  }, [refreshAll, refreshStatuses, refreshAlarms]);

  const unreadAlarmsCount = useMemo(() => {
    return alarms.filter((a) => a.isNew !== false).length;
  }, [alarms]);

  const value = useMemo<WhatsGPSContextValue>(
    () => ({
      ready,
      connected,
      vehicles,
      statuses,
      alarms,
      fences,
      unreadAlarmsCount,
      statusCounts,
      refreshAll,
      refreshVehicles,
      refreshStatuses,
      refreshAlarms,
      refreshFences,
      markAlarmAsRead,
      createFence,
      deleteFence,
      getVehicleStatus,
    }),
    [
      ready,
      connected,
      vehicles,
      statuses,
      alarms,
      fences,
      unreadAlarmsCount,
      statusCounts,
      refreshAll,
      refreshVehicles,
      refreshStatuses,
      refreshAlarms,
      refreshFences,
      markAlarmAsRead,
      createFence,
      deleteFence,
      getVehicleStatus,
    ]
  );

  return <WhatsGPSContext.Provider value={value}>{children}</WhatsGPSContext.Provider>;
}

export function useWhatsGPS() {
  const ctx = useContext(WhatsGPSContext);
  if (!ctx) {
    throw new Error('useWhatsGPS doit être utilisé au sein d’un WhatsGPSProvider');
  }
  return ctx;
}

/**
 * Hook to follow a single vehicle with real-time status & high-frequency polling
 */
export function useWhatsGPSTracking(carId: number | undefined, pollIntervalMs = 5000) {
  const { getVehicleStatus } = useWhatsGPS();
  const [vehicle, setVehicle] = useState<WhatsGPSVehicle | null>(null);
  const [status, setStatus] = useState<WhatsGPSVehicleStatus | null>(null);
  const [boundFences, setBoundFences] = useState<WhatsGPSElectronicFence[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLive = useCallback(async () => {
    if (!carId) return;
    try {
      const res = await vehiclesService.getVehicleAndStatus(carId);
      if (res.ret === 1 && res.data) {
        setVehicle(res.data.vehicle);
        setStatus(res.data.status);
      }
      const fenceRes = await geofenceService.getFencesForVehicle(carId);
      if (fenceRes.ret === 1 && fenceRes.data) {
        setBoundFences(fenceRes.data);
      }
    } catch (e) {
      console.warn('[useWhatsGPSTracking] Erreur:', e);
    }
  }, [carId]);

  useEffect(() => {
    if (!carId) return;
    setLoading(true);
    fetchLive().finally(() => setLoading(false));

    const timer = setInterval(() => {
      void fetchLive();
    }, pollIntervalMs);

    return () => clearInterval(timer);
  }, [carId, pollIntervalMs, fetchLive]);

  return {
    vehicle,
    status: status || (carId ? getVehicleStatus(carId) || null : null),
    boundFences,
    loading,
    refresh: fetchLive,
  };
}

/**
 * Hook to query historical routes and distance calculations
 */
export function useWhatsGPSHistory(carId: number | undefined, daysBack = 1) {
  const [loading, setLoading] = useState(false);
  const [trackPoints, setTrackPoints] = useState<WhatsGPSLocationPoint[]>([]);
  const [stats, setStats] = useState<WhatsGPSTravelStats | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!carId) return;
    setLoading(true);
    try {
      const end = new Date();
      const start = new Date(Date.now() - daysBack * 24 * 3600000);
      const startTime = trackingService.formatDateToUtcString(start);
      const endTime = trackingService.formatDateToUtcString(end);

      const [trackRes, statsRes] = await Promise.all([
        trackingService.queryHistoryTrack({ carId, startTime, endTime }),
        trackingService.getTravelStatistics({ carId, startTime, endTime }),
      ]);

      if (trackRes.ret === 1 && trackRes.data) {
        setTrackPoints(trackRes.data);
      }
      if (statsRes.ret === 1 && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (e) {
      console.warn('[useWhatsGPSHistory] Erreur:', e);
    } finally {
      setLoading(false);
    }
  }, [carId, daysBack]);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  return {
    trackPoints,
    stats,
    loading,
    reload: fetchHistory,
  };
}
