import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';

import { DEFAULT_DELTA, FALLBACK_COORDS, type GeoPoint } from '@/constants/geo';
import { Colors, Radius, Shadow } from '@/constants/theme';

type Props = {
  label?: string;
  height?: number;
  dark?: boolean;
  compact?: boolean;
  fill?: boolean;
  interactive?: boolean;
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
  interactive,
  latitude,
  longitude,
  path,
  showUser = true,
  permissionDenied,
  onRequestPermission,
}: Props) {
  const mapRef = useRef<MapView | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const lat = latitude ?? FALLBACK_COORDS.latitude;
  const lng = longitude ?? FALLBACK_COORDS.longitude;
  const isInteractive = interactive ?? !!fill;

  const currentRegion = {
    latitude: lat,
    longitude: lng,
    latitudeDelta: DEFAULT_DELTA.latitudeDelta,
    longitudeDelta: DEFAULT_DELTA.longitudeDelta,
  };

  useEffect(() => {
    if (mapReady && mapRef.current && lat && lng) {
      mapRef.current.animateToRegion(
        {
          latitude: lat,
          longitude: lng,
          latitudeDelta: DEFAULT_DELTA.latitudeDelta,
          longitudeDelta: DEFAULT_DELTA.longitudeDelta,
        },
        500
      );
    }
  }, [lat, lng, mapReady]);

  const handleZoom = (zoomIn: boolean) => {
    if (!mapRef.current) return;
    mapRef.current.getCamera().then((cam) => {
      const currentZoom = cam.zoom ?? 15;
      mapRef.current?.animateCamera(
        {
          zoom: zoomIn ? Math.min(currentZoom + 1.5, 20) : Math.max(currentZoom - 1.5, 2),
        },
        { duration: 300 }
      );
    }).catch(() => {});
  };

  const handleRecenter = () => {
    if (!mapRef.current) return;
    mapRef.current.animateToRegion(currentRegion, 400);
  };

  return (
    <View style={[styles.wrap, fill ? styles.fill : { height }, dark && styles.dark]}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        initialRegion={currentRegion}
        scrollEnabled={isInteractive}
        zoomEnabled={isInteractive}
        rotateEnabled={isInteractive}
        pitchEnabled={isInteractive}
        showsUserLocation={showUser && !permissionDenied}
        showsMyLocationButton={false}
        showsCompass={isInteractive}
        showsScale={isInteractive}
        onMapReady={() => setMapReady(true)}
      >
        {/* Custom Meli Location Marker */}
        <Marker
          coordinate={{ latitude: lat, longitude: lng }}
          title={label || 'Véhicule Meli'}
          description={`${lat.toFixed(5)}, ${lng.toFixed(5)}`}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.markerContainer}>
            <View style={styles.pulseRing} />
            <View style={styles.markerPin}>
              <Ionicons name="car-sport" size={16} color={Colors.white} />
            </View>
          </View>
        </Marker>

        {/* Route path polyline */}
        {path && path.length > 1 && (
          <Polyline
            coordinates={path}
            strokeColor={Colors.primary}
            strokeWidth={4}
            lineDashPattern={[0]}
          />
        )}
      </MapView>

      {/* Interactive Floating Zoom Controls */}
      {isInteractive && (
        <View style={styles.mapControls}>
          <Pressable style={styles.controlBtn} onPress={() => handleZoom(true)}>
            <Ionicons name="add" size={20} color={Colors.text} />
          </Pressable>
          <View style={styles.controlDivider} />
          <Pressable style={styles.controlBtn} onPress={() => handleZoom(false)}>
            <Ionicons name="remove" size={20} color={Colors.text} />
          </Pressable>
          <View style={styles.controlDivider} />
          <Pressable style={styles.controlBtn} onPress={handleRecenter}>
            <Ionicons name="locate" size={18} color={Colors.primary} />
          </Pressable>
        </View>
      )}

      {/* Label Badge */}
      {label ? (
        <View style={styles.caption}>
          <View style={styles.dot} />
          <Text style={styles.captionText} numberOfLines={1}>
            {label}
          </Text>
        </View>
      ) : null}

      {/* Permission Denied Banner */}
      {permissionDenied ? (
        <Pressable style={styles.perm} onPress={onRequestPermission}>
          <Ionicons name="locate" size={16} color={Colors.white} />
          <Text style={styles.permText}>Autoriser la localisation GPS</Text>
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
  fill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 0,
  },
  dark: {
    backgroundColor: '#1B2430',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  pulseRing: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 107, 0, 0.25)',
  },
  markerPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: Colors.white,
    ...Shadow.soft,
  },
  mapControls: {
    position: 'absolute',
    right: 14,
    top: 64,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    ...Shadow.card,
    overflow: 'hidden',
  },
  controlBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlDivider: {
    height: 1,
    backgroundColor: Colors.border,
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
    ...Shadow.soft,
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
    ...Shadow.soft,
  },
  permText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
});
