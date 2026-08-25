import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { vehicles as mockVehicles, type VehicleStatus } from '@/constants/data';
import { Colors, Radius } from '@/constants/theme';
import { useWhatsGPS } from '@/context/whatsgps-context';

const filters: { id: 'all' | VehicleStatus; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'actif', label: 'Actifs' },
  { id: 'arrete', label: 'Arrêtés' },
  { id: 'maintenance', label: 'Maintenance' },
];

export default function VehiclesScreen() {
  const router = useRouter();
  const { vehicles: gpsVehicles, statuses } = useWhatsGPS();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all');

  const list = useMemo(() => {
    return mockVehicles.map((mv, index) => {
      const gpsMatch = gpsVehicles[index];
      const liveStatus = gpsMatch ? statuses[gpsMatch.carId] : undefined;
      return {
        ...mv,
        carId: gpsMatch?.carId || (index + 1001),
        imei: gpsMatch?.imei || '868014041234567',
        online: liveStatus ? liveStatus.online : mv.status === 'actif',
        speed: liveStatus ? liveStatus.speed : 0,
      };
    }).filter((v) => {
      const matchFilter = filter === 'all' || v.status === filter;
      const q = query.toLowerCase();
      const matchQuery = v.name.toLowerCase().includes(q) || v.plate.toLowerCase().includes(q) || v.imei.includes(q);
      return matchFilter && matchQuery;
    });
  }, [gpsVehicles, statuses, filter, query]);

  return (
    <Screen
      scroll
      bottom={
        <Button label="Ajouter un nouveau véhicule" onPress={() => router.push('/owner/vehicle-form')} />
      }>
      <View style={styles.top}>
        <BackButton />
        <View>
          <Text style={styles.title}>Mes Véhicules & Balises</Text>
          <Text style={styles.sub}>{list.length} véhicules connectés WhatsGPS</Text>
        </View>
      </View>

      <View style={styles.search}>
        <Ionicons name="search" size={18} color={Colors.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher par nom, immatriculation ou IMEI..."
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
        <Pressable
          key={v.id}
          style={styles.card}
          onPress={() => router.push({ pathname: '/owner/tracking/[id]', params: { id: String(v.carId) } })}
        >
          <View style={styles.icon}>
            <Ionicons name="car-outline" size={22} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.name}>{v.name}</Text>
              <View style={[styles.statusDot, { backgroundColor: v.online ? '#2E7D32' : '#9E9E9E' }]} />
            </View>
            <Text style={styles.meta}>
              {v.plate} • IMEI: {v.imei}
            </Text>
            <Text style={styles.metaSub}>
              {v.type} • {v.km.toLocaleString('fr-FR')} km {v.speed > 0 ? `• Vitesse: ${Math.round(v.speed)} km/h` : ''}
            </Text>
            <View style={{ marginTop: 8, alignSelf: 'flex-start' }}>
              <Badge
                label={v.online ? (v.speed > 0 ? 'En route' : 'À l’arrêt (En ligne)') : 'Hors-ligne'}
                tone={v.online ? (v.speed > 0 ? 'success' : 'info') : 'neutral'}
              />
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </Pressable>
      ))}
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
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  meta: { color: Colors.textSecondary, fontSize: 12, marginTop: 3 },
  metaSub: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
});

