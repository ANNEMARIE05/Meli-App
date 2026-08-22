import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Screen } from '@/components/ui/screen';
import { driver } from '@/constants/data';
import { Colors, Radius } from '@/constants/theme';
import { useLocation } from '@/context/location-context';

export default function EngineScreen() {
  const router = useRouter();
  const geo = useLocation();
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
          <View>
            <Text style={styles.vehicle}>{driver.vehicle.name}</Text>
            <Text style={styles.plate}>{driver.vehicle.plate}</Text>
          </View>
          <Badge label="En attente du démarrage" tone="warning" />
        </View>
        <View style={styles.icons}>
          <IconState icon="locate" label={gpsOk ? 'GPS Connecté' : 'GPS en attente'} ok={gpsOk} />
          <IconState icon="radio" label="Balise Connectée" ok />
          <IconState icon="power" label="Moteur Éteint" />
        </View>
        <Text style={styles.stamp}>
          {geo.address} • précision {geo.accuracy ? `${Math.round(geo.accuracy)} m` : '—'}
        </Text>
      </View>

      <Pressable onPress={() => router.push('/driver/initial-state')}>
        <Text style={styles.retry}>Vérifier à nouveau.</Text>
      </Pressable>
    </Screen>
  );
}

function IconState({ icon, label, ok }: { icon: keyof typeof Ionicons.glyphMap; label: string; ok?: boolean }) {
  return (
    <View style={styles.iconState}>
      <Ionicons name={icon} size={20} color={ok ? Colors.success : Colors.danger} />
      <Text style={[styles.iconLabel, { color: ok ? Colors.success : Colors.danger }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { justifyContent: 'space-between' },
  center: { alignItems: 'center', paddingTop: 32 },
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
  icons: { marginTop: 16, gap: 10 },
  iconState: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconLabel: { fontWeight: '700', fontSize: 13 },
  stamp: { color: Colors.textMuted, marginTop: 14, fontSize: 12 },
  retry: { color: Colors.primary, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
});
