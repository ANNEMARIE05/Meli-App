import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Screen } from '@/components/ui/screen';
import { trips } from '@/constants/data';
import { Colors, Radius } from '@/constants/theme';

const ranges = ["Aujourd'hui", 'Semaine', 'Mois'] as const;

export default function HistoryScreen() {
  const [range, setRange] = useState<(typeof ranges)[number]>("Aujourd'hui");
  const groups = [...new Set(trips.map((t) => t.dateGroup))];

  return (
    <Screen scroll>
      <View style={styles.top}>
        <BackButton />
        <Text style={styles.title}>Historique</Text>
        <Ionicons name="filter-outline" size={20} color={Colors.text} />
      </View>

      <View style={styles.seg}>
        {ranges.map((r) => (
          <Pressable key={r} onPress={() => setRange(r)} style={[styles.segItem, range === r && styles.segOn]}>
            <Text style={[styles.segText, range === r && styles.segTextOn]}>{r}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.summary}>
        <Summary value="5 Trajets" />
        <Summary value="95 km" />
        <Summary value="2h 51" />
      </View>

      {groups.map((g) => (
        <View key={g} style={{ marginBottom: 8 }}>
          <Text style={styles.group}>{g}</Text>
          {trips
            .filter((t) => t.dateGroup === g)
            .map((t) => (
              <View key={t.id} style={styles.card}>
                <Text style={styles.time}>{t.startTime}</Text>
                <View style={styles.dots}>
                  <View style={styles.dotGreen} />
                  <View style={styles.vline} />
                  <View style={styles.dotGrey} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stop}>{t.from}</Text>
                  <Text style={[styles.stop, { marginTop: 14 }]}>{t.to}</Text>
                </View>
                <View>
                  <Text style={styles.right}>{t.duration}</Text>
                  <Text style={styles.rightSub}>{t.distance}</Text>
                </View>
              </View>
            ))}
        </View>
      ))}
    </Screen>
  );
}

function Summary({ value }: { value: string }) {
  return (
    <View style={styles.sumCard}>
      <Text style={styles.sumText}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  seg: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    padding: 4,
    marginBottom: 14,
  },
  segItem: { flex: 1, height: 36, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: Colors.primary },
  segText: { fontWeight: '700', color: Colors.textSecondary, fontSize: 13 },
  segTextOn: { color: Colors.white },
  summary: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  sumCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sumText: { fontWeight: '800', color: Colors.text },
  group: { fontWeight: '800', marginBottom: 8, color: Colors.text },
  card: {
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 12,
    marginBottom: 10,
  },
  time: { fontWeight: '700', color: Colors.textSecondary, width: 44 },
  dots: { alignItems: 'center', width: 12 },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.success },
  dotGrey: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.borderStrong },
  vline: { width: 2, flex: 1, backgroundColor: Colors.border, marginVertical: 3 },
  stop: { fontWeight: '700', color: Colors.text },
  right: { fontWeight: '800', color: Colors.text, textAlign: 'right' },
  rightSub: { color: Colors.textSecondary, textAlign: 'right', marginTop: 12 },
});
