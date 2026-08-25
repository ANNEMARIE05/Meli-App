import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MapPreview } from '@/components/ui/map-preview';
import { Screen } from '@/components/ui/screen';
import { owner } from '@/constants/data';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useLocation } from '@/context/location-context';
import { useWhatsGPS } from '@/context/whatsgps-context';

export default function OwnerHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const geo = useLocation();
  const { vehicles, statusCounts, alarms, statuses } = useWhatsGPS();
  const name = user?.fullName ?? owner.fullName;

  const primaryVehicle = vehicles[0];
  const primaryStatus = primaryVehicle ? statuses[primaryVehicle.carId] : undefined;
  const primaryLat = primaryStatus?.lat ?? geo.coords?.latitude;
  const primaryLng = primaryStatus?.lon ?? geo.coords?.longitude;

  const totalVehiclesCount = statusCounts.allCount || vehicles.length || 3;

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>Bonjour 👋 {name}</Text>
          <Text style={styles.roleSub}>Gestionnaire Flotte & Propriétaire</Text>
        </View>
        <Pressable onPress={() => router.push('/driver' as any)} style={styles.switchModeBtn}>
          <Ionicons name="swap-horizontal" size={16} color={Colors.primary} />
          <Text style={styles.switchModeText}>Mode Chauffeur</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/owner/profile')} style={styles.avatar}>
          <Text style={styles.avatarText}>{name.slice(0, 1)}</Text>
        </Pressable>
      </View>

      <View style={styles.metrics}>
        <Metric
          icon="car-outline"
          color="#2563EB"
          bg="#EFF6FF"
          value={`${totalVehiclesCount} Véhicules`}
          onPress={() => router.push('/owner/vehicles')}
        />
        <Metric
          icon="construct-outline"
          color={Colors.primary}
          bg={Colors.primarySoft}
          value="Entretiens & Km"
          onPress={() => router.push('/owner/maintenance')}
        />
        <Metric
          icon="card-outline"
          color="#059669"
          bg="#ECFDF5"
          value="Abonnement"
          onPress={() => router.push('/owner/subscription')}
        />
      </View>

      <Pressable onPress={() => router.push({ pathname: '/owner/tracking/[id]', params: { id: primaryVehicle ? String(primaryVehicle.carId) : 'hilux' } })}>
        <MapPreview
          height={170}
          latitude={primaryLat}
          longitude={primaryLng}
          heading={primaryStatus?.dir}
          label={`${primaryVehicle?.machineName || 'Toyota Hilux'} • ${primaryStatus?.online ? 'En direct' : 'Position GPS'}`}
          permissionDenied={geo.permission === 'denied' && !primaryStatus}
          onRequestPermission={() => void geo.requestPermission()}
        />
      </Pressable>

      <Text style={styles.section}>Accès rapide</Text>
      <View style={styles.quick}>
        <Quick icon="car-sport-outline" label="Véhicules" onPress={() => router.push('/owner/vehicles')} />
        <Quick icon="navigate-outline" label="Suivi" onPress={() => router.push({ pathname: '/owner/tracking/[id]', params: { id: primaryVehicle ? String(primaryVehicle.carId) : 'hilux' } })} />
        <Quick icon="time-outline" label="Historique" onPress={() => router.push('/owner/history')} />
        <Quick icon="construct-outline" label="Entretiens" onPress={() => router.push('/owner/maintenance')} />
        <Quick icon="card-outline" label="Abonnement" onPress={() => router.push('/owner/subscription')} />
        <Quick icon="notifications-outline" label="Alertes" onPress={() => router.push('/owner/alerts')} />
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.section}>Alertes récentes</Text>
        <Pressable onPress={() => router.push('/owner/alerts')}>
          <Text style={styles.link}>Voir tout</Text>
        </Pressable>
      </View>
      {alarms.slice(0, 2).map((a) => (
        <Pressable key={a.alarmId} style={styles.alert} onPress={() => router.push('/owner/alerts')}>
          <View style={[styles.alertIcon, { backgroundColor: a.isNew !== false ? Colors.dangerBg : Colors.primarySoft }]}>
            <Ionicons
              name={a.isNew !== false ? 'warning' : 'notifications'}
              size={18}
              color={a.isNew !== false ? Colors.danger : Colors.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>{a.remark || 'Alerte Traceur'}</Text>
            <Text style={styles.alertSub}>
              Véhicule #{a.carId} - {new Date(a.alarmTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          {a.isNew !== false ? <View style={styles.unread} /> : null}
        </Pressable>
      ))}
    </Screen>
  );
}


function Metric({
  icon,
  color,
  bg,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.metric}>
      <View style={[styles.metricIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={styles.metricText}>{value}</Text>
    </Pressable>
  );
}

function Quick({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.quickItem}>
      <View style={styles.quickIcon}>
        <Ionicons name={icon} size={22} color={Colors.primary} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 8 },
  hello: { fontSize: 20, fontWeight: '800', color: Colors.text },
  roleSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 2, fontWeight: '500' },
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
  avatarText: { color: Colors.primary, fontWeight: '800' },
  metrics: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  metric: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 10,
    ...Shadow.soft,
    backgroundColor: Colors.white,
  },
  metricIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricText: { fontSize: 12, fontWeight: '700', color: Colors.text },
  section: { marginTop: 20, marginBottom: 12, fontWeight: '800', fontSize: 16, color: Colors.text },
  quick: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 14,
    justifyContent: 'space-between',
  },
  quickItem: { alignItems: 'center', width: '31%' },
  quickIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickLabel: { fontSize: 12, color: Colors.text, fontWeight: '600' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { color: Colors.primary, fontWeight: '700' },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    marginBottom: 10,
  },
  alertIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: { fontWeight: '700', color: Colors.text },
  alertSub: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  unread: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.danger },
});
