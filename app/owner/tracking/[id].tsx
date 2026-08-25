import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { MapPreview, type MapFence } from '@/components/ui/map-preview';
import { formatDistance } from '@/constants/geo';
import { getVehicle } from '@/constants/data';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useLocation } from '@/context/location-context';
import { tripTimeLabel, useTrip } from '@/context/trip-context';
import { useWhatsGPSTracking } from '@/context/whatsgps-context';

const SLUG_TO_CAR_ID: Record<string, number> = {
  hilux: 1001,
  kangoo: 1002,
  partner: 1003,
};

export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const v = getVehicle(id);
  const geo = useLocation();
  const trip = useTrip();

  // Resolve numeric WhatsGPS carId
  const carId = useMemo(() => {
    if (!id) return 1001;
    const numeric = parseInt(id, 10);
    if (!isNaN(numeric)) return numeric;
    return SLUG_TO_CAR_ID[id.toLowerCase()] || 1001;
  }, [id]);

  const { vehicle: gpsVehicle, status: gpsStatus, boundFences, refresh: refreshGPS } = useWhatsGPSTracking(carId);

  // Fallback to WhatsGPS coords or device geolocation
  const currentLat = gpsStatus?.lat ?? geo.coords?.latitude;
  const currentLng = gpsStatus?.lon ?? geo.coords?.longitude;
  const currentSpeed = gpsStatus ? gpsStatus.speed : geo.speedKmh;
  const isOnline = gpsStatus?.online ?? true;
  const isAccOn = gpsStatus?.accState === 1;

  // Format Geofences for MapPreview
  const mapFences: MapFence[] = useMemo(() => {
    return boundFences.map((f) => ({
      id: f.carFenceId,
      name: f.name,
      type: f.type,
      radius: f.radius,
      points: f.points,
    }));
  }, [boundFences]);

  return (
    <View style={styles.root}>
      <MapPreview
        fill
        latitude={currentLat}
        longitude={currentLng}
        heading={gpsStatus?.dir}
        fences={mapFences}
        path={trip.active ? trip.path : undefined}
        permissionDenied={geo.permission === 'denied' && !gpsStatus}
        onRequestPermission={() => void geo.requestPermission()}
      />

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={20} color={Colors.text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.topTitle} numberOfLines={1}>
              {gpsVehicle?.machineName || v.name}
            </Text>
            <Text style={styles.topSub}>
              {gpsVehicle?.carNO || v.plate} • IMEI: {gpsVehicle?.imei || '868014041234567'}
            </Text>
          </View>
          <Pressable onPress={() => void refreshGPS()} style={styles.iconBtn}>
            <Ionicons name="refresh" size={18} color={Colors.primary} />
          </Pressable>
        </View>

        {/* Floating Telemetry Badge */}
        <View style={styles.floatingStats}>
          <View style={styles.speedCircle}>
            <Text style={styles.speedValue}>{Math.round(currentSpeed)}</Text>
            <Text style={styles.speedUnit}>km/h</Text>
          </View>

          {/* Quick status pill */}
          <View style={styles.telemetryPills}>
            <View style={[styles.pill, isAccOn ? styles.pillAccOn : styles.pillAccOff]}>
              <MaterialCommunityIcons name="engine" size={14} color={isAccOn ? '#2E7D32' : '#757575'} />
              <Text style={[styles.pillText, { color: isAccOn ? '#2E7D32' : '#757575' }]}>
                {isAccOn ? 'Contact ON' : 'Contact OFF'}
              </Text>
            </View>

            {gpsStatus?.batteryPercent !== undefined && (
              <View style={styles.pill}>
                <Ionicons name="battery-charging" size={14} color={Colors.primary} />
                <Text style={styles.pillText}>{gpsStatus.batteryPercent}%</Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ flex: 1 }} />

        {/* Bottom Detailed Telemetry Sheet */}
        <View style={styles.sheet}>
          <View style={styles.sheetHead}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.sheetTitle}>Traceur WhatsGPS</Text>
                <View style={[styles.liveDot, { backgroundColor: isOnline ? '#2E7D32' : '#E53935' }]} />
              </View>
              <Text style={styles.sheetSub} numberOfLines={2}>
                {trip.active
                  ? `Départ ${tripTimeLabel(trip.startedAt)} - ${trip.fromAddress}`
                  : `Position en direct • ${isOnline ? 'Balise connectée' : 'Balise hors-ligne'}`}
              </Text>
            </View>
            <Badge
              label={isOnline ? (currentSpeed > 2 ? 'En mouvement' : 'À l’arrêt') : 'Hors-ligne'}
              tone={isOnline ? (currentSpeed > 2 ? 'success' : 'info') : 'warning'}
            />
          </View>

          <View style={styles.stats}>
            <Kpi
              value={gpsStatus?.cumulativeMileage ? `${(gpsStatus.cumulativeMileage / 1000).toFixed(0)} km` : formatDistance(trip.distanceKm)}
              label="Kilométrage"
            />
            <Kpi
              value={gpsStatus?.voltage ? `${(gpsStatus.voltage / 1000).toFixed(1)}V` : '12.6V'}
              label="Tension"
            />
            <Kpi
              value={gpsStatus?.dir !== undefined ? `${gpsStatus.dir}°` : '—'}
              label="Cap / Dir."
            />
            <Kpi
              value={mapFences.length > 0 ? `${mapFences.length} active(s)` : 'Aucune'}
              label="Clôture"
            />
          </View>

          <View style={styles.dest}>
            <Ionicons name="navigate-circle" size={18} color={Colors.primary} />
            <Text style={styles.destText} numberOfLines={1}>
              {geo.address || `${currentLat?.toFixed(5)}, ${currentLng?.toFixed(5)}`}
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
    borderRadius: Radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...Shadow.soft,
  },
  iconBtn: {
    padding: 6,
    borderRadius: Radius.full,
  },
  topTitle: { fontWeight: '800', color: Colors.text, fontSize: 15 },
  topSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  floatingStats: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  speedCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  speedValue: { fontWeight: '900', fontSize: 19, color: Colors.text },
  speedUnit: { fontSize: 10, color: Colors.textSecondary, fontWeight: '600' },
  telemetryPills: {
    gap: 6,
    alignItems: 'flex-end',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    ...Shadow.soft,
  },
  pillAccOn: {
    backgroundColor: '#E8F5E9',
  },
  pillAccOff: {
    backgroundColor: '#F5F5F5',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },
  sheet: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    padding: 16,
    ...Shadow.card,
  },
  sheetHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  sheetTitle: { fontWeight: '800', fontSize: 16, color: Colors.text },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  sheetSub: { color: Colors.textSecondary, marginTop: 2, fontSize: 12 },
  stats: { flexDirection: 'row', marginVertical: 14 },
  kpi: { flex: 1, alignItems: 'center' },
  kpiValue: { fontWeight: '800', color: Colors.text, fontSize: 14 },
  kpiLabel: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },
  dest: {
    backgroundColor: Colors.primarySoft,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  destText: { color: Colors.primary, fontWeight: '700', flex: 1, fontSize: 12 },
});
