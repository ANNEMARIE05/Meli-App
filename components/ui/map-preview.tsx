import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { DEFAULT_DELTA, FALLBACK_COORDS, type GeoPoint } from '@/constants/geo';
import { Colors, Radius } from '@/constants/theme';

type Props = {
  label?: string;
  height?: number;
  dark?: boolean;
  compact?: boolean;
  fill?: boolean;
  latitude?: number;
  longitude?: number;
  path?: GeoPoint[];
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
  latitude,
  longitude,
  path,
  showUser = true,
  permissionDenied,
  onRequestPermission,
}: Props) {
  const hasFix = latitude != null && longitude != null;
  const center = {
    latitude: latitude ?? FALLBACK_COORDS.latitude,
    longitude: longitude ?? FALLBACK_COORDS.longitude,
  };
  const region = { ...center, ...DEFAULT_DELTA };

  return (
    <View style={[styles.wrap, fill ? styles.fill : { height }, dark && styles.dark]}>
      {Platform.OS === 'web' ? (
        <Fallback compact={compact} />
      ) : (
        <MapView
          style={StyleSheet.absoluteFill}
          region={region}
          showsUserLocation={showUser && hasFix}
          showsMyLocationButton={false}
          toolbarEnabled={false}
          liteMode={!fill}>
          {hasFix ? (
            <Marker coordinate={center} pinColor={Colors.primary} />
          ) : null}
          {path && path.length > 1 ? (
            <Polyline coordinates={path} strokeColor={Colors.primary} strokeWidth={4} />
          ) : null}
        </MapView>
      )}

      {!hasFix && Platform.OS === 'web' ? null : !hasFix ? <Fallback compact={compact} faded /> : null}

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

function Fallback({ compact, faded }: { compact?: boolean; faded?: boolean }) {
  return (
    <View style={[styles.fallback, faded && styles.faded]} pointerEvents="none">
      <View style={[styles.road, { top: '28%', left: -20, width: '80%', transform: [{ rotate: '-8deg' }] }]} />
      <View style={[styles.road, styles.roadAlt, { top: '58%', left: 30, width: '90%', transform: [{ rotate: '12deg' }] }]} />
      <View style={styles.pinWrap}>
        <Ionicons name="location" size={compact ? 22 : 28} color={Colors.primary} />
      </View>
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
  fill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 0,
  },
  dark: {
    backgroundColor: '#1B2430',
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
  },
  faded: {
    opacity: 0.18,
  },
  road: {
    position: 'absolute',
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 6,
  },
  roadAlt: {
    backgroundColor: 'rgba(210, 220, 200, 0.9)',
  },
  pinWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  captionText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  perm: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    left: 12,
    right: 12,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  permText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
});
