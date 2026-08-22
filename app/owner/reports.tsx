import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Screen } from '@/components/ui/screen';
import { Colors, Radius } from '@/constants/theme';

const ranges = ['Semaine', 'Mois', 'Année'] as const;
const days = [
  { d: 'L', v: 32 },
  { d: 'M', v: 44 },
  { d: 'M', v: 28 },
  { d: 'J', v: 51 },
  { d: 'V', v: 38 },
  { d: 'S', v: 72 },
  { d: 'D', v: 20 },
];

export default function ReportsScreen() {
  const [range, setRange] = useState<(typeof ranges)[number]>('Semaine');

  return (
    <Screen scroll>
      <View style={styles.top}>
        <BackButton />
        <Text style={styles.title}>Rapports</Text>
        <View style={{ width: 42 }} />
      </View>

      <View style={styles.seg}>
        {ranges.map((r) => (
          <Pressable key={r} onPress={() => setRange(r)} style={[styles.segItem, range === r && styles.segOn]}>
            <Text style={[styles.segText, range === r && styles.segTextOn]}>{r}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.grid}>
        <Stat title="Distance totale" value="312 km" hint="+12% vs semaine dernière" />
        <Stat title="Trajets" value="18" hint="+3 cette semaine" />
        <Stat title="Temps utilisation" value="14h 30" hint="Moy. 2h/jour" />
        <Stat title="Coût estimatif" value="850 DH" hint="Carburant + entretien" />
      </View>

      <Text style={styles.section}>Distance par jour (km)</Text>
      <View style={styles.chart}>
        {days.map((day, i) => (
          <View key={`${day.d}-${i}`} style={styles.barCol}>
            <View style={styles.barTrack}>
              <View style={[styles.bar, { height: day.v, backgroundColor: day.d === 'S' ? Colors.primary : '#E6E6EA' }]} />
            </View>
            <Text style={styles.barLabel}>{day.d}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.section}>Disponibilité flotte</Text>
      <Avail name="Toyota Hilux" pct={92} color={Colors.success} />
      <Avail name="Renault Kangoo" pct={78} color={Colors.warning} />
      <Avail name="Mercedes Sprinter" pct={45} color={Colors.danger} />
    </Screen>
  );
}

function Stat({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statHint}>{hint}</Text>
    </View>
  );
}

function Avail({ name, pct, color }: { name: string; pct: number; color: string }) {
  return (
    <View style={styles.avail}>
      <View style={styles.availRow}>
        <Text style={styles.availName}>{name}</Text>
        <Text style={styles.availPct}>{pct}%</Text>
      </View>
      <View style={styles.availTrack}>
        <View style={[styles.availFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '800', color: Colors.text },
  seg: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.full, padding: 4, marginBottom: 14 },
  segItem: { flex: 1, height: 36, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: Colors.primary },
  segText: { fontWeight: '700', color: Colors.textSecondary },
  segTextOn: { color: Colors.white },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: {
    width: '48%',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 12,
  },
  statTitle: { color: Colors.textSecondary, fontSize: 12 },
  statValue: { fontWeight: '800', fontSize: 20, color: Colors.text, marginVertical: 4 },
  statHint: { color: Colors.textMuted, fontSize: 11 },
  section: { marginTop: 20, marginBottom: 12, fontWeight: '800', color: Colors.text },
  chart: { flexDirection: 'row', justifyContent: 'space-between', height: 110, alignItems: 'flex-end' },
  barCol: { alignItems: 'center', width: 32 },
  barTrack: { height: 80, justifyContent: 'flex-end' },
  bar: { width: 18, borderRadius: 8 },
  barLabel: { marginTop: 6, color: Colors.textSecondary, fontWeight: '700' },
  avail: { marginBottom: 12 },
  availRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  availName: { fontWeight: '700', color: Colors.text },
  availPct: { color: Colors.textSecondary, fontWeight: '700' },
  availTrack: { height: 8, backgroundColor: Colors.surface, borderRadius: 4, overflow: 'hidden' },
  availFill: { height: 8, borderRadius: 4 },
});
