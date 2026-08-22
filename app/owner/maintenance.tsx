import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Badge } from '@/components/ui/badge';
import { Screen } from '@/components/ui/screen';
import { maintenance } from '@/constants/data';
import { Colors, Radius, Shadow } from '@/constants/theme';

export default function MaintenanceScreen() {
  const router = useRouter();
  const upcoming = maintenance.filter((m) => m.status !== 'fait');
  const history = maintenance.filter((m) => m.status === 'fait');

  return (
    <Screen scroll>
      <View style={styles.top}>
        <BackButton />
        <Text style={styles.title}>Maintenance</Text>
        <Pressable onPress={() => router.push('/owner/add-vehicle')} style={styles.plus}>
          <Ionicons name="add" size={20} color={Colors.text} />
        </Pressable>
      </View>

      <Text style={styles.group}>À VENIR</Text>
      {upcoming.map((m) => (
        <View key={m.id} style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle}>{m.title}</Text>
            <Badge label={m.status === 'urgent' ? 'Urgent' : 'À prévoir'} tone={m.status === 'urgent' ? 'warning' : 'info'} />
          </View>
          <Text style={styles.vehicle}>{m.vehicle}</Text>
          <View style={styles.cardBot}>
            <Text style={styles.meta}>{m.deadline}</Text>
            <Text style={styles.cost}>-{m.cost}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.group}>HISTORIQUE</Text>
      {history.map((m) => (
        <View key={m.id} style={styles.hist}>
          <View style={styles.check}>
            <Ionicons name="checkmark" size={14} color={Colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{m.title}</Text>
            <Text style={styles.vehicle}>{m.vehicle}</Text>
          </View>
          <View>
            <Text style={styles.meta}>{m.deadline}</Text>
            <Text style={[styles.cost, { textAlign: 'right' }]}>{m.cost}</Text>
          </View>
        </View>
      ))}

      <Pressable style={styles.fab} onPress={() => router.push('/owner/add-vehicle')}>
        <Text style={styles.fabText}>+ Programmer</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '800', color: Colors.text },
  plus: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  group: { color: Colors.textSecondary, fontWeight: '800', letterSpacing: 0.6, marginBottom: 10, marginTop: 8 },
  card: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 10,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontWeight: '800', color: Colors.text },
  vehicle: { color: Colors.textSecondary, marginTop: 4 },
  cardBot: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  meta: { color: Colors.textSecondary, fontSize: 12 },
  cost: { fontWeight: '800', color: Colors.text },
  hist: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    alignSelf: 'flex-end',
    marginTop: 24,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: 18,
    paddingVertical: 12,
    ...Shadow.button,
  },
  fabText: { color: Colors.white, fontWeight: '800' },
});
