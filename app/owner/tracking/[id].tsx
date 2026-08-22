import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { MapPreview } from '@/components/ui/map-preview';
import { formatDistance } from '@/constants/geo';
import { getVehicle } from '@/constants/data';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useLocation } from '@/context/location-context';
import { tripTimeLabel, useTrip } from '@/context/trip-context';

export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const v = getVehicle(id);
  const geo = useLocation();
  const trip = useTrip();
  const gpsOk = geo.permission === 'granted' && !!geo.coords;

  return (
    <View style={styles.root}>
      <MapPreview
        fill
        latitude={geo.coords?.latitude}
        longitude={geo.coords?.longitude}
        path={trip.active ? trip.path : undefined}
        permissionDenied={geo.permission === 'denied'}
        onRequestPermission={() => void geo.requestPermission()}
      />
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color={Colors.text} />
          </Pressable>
          <Text style={styles.topTitle}>
            {v.name} - {v.plate}
          </Text>
          <Pressable onPress={() => void geo.refresh()}>
            <Ionicons name="refresh" size={18} color={Colors.text} />
          </Pressable>
        </View>

        <View style={styles.speed}>
          <Text style={styles.speedValue}>{geo.speedKmh}</Text>
          <Text style={styles.speedUnit}>km/h</Text>
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.sheet}>
          <View style={styles.sheetHead}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sheetTitle}>{trip.active ? 'Trajet en cours' : 'Position en direct'}</Text>
              <Text style={styles.sheetSub} numberOfLines={2}>
                {trip.active
                  ? `Départ ${tripTimeLabel(trip.startedAt)} - ${trip.fromAddress}`
                  : geo.address}
              </Text>
            </View>
            <Badge label={gpsOk ? 'En route' : 'GPS'} tone={gpsOk ? 'success' : 'warning'} />
          </View>
          <View style={styles.stats}>
            <Kpi value={formatDistance(trip.distanceKm)} label="Distance" />
            <Kpi value={trip.active && trip.startedAt ? `${Math.max(1, Math.round((Date.now() - trip.startedAt.getTime()) / 60000))} min` : '—'} label="Durée" />
            <Kpi value={`${geo.speedKmh} km/h`} label="Moy" />
          </View>
          <View style={styles.dest}>
            <Ionicons name="navigate" size={16} color={Colors.primary} />
            <Text style={styles.destText} numberOfLines={1}>
              {geo.address}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Kpi({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.kpi}>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#DCE6D6' },
  overlay: { ...StyleSheet.absoluteFillObject, paddingHorizontal: 16, paddingBottom: 12 },
  topBar: {
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...Shadow.soft,
  },
  topTitle: { flex: 1, fontWeight: '700', color: Colors.text },
  speed: {
    alignSelf: 'flex-end',
    marginTop: 12,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  speedValue: { fontWeight: '800', fontSize: 18, color: Colors.text },
  speedUnit: { fontSize: 11, color: Colors.textSecondary },
  sheet: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    padding: 16,
    ...Shadow.card,
  },
  sheetHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  sheetTitle: { fontWeight: '800', fontSize: 16, color: Colors.text },
  sheetSub: { color: Colors.textSecondary, marginTop: 2, fontSize: 12 },
  stats: { flexDirection: 'row', marginVertical: 14 },
  kpi: { flex: 1, alignItems: 'center' },
  kpiValue: { fontWeight: '800', color: Colors.text },
  kpiLabel: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  dest: {
    backgroundColor: Colors.primarySoft,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  destText: { color: Colors.primary, fontWeight: '700', flex: 1 },
});
