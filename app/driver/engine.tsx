import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Badge } from '@/components/ui/badge';
import { Screen } from '@/components/ui/screen';
import { formatRelativeTime } from '@/constants/geo';
import { Colors, Radius } from '@/constants/theme';
import { useLocation } from '@/context/location-context';
import { useTrip } from '@/context/trip-context';

export default function EngineScreen() {
  const router = useRouter();
  const geo = useLocation();
  const { identifiedVehicle } = useTrip();
  const gpsOk = geo.permission === 'granted' && !!geo.coords;
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setPulse((v) => !v), 800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => router.push('/driver/initial-state'), 3500);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <Screen style={styles.screen}>
      <View style={styles.top}>
        <BackButton />
        <Text style={styles.header}>Démarrage moteur</Text>
      </View>

      <View style={styles.center}>
        <View style={[styles.ring, pulse && styles.ringOn]}>
          <View style={styles.core}>
            <Ionicons name="power" size={36} color={Colors.danger} />
          </View>
        </View>
        <Text style={styles.title}>En attente du démarrage..</Text>
        <Text style={styles.sub}>Mettez le contact ou démarrez le moteur pour continuer.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHead}>
          <View style={{ flex: 1 }}>
            <Text style={styles.vehicle}>{identifiedVehicle.name}</Text>
            <Text style={styles.plate}>{identifiedVehicle.plate}</Text>
          </View>
          <Badge label="En attente de démarrage" tone="warning" />
        </View>
        <View style={styles.icons}>
          <IconState icon="locate" name="GPS" status={gpsOk ? 'Connecté' : 'En attente'} ok={gpsOk} />
          <IconState icon="radio" name="Balise" status="Connectée" ok />
          <IconState icon="power" name="Moteur" status="Éteint" />
        </View>
        <Text style={styles.stamp}>
          Dernière communication : {gpsOk ? formatRelativeTime(geo.lastFixAt) : 'en attente'}
        </Text>
      </View>

      <Pressable onPress={() => router.push('/driver/initial-state')}>
        <Text style={styles.retry}>Vérifier à nouveau</Text>
      </Pressable>
    </Screen>
  );
}

function IconState({
  icon,
  name,
  status,
  ok,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  status: string;
  ok?: boolean;
}) {
  const color = ok ? Colors.success : Colors.danger;
  return (
    <View style={styles.iconState}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.iconName}>{name}</Text>
      <Text style={[styles.iconStatus, { color }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { justifyContent: 'space-between' },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  header: { fontSize: 20, fontWeight: '800', color: Colors.text },
  center: { alignItems: 'center', paddingTop: 8 },
  ring: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 10,
    borderColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  ringOn: { borderColor: Colors.primary },
  core: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  sub: { color: Colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  card: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 16,
  },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, alignItems: 'center' },
  vehicle: { fontWeight: '800', color: Colors.text },
  plate: { color: Colors.textSecondary, marginTop: 2 },
  icons: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' },
  iconState: { flex: 1, alignItems: 'center', gap: 4 },
  iconName: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  iconStatus: { fontWeight: '700', fontSize: 12 },
  stamp: { color: Colors.textMuted, marginTop: 14, fontSize: 12, textAlign: 'center' },
  retry: { color: Colors.primary, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
});
