import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Badge } from '@/components/ui/badge';
import { MapPreview } from '@/components/ui/map-preview';
import { Screen } from '@/components/ui/screen';
import { getVehicle, statusLabel } from '@/constants/data';
import { Colors, Radius } from '@/constants/theme';
import { useLocation } from '@/context/location-context';

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const v = getVehicle(id);
  const geo = useLocation();

  return (
    <Screen scroll>
      <View style={styles.top}>
        <BackButton />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{v.name}</Text>
          <Text style={styles.sub}>
            {v.plate} - {v.type} - {v.year}
          </Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color={Colors.text} />
      </View>

      <View style={styles.statusCard}>
        <Badge
          label={`• ${statusLabel[v.status]}`}
          tone={v.status === 'actif' ? 'success' : v.status === 'maintenance' ? 'warning' : 'neutral'}
        />
        <Text style={styles.updated}>Mis à jour {v.lastUpdate}</Text>
      </View>

      <View style={styles.stats}>
        <Stat icon="speedometer-outline" value={`${v.km.toLocaleString('fr-FR')} km`} label="Kilométrage" />
        <Stat icon="flash-outline" value={`${v.fuel}%`} label="Carburant" />
        <Stat icon="time-outline" value={v.lastTripDuration} label="Dernier trajet" />
      </View>

      <View style={styles.mapWrap}>
        <Text style={styles.mapLabel}>Position actuelle {geo.address || v.location}</Text>
        <MapPreview
          height={140}
          latitude={geo.coords?.latitude}
          longitude={geo.coords?.longitude}
          permissionDenied={geo.permission === 'denied'}
          onRequestPermission={() => void geo.requestPermission()}
        />
        <Pressable style={styles.follow} onPress={() => router.push({ pathname: '/owner/tracking/[id]', params: { id: v.id } })}>
          <Text style={styles.followText}>Suivre</Text>
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Action icon="time-outline" label="Historique" onPress={() => router.push('/owner/history')} />
        <Action icon="notifications-outline" label="Alertes" onPress={() => router.push('/owner/alerts')} />
        <Action icon="construct-outline" label="Entretien" onPress={() => router.push('/owner/maintenance')} />
        <Action icon="document-text-outline" label="Documents" onPress={() => router.push('/owner/documents')} />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.section}>Dernier trajet</Text>
        <Pressable onPress={() => router.push('/owner/history')}>
          <Text style={styles.link}>Voir tout</Text>
        </Pressable>
      </View>
      <View style={styles.timeline}>
        <View>
          <View style={styles.dotGreen} />
          <View style={styles.line} />
          <View style={styles.dotOrange} />
        </View>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <Text style={styles.stop}>Adjamé liberté</Text>
          <Text style={styles.stop}>Plateau</Text>
        </View>
        <View>
          <Text style={styles.strong}>{v.lastTripDistance}</Text>
          <Text style={styles.muted}>34 min</Text>
        </View>
      </View>
    </Screen>
  );
}

function Stat({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={18} color={Colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Action({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.action}>
      <Ionicons name={icon} size={20} color={Colors.primary} />
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  sub: { color: Colors.textSecondary, fontSize: 12 },
  statusCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updated: { color: Colors.textSecondary },
  stats: { flexDirection: 'row', marginVertical: 16 },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textSecondary },
  mapWrap: { position: 'relative', marginBottom: 16 },
  mapLabel: { position: 'absolute', zIndex: 2, left: 12, top: 12, fontWeight: '700', color: Colors.text },
  follow: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  followText: { color: Colors.white, fontWeight: '800' },
  actions: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  action: {
    flex: 1,
    backgroundColor: Colors.primarySoft,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  actionLabel: { fontSize: 11, fontWeight: '700', color: Colors.text },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  section: { fontWeight: '800', color: Colors.text },
  link: { color: Colors.primary, fontWeight: '700' },
  timeline: { flexDirection: 'row', gap: 12, marginTop: 12, minHeight: 70 },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.success },
  dotOrange: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  line: { width: 2, flex: 1, backgroundColor: Colors.border, marginLeft: 4, marginVertical: 4 },
  stop: { fontWeight: '700', color: Colors.text },
  strong: { fontWeight: '800', color: Colors.text },
  muted: { color: Colors.textSecondary, textAlign: 'right' },
});
