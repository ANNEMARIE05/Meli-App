import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { MapPreview } from '@/components/ui/map-preview';
import { formatClock, formatDistance } from '@/constants/geo';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useLocation } from '@/context/location-context';
import { tripTimeLabel, useTrip } from '@/context/trip-context';

export default function TripScreen() {
  const router = useRouter();
  const geo = useLocation();
  const { startedAt, addPoint, path, distanceKm, fromAddress, endTrip } = useTrip();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const started = startedAt?.getTime() ?? Date.now();
    const tick = () => setSeconds(Math.max(0, Math.floor((Date.now() - started) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  useEffect(() => {
    if (geo.coords) {
      addPoint(geo.coords);
    }
  }, [addPoint, geo.coords]);

  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  const gpsOk = geo.permission === 'granted' && !!geo.coords;

  return (
    <View style={styles.root}>
      <MapPreview
        fill
        latitude={geo.coords?.latitude}
        longitude={geo.coords?.longitude}
        path={path}
        permissionDenied={geo.permission === 'denied'}
        onRequestPermission={() => void geo.requestPermission()}
      />
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topRow}>
          <View style={styles.live}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Course en cours</Text>
          </View>
          <Pressable onPress={() => router.push('/driver/incident')}>
            <Text style={styles.alert}>Signaler un incident</Text>
          </Pressable>
        </View>

        <View style={styles.stats}>
          <Stat label="Durée" value={`${h}:${m}:${s}`} />
          <Stat label="Distance" value={formatDistance(distanceKm)} />
          <Stat label="Vitesse" value={`${geo.speedKmh} km/h`} />
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.bottomBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.departLabel}>Départ</Text>
            <Text style={styles.bottomText} numberOfLines={2}>
              {fromAddress || geo.address}
            </Text>
            <Text style={styles.departTime}>{tripTimeLabel(startedAt) || formatClock()}</Text>
          </View>
          <View style={styles.statusCol}>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: gpsOk ? Colors.success : Colors.warning }]} />
              <Text style={styles.bottomMeta}>GPS • {gpsOk ? 'Actif' : 'En attente'}</Text>
            </View>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.bottomMeta}>Moteur • ON</Text>
            </View>
          </View>
        </View>
        <Button
          label="Terminer la course"
          onPress={() => {
            endTrip(geo.address);
            router.replace('/driver/summary');
          }}
        />
      </SafeAreaView>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#DCE6D6' },
  overlay: { flex: 1, paddingHorizontal: 16, paddingBottom: 12, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  live: {
    backgroundColor: Colors.successBg,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  liveText: { color: Colors.success, fontWeight: '800' },
  alert: { color: Colors.danger, fontWeight: '700' },
  stats: { flexDirection: 'row', gap: 8, marginTop: 12 },
  stat: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: 12,
    ...Shadow.soft,
  },
  statLabel: { color: Colors.textSecondary, fontSize: 12 },
  statValue: { fontWeight: '800', fontSize: 16, marginTop: 4, color: Colors.text },
  bottomBar: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  departLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  bottomText: { fontWeight: '700', color: Colors.text, marginTop: 2 },
  departTime: { color: Colors.textSecondary, marginTop: 2, fontSize: 12 },
  statusCol: { alignItems: 'flex-end', gap: 6, paddingTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  bottomMeta: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600' },
});
