import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Badge } from '@/components/ui/badge';
import { Screen } from '@/components/ui/screen';
import { statusLabel, vehicles, type VehicleStatus } from '@/constants/data';
import { Colors, Radius } from '@/constants/theme';

const filters: { id: 'all' | VehicleStatus; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'actif', label: 'Actifs' },
  { id: 'arrete', label: 'Arrêtés' },
  { id: 'maintenance', label: 'Maintenance' },
];

export default function VehiclesScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all');

  const list = useMemo(
    () =>
      vehicles.filter((v) => {
        const matchFilter = filter === 'all' || v.status === filter;
        const q = query.toLowerCase();
        const matchQuery = v.name.toLowerCase().includes(q) || v.plate.toLowerCase().includes(q);
        return matchFilter && matchQuery;
      }),
    [filter, query]
  );

  return (
    <Screen scroll>
      <View style={styles.top}>
        <BackButton />
        <View>
          <Text style={styles.title}>Mes Véhicules</Text>
          <Text style={styles.sub}>{vehicles.length} véhicules enregistrés</Text>
        </View>
      </View>

      <View style={styles.search}>
        <Ionicons name="search" size={18} color={Colors.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher un véhicule..."
          placeholderTextColor={Colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filters}>
        {filters.map((f) => (
          <Pressable key={f.id} onPress={() => setFilter(f.id)} style={[styles.chip, filter === f.id && styles.chipOn]}>
            <Text style={[styles.chipText, filter === f.id && styles.chipTextOn]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>

      {list.map((v) => (
        <Pressable key={v.id} style={styles.card} onPress={() => router.push({ pathname: '/owner/vehicle/[id]', params: { id: v.id } })}>
          <View style={styles.icon}>
            <Ionicons name="car-outline" size={22} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{v.name}</Text>
            <Text style={styles.meta}>
              {v.plate} | {v.type} - {v.year} - {v.km.toLocaleString('fr-FR')} km
            </Text>
            <View style={{ marginTop: 8, alignSelf: 'flex-start' }}>
              <Badge
                label={`• ${statusLabel[v.status]}`}
                tone={v.status === 'actif' ? 'success' : v.status === 'maintenance' ? 'warning' : 'neutral'}
              />
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </Pressable>
      ))}

      <Pressable style={styles.add} onPress={() => router.push('/owner/add-vehicle')}>
        <Text style={styles.addText}>+ Ajouter un véhicule</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text },
  sub: { color: Colors.textSecondary, fontSize: 13 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 12,
  },
  searchInput: { flex: 1, color: Colors.text },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
  },
  chipOn: { backgroundColor: Colors.primary },
  chipText: { fontWeight: '700', color: Colors.textSecondary, fontSize: 13 },
  chipTextOn: { color: Colors.white },
  card: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 10,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontWeight: '800', color: Colors.text, fontSize: 16 },
  meta: { color: Colors.textSecondary, fontSize: 12, marginTop: 3 },
  add: { alignItems: 'center', paddingVertical: 16 },
  addText: { color: Colors.primary, fontWeight: '800' },
});
