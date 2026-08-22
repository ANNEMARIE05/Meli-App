import * as Location from 'expo-location';
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

import { formatAddress, speedToKmh, type GeoPoint } from '@/constants/geo';

type Permission = 'undetermined' | 'granted' | 'denied';

type LocationContextValue = {
  ready: boolean;
  permission: Permission;
  coords: GeoPoint | null;
  speedKmh: number;
  accuracy: number | null;
  address: string;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  refresh: () => Promise<void>;
};

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children, enabled = true }: { children: ReactNode; enabled?: boolean }) {
  const [ready, setReady] = useState(false);
  const [permission, setPermission] = useState<Permission>('undetermined');
  const [coords, setCoords] = useState<GeoPoint | null>(null);
  const [speedKmh, setSpeedKmh] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [address, setAddress] = useState('Recherche de la position…');
  const [error, setError] = useState<string | null>(null);
  const lastGeocode = useRef(0);
  const lastPoint = useRef<GeoPoint | null>(null);

  async function geocodeIfNeeded(point: GeoPoint) {
    if (Platform.OS === 'web') {
      setAddress(`${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`);
      return;
    }
    const moved = lastPoint.current ? Math.abs(point.latitude - lastPoint.current.latitude) + Math.abs(point.longitude - lastPoint.current.longitude) : 1;
    const now = Date.now();
    if (now - lastGeocode.current < 20000 && moved < 0.0004) {
      return;
    }
    lastGeocode.current = now;
    lastPoint.current = point;
    try {
      const results = await Location.reverseGeocodeAsync(point);
      if (results[0]) {
        setAddress(formatAddress(results[0]));
      }
    } catch {
      setAddress(`${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`);
    }
  }

  function applyLocation(loc: Location.LocationObject) {
    const next = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
    setCoords(next);
    setSpeedKmh(speedToKmh(loc.coords.speed));
    setAccuracy(loc.coords.accuracy);
    setError(null);
    void geocodeIfNeeded(next);
  }

  const requestPermission = async () => {
    const current = await Location.getForegroundPermissionsAsync();
    let status = current.status;
    if (status !== 'granted') {
      const asked = await Location.requestForegroundPermissionsAsync();
      status = asked.status;
    }
    const granted = status === 'granted';
    setPermission(granted ? 'granted' : 'denied');
    if (!granted) {
      setError('Permission de localisation refusée');
      setAddress('Localisation non autorisée');
    }
    return granted;
  };

  const refresh = async () => {
    const granted = permission === 'granted' || (await requestPermission());
    if (!granted) {
      return;
    }
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    applyLocation(loc);
  };

  useEffect(() => {
    let sub: Location.LocationSubscription | undefined;
    let cancelled = false;

    if (!enabled) {
      setReady(true);
      return;
    }

    (async () => {
      try {
        const granted = await requestPermission();
        if (!granted || cancelled) {
          return;
        }
        const last = await Location.getLastKnownPositionAsync();
        if (last && !cancelled) {
          applyLocation(last);
        }
        const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (!cancelled) {
          applyLocation(current);
        }
        sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 8,
            timeInterval: 3000,
          },
          (loc) => {
            if (!cancelled) {
              applyLocation(loc);
            }
          }
        );
      } catch {
        if (!cancelled) {
          setError('Impossible de lire la position GPS');
          setAddress('GPS indisponible');
        }
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
      sub?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const value = useMemo<LocationContextValue>(
    () => ({
      ready,
      permission,
      coords,
      speedKmh,
      accuracy,
      address,
      error,
      requestPermission,
      refresh,
    }),
    [accuracy, address, coords, error, permission, ready, speedKmh]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return ctx;
}
