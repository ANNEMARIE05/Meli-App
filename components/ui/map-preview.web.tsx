import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FALLBACK_COORDS, type GeoPoint } from '@/constants/geo';
import { Colors, Radius, Shadow } from '@/constants/theme';

import type { ExtraMarker, MapFence } from './map-preview';

type Props = {
  label?: string;
  height?: number;
  dark?: boolean;
  compact?: boolean;
  fill?: boolean;
  interactive?: boolean;
  latitude?: number;
  longitude?: number;
  heading?: number;
  path?: GeoPoint[];
  fences?: MapFence[];
  markers?: ExtraMarker[];
  showUser?: boolean;
  permissionDenied?: boolean;
  onRequestPermission?: () => void;
};


export function MapPreview({
  label,
  height = 160,
  dark,
  compact,
  fill,
  interactive,
  latitude,
  longitude,
  permissionDenied,
  onRequestPermission,
}: Props) {
  const hasFix = latitude != null && longitude != null;
  const lat = latitude ?? FALLBACK_COORDS.latitude;
  const lng = longitude ?? FALLBACK_COORDS.longitude;
  const delta = 0.012;

  const osmUrl = useMemo(() => {
    if (!hasFix) {
      return null;
    }
    const minLon = lng - delta;
    const minLat = lat - delta;
    const maxLon = lng + delta;
    const maxLat = lat + delta;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${lat}%2C${lng}`;
  }, [hasFix, lat, lng]);

  return (
    <View style={[styles.wrap, fill ? styles.fill : { height }, dark && styles.dark]}>
      {osmUrl ? (
        <iframe
          title="Carte GPS"
          src={osmUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 0,
            pointerEvents: interactive || fill ? 'auto' : 'none',
          }}
        />
      ) : (
        <View style={styles.waiting}>
          <Ionicons name="locate-outline" size={22} color={Colors.textSecondary} />
          <Text style={styles.waitingText}>En attente de la position GPS…</Text>
        </View>
      )}

      {label ? (
        <View style={styles.caption}>
          <View style={styles.dot} />
          <Text style={styles.captionText} numberOfLines={1}>
            {label}
          </Text>
        </View>
      ) : null}

      {permissionDenied ? (
        <Pressable style={styles.perm} onPress={onRequestPermission}>
          <Ionicons name="locate" size={16} color={Colors.white} />
          <Text style={styles.permText}>Autoriser la localisation</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: '#E8F0E4',
    position: 'relative',
  },
  fill: { ...StyleSheet.absoluteFillObject, borderRadius: 0 },
  dark: { backgroundColor: '#1B2430' },
  waiting: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  waitingText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  caption: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: Colors.text,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...Shadow.soft,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  captionText: { color: Colors.white, fontSize: 12, fontWeight: '600', flex: 1 },
  perm: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    ...Shadow.soft,
  },
  permText: { color: Colors.white, fontWeight: '700' },
});
