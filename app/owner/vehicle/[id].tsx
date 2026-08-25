import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPreview } from '@/components/ui/map-preview';
import { Screen } from '@/components/ui/screen';
import { driversList, getVehicle, statusLabel, type DriverInfo } from '@/constants/data';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useLocation } from '@/context/location-context';

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const v = getVehicle(id);
  const geo = useLocation();

  const [assignedDriverId, setAssignedDriverId] = useState<string | undefined>(v.assignedDriverId || 'drv1');
  const [driverModalVisible, setDriverModalVisible] = useState(false);

  const assignedDriver = driversList.find((d) => d.id === assignedDriverId);

  function handleAssignDriver(driverItem: DriverInfo) {
    setAssignedDriverId(driverItem.id);
    setDriverModalVisible(false);
    Alert.alert('Chauffeur assigné', `${driverItem.fullName} est désormais assigné au véhicule ${v.name}.`);
  }

  const nextMaintenanceKm = v.nextMaintenanceKm ?? v.km + 2550;
  const kmRemaining = Math.max(0, nextMaintenanceKm - v.km);

  return (
    <Screen scroll>
      <View style={styles.top}>
        <BackButton />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{v.name}</Text>
          <Text style={styles.sub}>
            {v.plate} • {v.type} • {v.year}
          </Text>
        </View>
        <Pressable onPress={() => router.push('/owner/vehicles')} style={styles.iconBtn}>
          <Ionicons name="car-sport-outline" size={20} color={Colors.primary} />
        </Pressable>
      </View>

      <View style={styles.statusCard}>
        <Badge
          label={`• ${statusLabel[v.status]}`}
          tone={v.status === 'actif' ? 'success' : v.status === 'maintenance' ? 'warning' : 'neutral'}
        />
        <Text style={styles.updated}>Dernier signal {v.lastUpdate}</Text>
      </View>

      <View style={styles.stats}>
        <Stat icon="speedometer-outline" value={`${v.km.toLocaleString('fr-FR')} km`} label="Kilométrage" />
        <Stat icon="flash-outline" value={`${v.fuel}%`} label="Carburant" />
        <Stat icon="time-outline" value={v.lastTripDuration} label="Dernier trajet" />
      </View>

      {/* GPS Map card */}
      <View style={styles.mapWrap}>
        <View style={styles.mapHeader}>
          <Text style={styles.mapLabel}>Position GPS en temps réel</Text>
          <Text style={styles.mapAddress}>{geo.address || v.location}</Text>
        </View>
        <MapPreview
          height={150}
          latitude={geo.coords?.latitude}
          longitude={geo.coords?.longitude}
          permissionDenied={geo.permission === 'denied'}
          onRequestPermission={() => void geo.requestPermission()}
        />
        <Pressable
          style={styles.follow}
          onPress={() => router.push({ pathname: '/owner/tracking/[id]', params: { id: v.id } })}>
          <Ionicons name="navigate" size={14} color={Colors.white} />
          <Text style={styles.followText}>Suivre en direct</Text>
        </Pressable>
      </View>

      {/* Driver Assignment Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>CHAUFFEUR ASSIGNÉ</Text>
        <Pressable onPress={() => setDriverModalVisible(true)}>
          <Text style={styles.changeLink}>Changer</Text>
        </Pressable>
      </View>

      {assignedDriver ? (
        <View style={styles.driverCard}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarText}>{assignedDriver.avatarLetter}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.driverNameRow}>
              <Text style={styles.driverName}>{assignedDriver.fullName}</Text>
              <Badge label={`★ ${assignedDriver.rating}`} tone="info" />
            </View>
            <Text style={styles.driverPhone}>{assignedDriver.phone}</Text>
            <Text style={styles.driverExp}>Permis : {assignedDriver.licenseNumber}</Text>
          </View>
          <Pressable
            style={styles.callBtn}
            onPress={() => Alert.alert('Appel', `Composer le ${assignedDriver.phone}`)}>
            <Ionicons name="call" size={16} color={Colors.primary} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.unassignedCard}>
          <Text style={styles.unassignedText}>Aucun chauffeur n’est actuellement assigné à ce véhicule.</Text>
          <Button label="+ Assigner un chauffeur" variant="secondary" onPress={() => setDriverModalVisible(true)} />
        </View>
      )}

      {/* Tracker & Telematics Info */}
      <Text style={styles.sectionTitle}>TRACEUR GPS & TÉLÉMATIQUE</Text>
      <View style={styles.telematicsCard}>
        <View style={styles.teleRow}>
          <Text style={styles.teleLabel}>IMEI Balise :</Text>
          <Text style={styles.teleValue}>{v.imei || '864201049283719'}</Text>
        </View>
        <View style={styles.teleRow}>
          <Text style={styles.teleLabel}>Signal GPS / GSM :</Text>
          <Badge label="Connecté 4G" tone="success" />
        </View>
        <View style={styles.teleRow}>
          <Text style={styles.teleLabel}>Batterie Tracker :</Text>
          <Text style={styles.teleValue}>12.6 V (Normal)</Text>
        </View>
      </View>

      {/* Maintenance alert card */}
      <Text style={styles.sectionTitle}>ENTRETIEN & ALERTES KILOMÉTRIQUES</Text>
      <View style={styles.maintCard}>
        <View style={styles.maintTop}>
          <View style={styles.maintIconWrap}>
            <Ionicons name="construct-outline" size={20} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.maintTitle}>Prochaine vidange moteur</Text>
            <Text style={styles.maintSub}>
              Seuil : {nextMaintenanceKm.toLocaleString('fr-FR')} km (Reste {kmRemaining.toLocaleString('fr-FR')} km)
            </Text>
          </View>
        </View>
        <Button
          label="Gérer la maintenance"
          variant="secondary"
          onPress={() => router.push('/owner/maintenance')}
          style={{ marginTop: 10 }}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.actions}>
        <Action icon="time-outline" label="Historique" onPress={() => router.push('/owner/history')} />
        <Action icon="notifications-outline" label="Alertes" onPress={() => router.push('/owner/alerts')} />
        <Action icon="bar-chart-outline" label="Rapports" onPress={() => router.push('/owner/reports')} />
        <Action icon="document-text-outline" label="Documents" onPress={() => router.push('/owner/documents')} />
      </View>

      {/* Modal - Assign Driver */}
      <Modal visible={driverModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assigner un chauffeur</Text>
              <Pressable onPress={() => setDriverModalVisible(false)} style={styles.modalClose}>
                <Ionicons name="close" size={22} color={Colors.text} />
              </Pressable>
            </View>

            <Text style={styles.modalSub}>
              Sélectionnez le chauffeur responsable de la conduite pour le véhicule {v.name}.
            </Text>

            {driversList.map((d) => {
              const isSelected = assignedDriverId === d.id;
              return (
                <Pressable
                  key={d.id}
                  onPress={() => handleAssignDriver(d)}
                  style={[styles.driverSelectCard, isSelected && styles.driverSelectCardActive]}>
                  <View style={styles.driverAvatar}>
                    <Text style={styles.driverAvatarText}>{d.avatarLetter}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.driverName}>{d.fullName}</Text>
                    <Text style={styles.driverPhone}>{d.phone}</Text>
                    <Text style={styles.driverExp}>{d.experience}</Text>
                  </View>
                  {isSelected ? (
                    <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
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
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  updated: { color: Colors.textSecondary, fontSize: 12 },
  stats: { flexDirection: 'row', marginVertical: 16, backgroundColor: Colors.white, borderRadius: Radius.lg, padding: 12, borderWidth: 1, borderColor: Colors.border },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontWeight: '800', color: Colors.text, fontSize: 13 },
  statLabel: { fontSize: 11, color: Colors.textSecondary },
  mapWrap: { position: 'relative', marginBottom: 16, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  mapHeader: { padding: 10, backgroundColor: Colors.white },
  mapLabel: { fontWeight: '800', color: Colors.text, fontSize: 13 },
  mapAddress: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  follow: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    ...Shadow.soft,
  },
  followText: { color: Colors.white, fontWeight: '800', fontSize: 12 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 8 },
  sectionTitle: { fontWeight: '800', color: Colors.textSecondary, fontSize: 12, letterSpacing: 0.5, marginTop: 12, marginBottom: 8 },
  changeLink: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
    ...Shadow.soft,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatarText: { color: Colors.primary, fontWeight: '800', fontSize: 18 },
  driverNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  driverName: { fontWeight: '800', color: Colors.text, fontSize: 14 },
  driverPhone: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  driverExp: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unassignedCard: {
    padding: 14,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
    marginBottom: 8,
  },
  unassignedText: { color: Colors.textSecondary, fontSize: 13 },
  telematicsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    gap: 8,
    marginBottom: 8,
  },
  teleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  teleLabel: { fontSize: 12, color: Colors.textSecondary },
  teleValue: { fontSize: 12, fontWeight: '700', color: Colors.text },
  maintCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    marginBottom: 16,
    ...Shadow.soft,
  },
  maintTop: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  maintIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintTitle: { fontWeight: '800', color: Colors.text, fontSize: 13 },
  maintSub: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  action: {
    flex: 1,
    backgroundColor: Colors.primarySoft,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  actionLabel: { fontSize: 11, fontWeight: '700', color: Colors.text },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  modalClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  modalSub: { color: Colors.textSecondary, fontSize: 13, marginBottom: 16 },
  driverSelectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  driverSelectCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft },
});
