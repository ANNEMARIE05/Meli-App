import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { MapPreview } from '@/components/ui/map-preview';
import { Screen } from '@/components/ui/screen';
import { trips } from '@/constants/data';
import { Colors, Radius } from '@/constants/theme';
import { useWhatsGPS, useWhatsGPSHistory } from '@/context/whatsgps-context';

const ranges = ["Aujourd'hui", 'Semaine', 'Mois'] as const;

export default function HistoryScreen() {
  const [range, setRange] = useState<(typeof ranges)[number]>("Aujourd'hui");
  const { vehicles } = useWhatsGPS();
  const [selectedCarId, setSelectedCarId] = useState<number>(vehicles[0]?.carId || 1001);

  const daysBack = range === "Aujourd'hui" ? 1 : range === 'Semaine' ? 7 : 30;
  const { trackPoints, stats, loading, reload } = useWhatsGPSHistory(selectedCarId, daysBack);

  const pathCoords = useMemo(() => {
    return trackPoints.map((p) => ({
      latitude: p.lat,
      longitude: p.lon,
    }));
  }, [trackPoints]);

  const groups = [...new Set(trips.map((t) => t.dateGroup))];

  return (
    <Screen scroll>
      <View style={styles.top}>
        <BackButton />
        <Text style={styles.title}>Historique & Trajets</Text>
        <Pressable onPress={() => void reload()} style={styles.filterBtn}>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Ionicons name="refresh" size={20} color={Colors.text} />
          )}
        </Pressable>
      </View>

      {/* Vehicle Selector Carousel */}
      {vehicles.length > 0 && (
        <View style={styles.vehicleSelector}>
          {vehicles.map((v) => (
            <Pressable
              key={v.carId}
              onPress={() => setSelectedCarId(v.carId)}
              style={[styles.vehPill, selectedCarId === v.carId && styles.vehPillOn]}
            >
              <Ionicons
                name="car-sport"
                size={14}
                color={selectedCarId === v.carId ? Colors.white : Colors.textSecondary}
              />
              <Text style={[styles.vehPillText, selectedCarId === v.carId && styles.vehPillTextOn]}>
                {v.carNO || v.machineName}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Time Range Tabs */}
      <View style={styles.seg}>
        {ranges.map((r) => (
          <Pressable key={r} onPress={() => setRange(r)} style={[styles.segItem, range === r && styles.segOn]}>
            <Text style={[styles.segText, range === r && styles.segTextOn]}>{r}</Text>
          </Pressable>
        ))}
      </View>

      {/* Trajectory Map Preview */}
      {pathCoords.length > 0 && (
        <View style={styles.mapWrap}>
          <MapPreview
            height={190}
            latitude={pathCoords[0]?.latitude}
            longitude={pathCoords[0]?.longitude}
            path={pathCoords}
            label={`${pathCoords.length} points GPS relevés`}
            interactive
          />
        </View>
      )}

      {/* Summary KPI Cards */}
      <View style={styles.summary}>
        <Summary
          label="Trajets"
          value={stats ? `${Math.max(1, Math.round(stats.mileage / 18000))} trajet(s)` : '5 Trajets'}
        />
        <Summary
          label="Distance"
          value={stats ? `${(stats.mileage / 1000).toFixed(1)} km` : '95 km'}
        />
        <Summary label="Durée estimée" value={range === "Aujourd'hui" ? '2h 15' : '14h 40'} />
      </View>

      {/* Itinerary List */}
      <Text style={styles.sectionHeader}>Détails des itinéraires</Text>
      {groups.map((g) => (
        <View key={g} style={{ marginBottom: 8 }}>
          <Text style={styles.group}>{g}</Text>
          {trips
            .filter((t) => t.dateGroup === g)
            .map((t) => (
              <View key={t.id} style={styles.card}>
                <Text style={styles.time}>{t.startTime}</Text>
                <View style={styles.dots}>
                  <View style={styles.dotGreen} />
                  <View style={styles.vline} />
                  <View style={styles.dotGrey} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stop}>{t.from}</Text>
                  <Text style={[styles.stop, { marginTop: 14 }]}>{t.to}</Text>
                </View>
                <View>
                  <Text style={styles.right}>{t.duration}</Text>
                  <Text style={styles.rightSub}>{t.distance}</Text>
                </View>
              </View>
            ))}
        </View>
      ))}
    </Screen>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.sumCard}>
      <Text style={styles.sumText}>{value}</Text>
      <Text style={styles.sumLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  filterBtn: { padding: 6 },
  vehicleSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  vehPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  vehPillOn: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  vehPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  vehPillTextOn: {
    color: Colors.white,
  },
  seg: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    padding: 4,
    marginBottom: 14,
  },
  segItem: { flex: 1, height: 36, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: Colors.primary },
  segText: { fontWeight: '700', color: Colors.textSecondary, fontSize: 13 },
  segTextOn: { color: Colors.white },
  mapWrap: {
    marginBottom: 16,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  summary: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  sumCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  sumText: { fontWeight: '800', color: Colors.text, fontSize: 14 },
  sumLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 10 },
  group: { fontWeight: '800', marginBottom: 8, color: Colors.textSecondary, fontSize: 12, textTransform: 'uppercase' },
  card: {
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 12,
    marginBottom: 10,
    backgroundColor: Colors.white,
  },
  time: { fontWeight: '700', color: Colors.textSecondary, width: 44 },
  dots: { alignItems: 'center', width: 12 },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.success },
  dotGrey: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.borderStrong },
  vline: { width: 2, flex: 1, backgroundColor: Colors.border, marginVertical: 3 },
  stop: { fontWeight: '700', color: Colors.text },
  right: { fontWeight: '800', color: Colors.text, textAlign: 'right' },
  rightSub: { color: Colors.textSecondary, textAlign: 'right', marginTop: 12 },
});
