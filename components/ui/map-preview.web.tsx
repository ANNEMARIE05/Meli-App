import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius } from '@/constants/theme';
import type { GeoPoint } from '@/constants/geo';

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
  permissionDenied,
  onRequestPermission,
}: Props) {
  return (
    <View style={[styles.wrap, fill ? styles.fill : { height }, dark && styles.dark]}>
      <View style={[styles.road, { top: '28%', left: -20, width: '80%', transform: [{ rotate: '-8deg' }] }]} />
      <View style={[styles.road, styles.roadAlt, { top: '58%', left: 30, width: '90%', transform: [{ rotate: '12deg' }] }]} />
      <View style={styles.pinWrap}>
        <Ionicons name="location" size={compact ? 22 : 28} color={Colors.primary} />
      </View>
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
  road: {
    position: 'absolute',
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 6,
  },
  roadAlt: { backgroundColor: 'rgba(210, 220, 200, 0.9)' },
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
  },
  permText: { color: Colors.white, fontWeight: '700' },
});
