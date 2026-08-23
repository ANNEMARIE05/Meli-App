import { useRouter } from 'expo-router';
import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPreview } from '@/components/ui/map-preview';
import { Screen } from '@/components/ui/screen';
import { driver } from '@/constants/data';
import { Colors, Radius } from '@/constants/theme';
import { useLocation } from '@/context/location-context';
import { useTrip } from '@/context/trip-context';

export default function InitialStateScreen() {
  const router = useRouter();
  const geo = useLocation();
  const { identifiedVehicle } = useTrip();
  const gpsOk = geo.permission === 'granted' && !!geo.coords;

  return (
    <Screen scroll bottom={<Button label="Confirmer le départ" onPress={() => router.push('/driver/confirm')} />}>
      <View style={styles.top}>
        <BackButton />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>État initial du véhicule</Text>
          <Text style={styles.sub}>Données en lecture seule</Text>
        </View>
      </View>

      <MapPreview
        height={150}
        latitude={geo.coords?.latitude}
        longitude={geo.coords?.longitude}
        label={geo.address}
        permissionDenied={geo.permission === 'denied'}
        onRequestPermission={() => void geo.requestPermission()}
      />

      <Block title="VÉHICULE">
        <Line label="Marque / Modèle" value={identifiedVehicle.name} />
        <Line label="Immatriculation" value={identifiedVehicle.plate} last />
      </Block>

      <Block title="CHAUFFEUR">
        <View style={styles.driver}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>K</Text>
          </View>
          <View>
            <Text style={styles.strong}>{driver.fullName}</Text>
            <Text style={styles.muted}>{driver.company}</Text>
          </View>
        </View>
      </Block>

      <Block title="TÉLÉMATIQUE">
        <Line label="Moteur" value={<Badge label="ON" tone="success" />} />
        <Line label="Vitesse actuelle" value={`${geo.speedKmh} km/h`} />
        <Line label="Kilométrage" value={`${identifiedVehicle.km.toLocaleString('fr-FR')} km`} />
        <Line label="Source km" value={<Text style={styles.warn}>donnée OBD non disponible</Text>} />
        <Line
          label="GPS"
          value={<Badge label={gpsOk ? 'Connecté' : geo.permission === 'denied' ? 'Refusé' : 'En attente'} tone={gpsOk ? 'success' : 'warning'} />}
          last
        />
      </Block>
    </Screen>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Line({ label, value, last }: { label: string; value: ReactNode; last?: boolean }) {
  return (
    <View style={[styles.line, !last && styles.lineBorder]}>
      <Text style={styles.label}>{label}</Text>
      {typeof value === 'string' ? <Text style={styles.value}>{value}</Text> : value}
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '800', color: Colors.text },
  sub: { color: Colors.textSecondary, fontSize: 12 },
  block: { marginTop: 16 },
  blockTitle: { color: Colors.textSecondary, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
  card: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, paddingHorizontal: 14 },
  driver: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: Colors.primary, fontWeight: '800' },
  strong: { fontWeight: '800', color: Colors.text },
  muted: { color: Colors.textSecondary },
  line: { minHeight: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lineBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  label: { color: Colors.textSecondary },
  value: { fontWeight: '700', color: Colors.text },
  warn: { color: Colors.primary, fontWeight: '700' },
});
