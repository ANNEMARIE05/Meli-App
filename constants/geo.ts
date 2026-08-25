export const FALLBACK_COORDS = {
  latitude: 5.3364,
  longitude: -4.0267,
};

export const DEFAULT_DELTA = {
  latitudeDelta: 0.018,
  longitudeDelta: 0.018,
};

export type GeoPoint = {
  latitude: number;
  longitude: number;
};

export function formatAddress(parts: {
  name?: string | null;
  streetNumber?: string | null;
  street?: string | null;
  district?: string | null;
  city?: string | null;
  subregion?: string | null;
  region?: string | null;
  country?: string | null;
  formattedAddress?: string | null;
}) {
  if (parts.formattedAddress) {
    return parts.formattedAddress;
  }

  const street = [parts.streetNumber, parts.street].filter(Boolean).join(' ');
  const locality = parts.district || parts.city || parts.subregion || parts.region;
  const bits = [street || parts.name, locality, parts.country].filter(Boolean);
  return bits.join(', ') || 'Position actuelle';
}

export function haversineKm(a: GeoPoint, b: GeoPoint) {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export function formatDistance(km: number) {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function formatClock(date = new Date()) {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function formatRelativeTime(date: Date | null | undefined) {
  if (!date) {
    return '—';
  }
  const sec = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
  if (sec < 15) {
    return 'à l’instant';
  }
  if (sec < 60) {
    return `il y a ${sec} sec`;
  }
  const min = Math.round(sec / 60);
  if (min < 60) {
    return `il y a ${min} min`;
  }
  const hours = Math.round(min / 60);
  return `il y a ${hours} h`;
}

export function formatDuration(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h <= 0) {
    return `${m} min`;
  }
  return `${h}h ${String(m).padStart(2, '0')}min`;
}

export function speedToKmh(speedMs: number | null | undefined) {
  if (speedMs == null || speedMs < 0) {
    return 0;
  }
  return Math.round(speedMs * 3.6);
}
