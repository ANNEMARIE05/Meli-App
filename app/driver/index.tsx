import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Screen } from '@/components/ui/screen';
import { formatDistance, formatDuration } from '@/constants/geo';
import { driver } from '@/constants/data';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useLocation } from '@/context/location-context';
import { useTrip } from '@/context/trip-context';

export default function DriverHomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const geo = useLocation();
  const { lastTrip, active } = useTrip();
  const name = user?.fullName ?? driver.fullName;
  const company = user?.company ?? driver.company;

  function onAvatar() {
    Alert.alert('Session', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login' as Href);
        },
      },
    ]);
  }

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>Bonjour 👋 {name}</Text>
          <Text style={styles.company}>{company}</Text>
        </View>
        <Pressable onPress={onAvatar} style={styles.avatar}>
          <Text style={styles.avatarText}>{name.slice(0, 1)}</Text>
        </Pressable>
      </View>

      <View style={styles.statusCard}>
        <Ionicons name="time-outline" size={20} color={Colors.textSecondary} />
        <View>
          <Text style={styles.statusTitle}>{active ? 'Course en cours' : 'Aucune course en cours'}</Text>
          <Text style={styles.statusSub}>
            {active ? geo.address : geo.permission === 'granted' ? `GPS prêt • ${geo.address}` : 'Prêt à démarrer une nouvelle course.'}
          </Text>
        </View>
      </View>

      <Pressable style={styles.scanCard} onPress={() => router.push('/driver/scan')}>
        <View style={styles.scanIcon}>
          <Ionicons name="qr-code-outline" size={36} color={Colors.white} />
        </View>
        <Text style={styles.scanTitle}>Scanner un véhicule</Text>
        <Text style={styles.scanSub}>Scannez le QR code pour commencer.</Text>
      </Pressable>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Dernière course</Text>
        <Pressable onPress={() => router.push('/driver/summary')}>
          <Text style={styles.link}>Historique</Text>
        </Pressable>
      </View>

      <View style={styles.tripCard}>
        <View style={styles.tripTop}>
          <View>
            <Text style={styles.vehicle}>{driver.vehicle.name}</Text>
            <Text style={styles.plate}>{driver.vehicle.plate}</Text>
          </View>
          <Badge label="Terminée" tone="success" />
        </View>
        <View style={styles.stats}>
          <Stat
            label="Date"
            value={
              lastTrip
                ? lastTrip.startedAt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                : '07 août 2026'
            }
          />
          <Stat label="Durée" value={lastTrip ? formatDuration(lastTrip.durationSec) : '1h 24min'} />
          <Stat label="Distance" value={lastTrip ? formatDistance(lastTrip.distanceKm) : '38.4 km'} />
        </View>
      </View>
    </Screen>
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
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  hello: { fontSize: 22, fontWeight: '800', color: Colors.text },
  company: { color: Colors.textSecondary, marginTop: 4 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: Colors.primary, fontWeight: '800', fontSize: 18 },
  statusCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: { fontWeight: '700', color: Colors.text },
  statusSub: { color: Colors.textSecondary, marginTop: 2, fontSize: 13 },
  scanCard: {
    backgroundColor: Colors.primary,
    borderRadius: 22,
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 28,
    ...Shadow.button,
  },
  scanIcon: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  scanTitle: { color: Colors.white, fontSize: 20, fontWeight: '800' },
  scanSub: { color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontWeight: '800', fontSize: 16, color: Colors.text },
  link: { color: Colors.primary, fontWeight: '700' },
  tripCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.soft,
  },
  tripTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vehicle: { fontWeight: '800', fontSize: 16, color: Colors.text },
  plate: { color: Colors.textSecondary, marginTop: 2 },
  stats: { flexDirection: 'row', marginTop: 16 },
  stat: { flex: 1 },
  statLabel: { color: Colors.textSecondary, fontSize: 12 },
  statValue: { fontWeight: '700', marginTop: 4, color: Colors.text },
});
