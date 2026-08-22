import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { formatClock } from '@/constants/geo';
import { driver } from '@/constants/data';
import { Colors, Radius } from '@/constants/theme';
import { useLocation } from '@/context/location-context';
import { useTrip } from '@/context/trip-context';

export default function ConfirmScreen() {
  const router = useRouter();
  const geo = useLocation();
  const trip = useTrip();
  const gpsOk = geo.permission === 'granted' && !!geo.coords;

  return (
    <Screen
      bottom={
        <Button
          label="Confirmer le départ"
          onPress={() => {
            trip.startTrip(geo.address, geo.coords);
            router.replace('/driver/trip');
          }}
        />
      }>
      <View style={styles.top}>
        <BackButton />
        <Text style={styles.header}>Confirmation</Text>
      </View>

      <View style={styles.success}>
        <View style={styles.check}>
          <Ionicons name="checkmark" size={26} color={Colors.white} />
        </View>
        <Text style={styles.successTitle}>Le véhicule est prêt.</Text>
        <Text style={styles.successSub}>Vous pouvez démarrer votre course.</Text>
      </View>

      <Text style={styles.section}>RÉSUMÉ</Text>
      <View style={styles.card}>
        <Row label="Véhicule" value={driver.vehicle.name} />
        <Row label="Immatriculation" value={driver.vehicle.plate} />
        <Row label="Chauffeur" value={driver.fullName} />
        <Row label="Lieu de départ" value={geo.address} />
        <Row label="Heure" value={formatClock()} />
        <Row label="Moteur" value={<Badge label="ON" tone="success" />} />
        <Row label="GPS" value={<Badge label={gpsOk ? 'Connecté' : 'En attente'} tone={gpsOk ? 'success' : 'warning'} />} last />
      </View>

      <View style={styles.info}>
        <Ionicons name="information-circle" size={18} color={Colors.info} />
        <Text style={styles.infoText}>La balise GPS enregistre automatiquement votre trajet dès le démarrage.</Text>
      </View>
    </Screen>
  );
}

function Row({ label, value, last }: { label: string; value: ReactNode; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.border]}>
      <Text style={styles.label}>{label}</Text>
      {typeof value === 'string' ? <Text style={styles.value}>{value}</Text> : value}
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  header: { fontSize: 20, fontWeight: '800', color: Colors.text },
  success: {
    backgroundColor: Colors.success,
    borderRadius: Radius.lg,
    padding: 18,
    marginBottom: 20,
  },
  check: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  successTitle: { color: Colors.white, fontWeight: '800', fontSize: 18 },
  successSub: { color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  section: { color: Colors.textSecondary, fontWeight: '800', letterSpacing: 0.6, marginBottom: 8 },
  card: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, paddingHorizontal: 14 },
  row: { minHeight: 46, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  border: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  label: { color: Colors.textSecondary },
  value: { fontWeight: '700', color: Colors.text },
  info: {
    marginTop: 16,
    backgroundColor: Colors.infoBg,
    borderRadius: Radius.md,
    padding: 12,
    flexDirection: 'row',
    gap: 8,
  },
  infoText: { flex: 1, color: Colors.info, lineHeight: 18 },
});
