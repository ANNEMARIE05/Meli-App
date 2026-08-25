import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Colors, Radius } from '@/constants/theme';
import { useWhatsGPS } from '@/context/whatsgps-context';
import { VehicleAlarmType } from '@/services/whatsgps';

const cats = [
  { id: 'all', label: 'Toutes' },
  { id: 'critique', label: 'Critiques' },
  { id: 'avert', label: 'Avert.' },
  { id: 'info', label: 'Infos' },
] as const;

function getAlarmMeta(type: VehicleAlarmType) {
  switch (type) {
    case VehicleAlarmType.SOS:
    case VehicleAlarmType.POWER_OFF:
    case VehicleAlarmType.ANTI_DISASSEMBLY:
      return {
        category: 'critique' as const,
        icon: 'alert-decagram' as const,
        color: Colors.danger,
        label: 'Alerte Critique',
      };
    case VehicleAlarmType.VIBRATION:
    case VehicleAlarmType.SPEEDING:
    case VehicleAlarmType.FENCE_PLATFORM:
    case VehicleAlarmType.FENCE_TERMINAL:
    case VehicleAlarmType.OUT_AREA_TERMINAL:
      return {
        category: 'avert' as const,
        icon: 'speedometer' as const,
        color: '#E65100',
        label: 'Avertissement',
      };
    case VehicleAlarmType.LOW_POWER:
    case VehicleAlarmType.LOW_POWER_ALT:
      return {
        category: 'avert' as const,
        icon: 'battery-alert' as const,
        color: '#F57C00',
        label: 'Batterie Faible',
      };
    case VehicleAlarmType.ACC_ALARM:
    case VehicleAlarmType.ACC_OFF_ALARM:
    default:
      return {
        category: 'info' as const,
        icon: 'information' as const,
        color: Colors.info,
        label: 'Information',
      };
  }
}

export default function AlertsScreen() {
  const router = useRouter();
  const { alarms, unreadAlarmsCount, markAlarmAsRead } = useWhatsGPS();
  const [cat, setCat] = useState<(typeof cats)[number]['id']>('all');

  const formattedList = useMemo(() => {
    return alarms.map((a) => {
      const meta = getAlarmMeta(a.alarmType);
      return {
        id: a.alarmId,
        carId: a.carId,
        type: meta.category,
        title: a.remark || meta.label,
        detail: `Véhicule ID #${a.carId} ${a.speed ? `• Vitesse: ${a.speed} km/h` : ''}`,
        time: new Date(a.alarmTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: a.isNew !== false,
        icon: meta.icon,
        iconColor: meta.color,
      };
    });
  }, [alarms]);

  const filteredList = useMemo(
    () => formattedList.filter((a) => cat === 'all' || a.type === cat),
    [formattedList, cat]
  );

  return (
    <Screen scroll>
      <View style={styles.top}>
        <BackButton />
        <Text style={styles.title}>Alarmes & Sécurité</Text>
        {unreadAlarmsCount > 0 ? (
          <View style={styles.newPill}>
            <Text style={styles.newText}>{unreadAlarmsCount} nouvelle(s)</Text>
          </View>
        ) : null}
      </View>

      {/* Filter Categories */}
      <View style={styles.cats}>
        {cats.map((c) => (
          <Pressable key={c.id} onPress={() => setCat(c.id)} style={[styles.cat, cat === c.id && styles.catOn]}>
            <Text style={[styles.catText, cat === c.id && styles.catTextOn]}>{c.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Mark All Read Action */}
      {unreadAlarmsCount > 0 && (
        <Pressable onPress={() => void markAlarmAsRead(-1)} style={styles.markAllBtn}>
          <Ionicons name="checkmark-done" size={16} color={Colors.primary} />
          <Text style={styles.markAllText}>Tout marquer comme lu</Text>
        </Pressable>
      )}

      {/* Alarms List */}
      {filteredList.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="shield-checkmark" size={48} color={Colors.primary} />
          <Text style={styles.emptyTitle}>Aucune alerte active</Text>
          <Text style={styles.emptySub}>Tous les traceurs GPS WhatsGPS fonctionnent normalement.</Text>
        </View>
      ) : (
        filteredList.map((a) => (
          <Pressable
            key={a.id}
            onPress={() => void markAlarmAsRead(a.id)}
            style={[
              styles.card,
              {
                borderColor:
                  a.type === 'critique' ? Colors.danger : a.type === 'avert' ? '#FFA000' : Colors.border,
                backgroundColor: a.unread ? '#FFFBF8' : Colors.white,
              },
            ]}
          >
            {a.unread ? <View style={styles.dot} /> : null}
            <View style={styles.cardHead}>
              <MaterialCommunityIcons name={a.icon} size={24} color={a.iconColor} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{a.title}</Text>
                <Text style={styles.cardSub}>{a.detail}</Text>
                <Text style={styles.time}>{a.time}</Text>
              </View>
            </View>
            {a.type === 'critique' ? (
              <Button
                label="Localiser le véhicule →"
                onPress={() => router.push({ pathname: '/owner/tracking/[id]', params: { id: String(a.carId) } })}
              />
            ) : null}
          </Pressable>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text, flex: 1 },
  newPill: { backgroundColor: Colors.dangerBg, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  newText: { color: Colors.danger, fontWeight: '800', fontSize: 12 },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  markAllText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
  cats: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  cat: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
  },
  catOn: { backgroundColor: Colors.primary },
  catText: { fontWeight: '700', color: Colors.textSecondary, fontSize: 13 },
  catTextOn: { color: Colors.white },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginTop: 8 },
  emptySub: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 24 },
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
  cardHead: { flexDirection: 'row', gap: 12, marginBottom: 8, alignItems: 'flex-start' },
  cardTitle: { fontWeight: '800', color: Colors.text, fontSize: 15 },
  cardSub: { color: Colors.textSecondary, marginTop: 2, fontSize: 13 },
  time: { color: Colors.textMuted, marginTop: 4, fontSize: 12 },
});
