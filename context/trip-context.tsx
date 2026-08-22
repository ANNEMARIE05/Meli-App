import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { formatClock, haversineKm, type GeoPoint } from '@/constants/geo';

type TripSnapshot = {
  fromAddress: string;
  toAddress: string;
  startedAt: Date;
  endedAt: Date;
  durationSec: number;
  distanceKm: number;
  path: GeoPoint[];
};

type TripContextValue = {
  active: boolean;
  fromAddress: string;
  startedAt: Date | null;
  path: GeoPoint[];
  distanceKm: number;
  lastTrip: TripSnapshot | null;
  startTrip: (address: string, point: GeoPoint | null) => void;
  addPoint: (point: GeoPoint) => void;
  endTrip: (address: string) => TripSnapshot | null;
};

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [fromAddress, setFromAddress] = useState('');
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [path, setPath] = useState<GeoPoint[]>([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [lastTrip, setLastTrip] = useState<TripSnapshot | null>(null);

  const startTrip = useCallback((address: string, point: GeoPoint | null) => {
    setActive(true);
    setFromAddress(address);
    setStartedAt(new Date());
    setPath(point ? [point] : []);
    setDistanceKm(0);
  }, []);

  const addPoint = useCallback((point: GeoPoint) => {
    setPath((prev) => {
      const last = prev[prev.length - 1];
      if (last) {
        const step = haversineKm(last, point);
        if (step < 0.005) {
          return prev;
        }
        setDistanceKm((d) => d + step);
      }
      return [...prev, point];
    });
  }, []);

  const endTrip = useCallback(
    (address: string) => {
      const endedAt = new Date();
      const started = startedAt ?? endedAt;
      const snapshot: TripSnapshot = {
        fromAddress: fromAddress || 'Départ',
        toAddress: address || 'Arrivée',
        startedAt: started,
        endedAt,
        durationSec: Math.max(1, Math.round((endedAt.getTime() - started.getTime()) / 1000)),
        distanceKm,
        path,
      };
      setLastTrip(snapshot);
      setActive(false);
      return snapshot;
    },
    [distanceKm, fromAddress, path, startedAt]
  );

  const value = useMemo<TripContextValue>(
    () => ({
      active,
      fromAddress,
      startedAt,
      path,
      distanceKm,
      lastTrip,
      startTrip,
      addPoint,
      endTrip,
    }),
    [active, addPoint, distanceKm, endTrip, fromAddress, lastTrip, path, startTrip, startedAt]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) {
    throw new Error('useTrip must be used within TripProvider');
  }
  return ctx;
}

export function tripTimeLabel(date: Date | null) {
  return date ? formatClock(date) : '--:--';
}
