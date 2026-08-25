import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { maintenance as initialMaintenance, vehicles, type MaintenanceCategory, type MaintenanceItem } from '@/constants/data';
import { Colors, Radius, Shadow } from '@/constants/theme';

const categories: { label: string; value: MaintenanceCategory; defaultInterval: number; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Vidange moteur', value: 'vidange', defaultInterval: 5000, icon: 'water-outline' },
  { label: 'Freins & Plaquettes', value: 'freins', defaultInterval: 15000, icon: 'disc-outline' },
  { label: 'Pneus & Équilibrage', value: 'pneus', defaultInterval: 10000, icon: 'sync-outline' },
  { label: 'Filtres & Bougies', value: 'filtres', defaultInterval: 20000, icon: 'funnel-outline' },
  { label: 'Révision Générale', value: 'revision', defaultInterval: 30000, icon: 'build-outline' },
  { label: 'Visite Technique', value: 'visite_technique', defaultInterval: 50000, icon: 'document-text-outline' },
];

export default function MaintenanceScreen() {
  const [items, setItems] = useState<MaintenanceItem[]>(initialMaintenance);
  const [tab, setTab] = useState<'all' | 'upcoming' | 'done'>('upcoming');
  const [modalVisible, setModalVisible] = useState(false);

  // Form states for new maintenance
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || 'hilux');
  const [selectedCat, setSelectedCat] = useState<MaintenanceCategory>('vidange');
  const [customTitle, setCustomTitle] = useState('');
  const [intervalKm, setIntervalKm] = useState('5000');
  const [cost, setCost] = useState('45 000 FCFA');
  const [deadline, setDeadline] = useState('Dans 30 jours');

  const upcoming = items.filter((m) => m.status !== 'fait');
  const history = items.filter((m) => m.status === 'fait');

  const displayedList = tab === 'upcoming' ? upcoming : tab === 'done' ? history : items;

  function markAsDone(item: MaintenanceItem) {
    Alert.alert(
      'Validation Entretien',
      `Confirmer la réalisation de l'entretien "${item.title}" pour ${item.vehicle} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Valider (Effectué)',
          onPress: () => {
            setItems((prev) =>
              prev.map((m) =>
                m.id === item.id
                  ? {
                      ...m,
                      status: 'fait',
                      completedAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
                    }
                  : m
              )
            );
            Alert.alert('Succès', 'Entretien marqué comme effectué et archivé dans l’historique.');
          },
        },
      ]
    );
  }

  function handleCreateMaintenance() {
    const veh = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
    const catObj = categories.find((c) => c.value === selectedCat);
    const parsedInterval = parseInt(intervalKm.replace(/\D/g, ''), 10) || 5000;
    const triggerKm = (veh?.km || 85000) + parsedInterval;

    const newItem: MaintenanceItem = {
      id: `m-${Date.now()}`,
      title: customTitle.trim() || catObj?.label || 'Entretien programmé',
      vehicle: veh.name,
      vehicleId: veh.id,
      status: 'prevoir',
      deadline: deadline || `à ${triggerKm.toLocaleString('fr-FR')} km`,
      cost: cost || '35 000 FCFA',
      category: selectedCat,
      triggerKm,
      intervalKm: parsedInterval,
      currentKm: veh.km,
    };

    setItems((prev) => [newItem, ...prev]);
    setModalVisible(false);
    setCustomTitle('');
    Alert.alert('Succès', `L'alerte d'entretien a été configurée pour ${veh.name} (Déclenchement à ${triggerKm.toLocaleString('fr-FR')} km).`);
  }

  return (
    <Screen scroll>
      <View style={styles.top}>
        <BackButton />
        <Text style={styles.title}>Gestion Maintenance</Text>
        <Pressable onPress={() => setModalVisible(true)} style={styles.plus}>
          <Ionicons name="add" size={22} color={Colors.primary} />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <Pressable onPress={() => setTab('upcoming')} style={[styles.tabBtn, tab === 'upcoming' && styles.tabBtnActive]}>
          <Text style={[styles.tabText, tab === 'upcoming' && styles.tabTextActive]}>
            À Venir ({upcoming.length})
          </Text>
        </Pressable>
        <Pressable onPress={() => setTab('done')} style={[styles.tabBtn, tab === 'done' && styles.tabBtnActive]}>
          <Text style={[styles.tabText, tab === 'done' && styles.tabTextActive]}>
            Historique ({history.length})
          </Text>
        </Pressable>
        <Pressable onPress={() => setTab('all')} style={[styles.tabBtn, tab === 'all' && styles.tabBtnActive]}>
          <Text style={[styles.tabText, tab === 'all' && styles.tabTextActive]}>Tous ({items.length})</Text>
        </Pressable>
      </View>

      {/* Quick Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryNumber}>{upcoming.filter((u) => u.status === 'urgent').length}</Text>
            <Text style={styles.summaryLabel}>Urgents</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCol}>
            <Text style={styles.summaryNumber}>{upcoming.length}</Text>
            <Text style={styles.summaryLabel}>À Prévoir</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryCol}>
            <Text style={styles.summaryNumber}>{history.length}</Text>
            <Text style={styles.summaryLabel}>Effectués</Text>
          </View>
        </View>
      </View>

      {/* List */}
      {displayedList.map((m) => {
        const isDone = m.status === 'fait';
        const isUrgent = m.status === 'urgent';
        const veh = vehicles.find((v) => v.id === m.vehicleId) || vehicles[0];
        const currentKm = m.currentKm ?? veh?.km ?? 80000;
        const triggerKm = m.triggerKm ?? currentKm + 2000;
        const remainingKm = Math.max(0, triggerKm - currentKm);
        const progressPercent = m.intervalKm
          ? Math.min(100, Math.max(0, Math.round(((m.intervalKm - remainingKm) / m.intervalKm) * 100)))
          : 75;

        return (
          <View key={m.id} style={[styles.card, isUrgent && styles.cardUrgent]}>
            <View style={styles.cardTop}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.catIconWrap, isUrgent ? styles.catIconUrgent : isDone ? styles.catIconDone : styles.catIconNormal]}>
                  <Ionicons
                    name={
                      m.category === 'vidange'
                        ? 'water'
                        : m.category === 'freins'
                        ? 'disc'
                        : m.category === 'pneus'
                        ? 'sync'
                        : m.category === 'filtres'
                        ? 'funnel'
                        : 'build'
                    }
                    size={18}
                    color={isUrgent ? Colors.danger : isDone ? Colors.success : Colors.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{m.title}</Text>
                  <Text style={styles.vehicle}>{m.vehicle}</Text>
                </View>
              </View>
              <Badge
                label={isDone ? 'Effectué' : isUrgent ? 'Urgent' : 'À prévoir'}
                tone={isDone ? 'success' : isUrgent ? 'danger' : 'info'}
              />
            </View>

            {/* Mileage Threshold Bar */}
            {!isDone && m.triggerKm ? (
              <View style={styles.progressSection}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressText}>
                    Seuil : <Text style={styles.bold}>{triggerKm.toLocaleString('fr-FR')} km</Text>
                  </Text>
                  <Text style={[styles.progressText, isUrgent ? styles.urgentText : styles.normalText]}>
                    Reste : {remainingKm.toLocaleString('fr-FR')} km
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${progressPercent}%` },
                      isUrgent ? { backgroundColor: Colors.danger } : { backgroundColor: Colors.primary },
                    ]}
                  />
                </View>
              </View>
            ) : null}

            <View style={styles.cardBot}>
              <View>
                <Text style={styles.metaLabel}>Échéance / Réalisé</Text>
                <Text style={styles.metaValue}>{m.completedAt ? `Fait le ${m.completedAt}` : m.deadline}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.metaLabel}>Coût estimé</Text>
                <Text style={styles.cost}>{m.cost}</Text>
              </View>
            </View>

            {!isDone && (
              <View style={styles.cardActions}>
                <Pressable style={styles.actionBtnDone} onPress={() => markAsDone(m)}>
                  <Ionicons name="checkmark-circle-outline" size={16} color={Colors.white} />
                  <Text style={styles.actionBtnDoneText}>Marquer comme fait</Text>
                </Pressable>
              </View>
            )}
          </View>
        );
      })}

      <View style={{ height: 16 }} />
      <Button
        label="+ Programmer un entretien"
        icon={<Ionicons name="construct-outline" size={18} color={Colors.white} />}
        onPress={() => setModalVisible(true)}
      />

      {/* Modal - Programmer Maintenance */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Programmer un entretien</Text>
              <Pressable onPress={() => setModalVisible(false)} style={styles.modalClose}>
                <Ionicons name="close" size={22} color={Colors.text} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 480 }}>
              {/* Choix du véhicule */}
              <Text style={styles.fieldLabel}>VÉHICULE CONCERNÉ</Text>
              <View style={styles.vehiclePicker}>
                {vehicles.map((v) => (
                  <Pressable
                    key={v.id}
                    onPress={() => setSelectedVehicleId(v.id)}
                    style={[styles.vehChoice, selectedVehicleId === v.id && styles.vehChoiceActive]}>
                    <Text style={[styles.vehChoiceName, selectedVehicleId === v.id && styles.vehChoiceTextActive]}>
                      {v.name}
                    </Text>
                    <Text style={styles.vehChoiceKm}>{v.km.toLocaleString('fr-FR')} km</Text>
                  </Pressable>
                ))}
              </View>

              {/* Type d'opération */}
              <Text style={styles.fieldLabel}>TYPE D&apos;OPÉRATION</Text>
              <View style={styles.categoriesGrid}>
                {categories.map((c) => (
                  <Pressable
                    key={c.value}
                    onPress={() => {
                      setSelectedCat(c.value);
                      setIntervalKm(String(c.defaultInterval));
                    }}
                    style={[styles.catBtn, selectedCat === c.value && styles.catBtnActive]}>
                    <Ionicons name={c.icon} size={16} color={selectedCat === c.value ? Colors.primary : Colors.textSecondary} />
                    <Text style={[styles.catBtnText, selectedCat === c.value && styles.catBtnTextActive]}>{c.label}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Intitulé spécifique */}
              <Text style={styles.fieldLabel}>INTITULÉ PERSONNALISÉ (OPTIONNEL)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex. Vidange 10 000 km + remplacement filtre huile"
                value={customTitle}
                onChangeText={setCustomTitle}
                placeholderTextColor={Colors.textMuted}
              />

              {/* Seuil kilométrique */}
              <Text style={styles.fieldLabel}>INTERVALLE KILOMÉTRIQUE (KM)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex. 5000"
                keyboardType="number-pad"
                value={intervalKm}
                onChangeText={setIntervalKm}
                placeholderTextColor={Colors.textMuted}
              />

              {/* Coût estimé */}
              <Text style={styles.fieldLabel}>COÛT ESTIMATIF</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex. 45 000 FCFA"
                value={cost}
                onChangeText={setCost}
                placeholderTextColor={Colors.textMuted}
              />

              {/* Échéance */}
              <Text style={styles.fieldLabel}>ÉCHÉANCE SOUHAITÉE</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex. Dans 1 mois ou 5 000 km"
                value={deadline}
                onChangeText={setDeadline}
                placeholderTextColor={Colors.textMuted}
              />

              <View style={{ height: 16 }} />
              <Button label="Enregistrer l'alerte d'entretien" onPress={handleCreateMaintenance} />
              <View style={{ height: 16 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  plus: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  tabBtnActive: {
    backgroundColor: Colors.white,
    ...Shadow.soft,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    ...Shadow.soft,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  summaryCol: { alignItems: 'center' },
  summaryNumber: { fontSize: 20, fontWeight: '800', color: Colors.text },
  summaryLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  summaryDivider: { width: 1, height: 28, backgroundColor: Colors.border },
  card: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 12,
    ...Shadow.soft,
  },
  cardUrgent: {
    borderColor: Colors.danger,
    borderLeftWidth: 4,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardHeaderLeft: { flexDirection: 'row', gap: 10, flex: 1, marginRight: 8 },
  catIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catIconNormal: { backgroundColor: Colors.primarySoft },
  catIconUrgent: { backgroundColor: Colors.dangerBg },
  catIconDone: { backgroundColor: Colors.successBg },
  cardTitle: { fontWeight: '800', color: Colors.text, fontSize: 15 },
  vehicle: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  progressSection: { marginTop: 12, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 10 },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressText: { fontSize: 12, color: Colors.textSecondary },
  bold: { fontWeight: '700', color: Colors.text },
  urgentText: { color: Colors.danger, fontWeight: '800' },
  normalText: { color: Colors.primary, fontWeight: '700' },
  progressBarBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  cardBot: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  metaLabel: { fontSize: 11, color: Colors.textSecondary },
  metaValue: { fontSize: 12, fontWeight: '600', color: Colors.text, marginTop: 2 },
  cost: { fontWeight: '800', color: Colors.primary, fontSize: 14, marginTop: 2 },
  cardActions: { marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end' },
  actionBtnDone: {
    backgroundColor: Colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  actionBtnDoneText: { color: Colors.white, fontWeight: '700', fontSize: 12 },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  modalClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.5, marginTop: 12, marginBottom: 6 },
  vehiclePicker: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  vehChoice: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 8,
    alignItems: 'center',
  },
  vehChoiceActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft },
  vehChoiceName: { fontSize: 12, fontWeight: '700', color: Colors.text },
  vehChoiceTextActive: { color: Colors.primary },
  vehChoiceKm: { fontSize: 10, color: Colors.textSecondary, marginTop: 2 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 6 },
  catBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft },
  catBtnText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  catBtnTextActive: { color: Colors.primary, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
});
