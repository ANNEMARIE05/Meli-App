import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Screen } from '@/components/ui/screen';
import { driver } from '@/constants/data';
import { formatDistance, formatDuration } from '@/constants/geo';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useLocation } from '@/context/location-context';
import { useTrip } from '@/context/trip-context';

export default function DriverHomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const geo = useLocation();
  const { lastTrip, active, identifiedVehicle, fromAddress } = useTrip();
  const name = user?.fullName ?? driver.fullName;
  const company = user?.company ?? driver.company;

  function onAvatar() {
    Alert.alert('Session Chauffeur', 'Voulez-vous vous déconnecter ?', [
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
        <Pressable onPress={() => router.push('/owner' as any)} style={styles.switchModeBtn}>
          <Ionicons name="swap-horizontal" size={16} color={Colors.primary} />
          <Text style={styles.switchModeText}>Mode Propriétaire</Text>
        </Pressable>
        <Pressable onPress={onAvatar} style={styles.avatar}>
          <Text style={styles.avatarText}>{name.slice(0, 1)}</Text>
        </Pressable>
      </View>

      {/* Active Trip Banner or GPS Ready Banner */}
      {active ? (
        <Pressable style={styles.activeTripBanner} onPress={() => router.push('/driver/trip')}>
          <View style={styles.activeTripTop}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>COURSE EN COURS</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.white} />
          </View>
          <Text style={styles.activeTripVeh}>
            {identifiedVehicle.name} • {identifiedVehicle.plate}
          </Text>
          <Text style={styles.activeTripLoc}>Départ : {fromAddress || geo.address}</Text>
        </Pressable>
      ) : (
        <View style={styles.statusCard}>
          <Ionicons name="shield-checkmark-outline" size={22} color={Colors.success} />
          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitle}>Prêt pour prise de service</Text>
            <Text style={styles.statusSub}>
              {geo.permission === 'granted'
                ? `Position GPS verrouillée : ${geo.address}`
                : 'Scannez le QR code du véhicule pour enregistrer votre départ.'}
            </Text>
          </View>
        </View>
      )}

      {/* Primary Action - QR Code Scan */}
      <Pressable style={styles.scanCard} onPress={() => router.push('/driver/scan')}>
        <View style={styles.scanIcon}>
          <Ionicons name="qr-code-outline" size={34} color={Colors.white} />
        </View>
        <Text style={styles.scanTitle}>Scanner QR Code Véhicule</Text>
        <Text style={styles.scanSub}>Remplacement du cahier de bord • Prise de véhicule immédiate</Text>
      </Pressable>

      {/* Corporate Quick Grid */}
      <Text style={styles.sectionTitle}>ESPACE FLOTTE & MISSIONS</Text>
      <View style={styles.quickGrid}>
        <Pressable style={styles.quickCard} onPress={() => router.push('/driver/logbook')}>
          <View style={[styles.quickIconWrap, { backgroundColor: '#EEF2FF' }]}>
            <Ionicons name="book-outline" size={22} color="#4F46E5" />
          </View>
          <Text style={styles.quickCardTitle}>Carnet de Bord</Text>
          <Text style={styles.quickCardSub}>Historique & Km</Text>
        </Pressable>

        <Pressable style={styles.quickCard} onPress={() => router.push('/driver/incident')}>
          <View style={[styles.quickIconWrap, { backgroundColor: Colors.dangerBg }]}>
            <Ionicons name="warning-outline" size={22} color={Colors.danger} />
          </View>
          <Text style={styles.quickCardTitle}>Signaler Incident</Text>
          <Text style={styles.quickCardSub}>Panne ou Sinistre</Text>
        </Pressable>
      </View>

      {/* Last trip summary */}
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>DERNIÈRE MISSION RÉALISÉE</Text>
        <Pressable onPress={() => router.push('/driver/summary')}>
          <Text style={styles.link}>Détails</Text>
        </Pressable>
      </View>

      <View style={styles.tripCard}>
        <View style={styles.tripTop}>
          <View>
            <Text style={styles.vehicle}>{lastTrip?.toAddress ? identifiedVehicle.name : driver.vehicle.name}</Text>
            <Text style={styles.plate}>{lastTrip?.toAddress ? identifiedVehicle.plate : driver.vehicle.plate}</Text>
          </View>
          <Badge label="Terminée ✓" tone="success" />
        </View>
        <View style={styles.stats}>
          <Stat
            label="Date"
            value={
              lastTrip
                ? lastTrip.startedAt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
                : 'Aujourd’hui'
            }
          />
          <Stat label="Durée" value={lastTrip ? formatDuration(lastTrip.durationSec) : '34 min'} />
          <Stat label="Distance" value={lastTrip ? formatDistance(lastTrip.distanceKm) : '18.4 km'} />
        </View>
      </View>
      <View style={{ height: 24 }} />
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
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  hello: { fontSize: 20, fontWeight: '800', color: Colors.text },
  company: { color: Colors.textSecondary, marginTop: 2, fontSize: 12 },
  switchModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  switchModeText: { color: Colors.primary, fontSize: 11, fontWeight: '700' },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: Colors.primary, fontWeight: '800', fontSize: 18 },
  activeTripBanner: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 16,
    ...Shadow.button,
  },
  activeTripTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.white },
  liveText: { color: Colors.white, fontSize: 11, fontWeight: '800' },
  activeTripVeh: { color: Colors.white, fontSize: 16, fontWeight: '800' },
  activeTripLoc: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4 },
  statusCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 16,
    ...Shadow.soft,
  },
  statusTitle: { fontWeight: '700', color: Colors.text, fontSize: 14 },
  statusSub: { color: Colors.textSecondary, marginTop: 2, fontSize: 12, lineHeight: 16 },
  scanCard: {
    backgroundColor: Colors.mapNavy,
    borderRadius: Radius.xl,
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 18,
    ...Shadow.button,
  },
  scanIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  scanTitle: { color: Colors.white, fontSize: 18, fontWeight: '800' },
  scanSub: { color: '#94A3B8', marginTop: 4, fontSize: 12, textAlign: 'center' },
  sectionTitle: { fontWeight: '800', fontSize: 12, color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: 8 },
  quickGrid: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  quickCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: 6,
    ...Shadow.soft,
  },
  quickIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  quickCardTitle: { fontWeight: '800', fontSize: 13, color: Colors.text },
  quickCardSub: { fontSize: 11, color: Colors.textSecondary },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  link: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
  tripCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.soft,
  },
  tripTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vehicle: { fontWeight: '800', fontSize: 15, color: Colors.text },
  plate: { color: Colors.textSecondary, marginTop: 2, fontSize: 12 },
  stats: { flexDirection: 'row', marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  stat: { flex: 1 },
  statLabel: { color: Colors.textSecondary, fontSize: 11 },
  statValue: { fontWeight: '800', marginTop: 3, color: Colors.text, fontSize: 13 },
});
