import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { owner, vehicles } from '@/constants/data';
import { Colors, Radius } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const name = user?.fullName ?? owner.fullName;

  async function disconnect() {
    await logout();
    router.replace('/(auth)/login');
  }

  return (
    <Screen scroll>
      <View style={styles.top}>
        <BackButton />
        <Text style={styles.title}>Mon Profil</Text>
        <View style={{ width: 42 }} />
      </View>

      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.slice(0, 1)}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{user?.company ? `Propriétaire - ${user.company}` : owner.role}</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Ionicons key={i} name={i <= 3 ? 'star' : 'star-outline'} size={16} color={Colors.primary} />
          ))}
        </View>
        <Text style={styles.member}>{owner.memberSince}</Text>
      </View>

      <View style={styles.stats}>
        <Mini icon="car-outline" value={`${vehicles.length}`} label="Véhicules" />
        <Mini icon="navigate-outline" value="421k" label="Km total" />
        <Mini icon="notifications-outline" value="7" label="Alertes" />
      </View>

      <Group title="NAVIGATION">
        <Row icon="home-outline" label="Retour à l'accueil" onPress={() => router.push('/owner')} />
        <Row icon="time-outline" label="Historique des trajets" last onPress={() => router.push('/owner/history')} />
      </Group>

      <Group title="COORDONNÉES">
        <Row icon="call-outline" label={user?.phone ?? owner.phone} />
        <Row icon="mail-outline" label={user?.email ?? owner.email} last />
      </Group>

      <Group title="PARAMÈTRES">
        <Row icon="notifications-outline" label="Notifications & Alertes" onPress={() => router.push('/owner/alerts')} />
        <Row icon="car-outline" label="Mes véhicules" onPress={() => router.push('/owner/vehicles')} />
        <Row icon="bar-chart-outline" label="Rapports d'activité" onPress={() => router.push('/owner/reports')} />
        <Row icon="lock-closed-outline" label="Sécurité" last onPress={() => router.push('/(auth)/new-password')} />
      </Group>

      <Group title="SUPPORT">
        <Row icon="help-circle-outline" label="Aide & FAQ" />
        <Row icon="star-outline" label="Évaluer l'application" last />
      </Group>

      <Button
        variant="danger"
        label="Se déconnecter"
        icon={<Ionicons name="log-out-outline" size={18} color={Colors.danger} />}
        onPress={() => void disconnect()}
        style={{ marginTop: 8, marginBottom: 20 }}
      />
    </Screen>
  );
}

function Mini({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string }) {
  return (
    <View style={styles.mini}>
      <Ionicons name={icon} size={18} color={Colors.primary} />
      <Text style={styles.miniValue}>{value}</Text>
      <Text style={styles.miniLabel}>{label}</Text>
    </View>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.group}>{title}</Text>
      <View style={styles.groupCard}>{children}</View>
    </View>
  );
}

function Row({
  icon,
  label,
  last,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  last?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.row, !last && styles.rowBorder]}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={16} color={Colors.primary} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  hero: { alignItems: 'center', marginBottom: 16 },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: Colors.primary },
  name: { fontSize: 20, fontWeight: '800', color: Colors.text },
  role: { color: Colors.textSecondary, marginTop: 4 },
  stars: { flexDirection: 'row', gap: 2, marginTop: 8 },
  member: { color: Colors.textMuted, marginTop: 4, fontSize: 12 },
  stats: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  mini: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  miniValue: { fontWeight: '800', fontSize: 18, color: Colors.text },
  miniLabel: { color: Colors.textSecondary, fontSize: 12 },
  group: { color: Colors.textSecondary, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 },
  groupCard: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, minHeight: 50 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { flex: 1, color: Colors.text, fontWeight: '600' },
});
