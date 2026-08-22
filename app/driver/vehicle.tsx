import { useRouter } from 'expo-router';
import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GarageReady } from '@/components/illustrations';
import { BackButton } from '@/components/ui/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { driver } from '@/constants/data';
import { Colors, Radius } from '@/constants/theme';

export default function VehicleIdentifiedScreen() {
  const router = useRouter();

  return (
    <Screen scroll bottom={<Button label="Continuer" onPress={() => router.push('/driver/engine')} />}>
      <BackButton />
      <GarageReady />
      <Section title="VÉHICULE">
        <Text style={styles.name}>{driver.vehicle.name}</Text>
        <Text style={styles.meta}>
          {driver.vehicle.plate} • {driver.vehicle.year}
        </Text>
        <Row label="Statut" value={<Badge label="Disponible" tone="success" />} />
        <Row label="GPS" value={<Badge label="Connecté" tone="success" />} />
        <Row label="Dernière comm." value="Il y a 2 min" />
        <Row label="Kilométrage" value="142 380 km" last />
      </Section>
      <Section title="AFFECTATION">
        <Row label="Chauffeur" value={driver.fullName} accent />
        <Row label="Entreprise" value={driver.company} />
        <Row label="Autorisation" value={<Badge label="Confirmée ✓" tone="success" />} last />
      </Section>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Row({
  label,
  value,
  last,
  accent,
}: {
  label: string;
  value: ReactNode;
  last?: boolean;
  accent?: boolean;
}) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.label}>{label}</Text>
      {typeof value === 'string' ? (
        <Text style={[styles.value, accent && { color: Colors.primary }]}>{value}</Text>
      ) : (
        value
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 18 },
  sectionTitle: { color: Colors.textSecondary, fontWeight: '800', letterSpacing: 0.6, marginBottom: 8 },
  card: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  name: { fontSize: 20, fontWeight: '800', color: Colors.text, marginTop: 14 },
  meta: { color: Colors.textSecondary, marginBottom: 8 },
  row: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  label: { color: Colors.textSecondary },
  value: { fontWeight: '700', color: Colors.text },
});
