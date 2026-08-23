import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPreview } from '@/components/ui/map-preview';
import { Screen } from '@/components/ui/screen';
import { formatDistance, formatDuration } from '@/constants/geo';
import { Colors, Radius } from '@/constants/theme';
import { useLocation } from '@/context/location-context';
import { tripTimeLabel, useTrip } from '@/context/trip-context';

export default function TripSummaryScreen() {
  const router = useRouter();
  const geo = useLocation();
  const { lastTrip, identifiedVehicle } = useTrip();
  const lastPoint = lastTrip?.path[lastTrip.path.length - 1] ?? geo.coords;

  return (
    <Screen scroll>
      <View style={styles.center}>
        <View style={styles.check}>
          <Ionicons name="checkmark" size={32} color={Colors.white} />
        </View>
        <Text style={styles.title}>Course terminée</Text>
        <Badge label="• Félicitation" tone="success" />
      </View>

      <MapPreview
        height={140}
        latitude={lastPoint?.latitude}
        longitude={lastPoint?.longitude}
        path={lastTrip?.path}
        label={`${lastTrip?.fromAddress ?? 'Départ'} → ${lastTrip?.toAddress ?? geo.address}`}
      />

      <Text style={styles.section}>VÉHICULE</Text>
      <View style={styles.card}>
        <Row label="Modèle" value={identifiedVehicle.name} />
        <Row label="Immatriculation" value={identifiedVehicle.plate} last />
      </View>

      <Text style={styles.section}>STATISTIQUES</Text>
      <View style={styles.card}>
        <Row label="Heure de départ" value={tripTimeLabel(lastTrip?.startedAt ?? null)} />
        <Row label="Heure d’arrivée" value={tripTimeLabel(lastTrip?.endedAt ?? null)} />
        <Row label="Durée totale" value={lastTrip ? formatDuration(lastTrip.durationSec) : '--'} />
        <Row label="Distance" value={lastTrip ? formatDistance(lastTrip.distanceKm) : '--'} last />
      </View>

      <View style={{ height: 16 }} />
      <Button label="Retour à l’accueil" onPress={() => router.replace('/driver' as Href)} />
      <View style={{ height: 10 }} />
      <Button variant="secondary" label="Déclarer un incident" onPress={() => router.push('/driver/incident')} />
    </Screen>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.border]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', marginBottom: 18, gap: 10 },
  check: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text },
  section: { marginTop: 18, marginBottom: 8, color: Colors.textSecondary, fontWeight: '800', letterSpacing: 0.5 },
  card: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, paddingHorizontal: 14 },
  row: { minHeight: 46, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  border: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  label: { color: Colors.textSecondary },
  value: { fontWeight: '700', color: Colors.text },
});
