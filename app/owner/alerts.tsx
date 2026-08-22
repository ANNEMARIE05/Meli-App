import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { alerts } from '@/constants/data';
import { Colors, Radius } from '@/constants/theme';

const cats = [
  { id: 'all', label: 'Toutes' },
  { id: 'critique', label: 'Critiques' },
  { id: 'avert', label: 'Avert.' },
  { id: 'info', label: 'Infos' },
] as const;

export default function AlertsScreen() {
  const router = useRouter();
  const [cat, setCat] = useState<(typeof cats)[number]['id']>('all');
  const list = useMemo(() => alerts.filter((a) => cat === 'all' || a.type === cat), [cat]);

  return (
    <Screen scroll>
      <View style={styles.top}>
        <BackButton />
        <Text style={styles.title}>Alertes</Text>
        <View style={styles.newPill}>
          <Text style={styles.newText}>2 nouvelles</Text>
        </View>
      </View>

      <View style={styles.cats}>
        {cats.map((c) => (
          <Pressable key={c.id} onPress={() => setCat(c.id)} style={[styles.cat, cat === c.id && styles.catOn]}>
            <Text style={[styles.catText, cat === c.id && styles.catTextOn]}>{c.label}</Text>
          </Pressable>
        ))}
      </View>

      {list.map((a) => (
        <View
          key={a.id}
          style={[
            styles.card,
            { borderColor: a.type === 'critique' ? Colors.primary : a.type === 'avert' ? Colors.info : Colors.border },
          ]}>
          {a.unread ? <View style={styles.dot} /> : null}
          <View style={styles.cardHead}>
            <Ionicons
              name={a.type === 'critique' ? 'warning' : a.title.includes('Batterie') ? 'battery-dead' : 'construct'}
              size={20}
              color={a.type === 'critique' ? Colors.danger : Colors.info}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{a.title}</Text>
              <Text style={styles.cardSub}>{a.detail}</Text>
              <Text style={styles.time}>{a.time}</Text>
            </View>
          </View>
          {a.type === 'critique' ? (
            <Button label="Voir le véhicule →" onPress={() => router.push({ pathname: '/owner/vehicle/[id]', params: { id: 'hilux' } })} />
          ) : null}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text },
  newPill: { backgroundColor: Colors.dangerBg, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  newText: { color: Colors.danger, fontWeight: '800', fontSize: 12 },
  cats: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  cat: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
  },
  catOn: { backgroundColor: Colors.primary },
  catText: { fontWeight: '700', color: Colors.textSecondary },
  catTextOn: { color: Colors.white },
  card: {
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 12,
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
  },
  cardHead: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  cardTitle: { fontWeight: '800', color: Colors.text },
  cardSub: { color: Colors.textSecondary, marginTop: 2 },
  time: { color: Colors.textMuted, marginTop: 4, fontSize: 12 },
});
