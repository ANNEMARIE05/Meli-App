import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { driver } from '@/constants/data';
import { Colors, Radius } from '@/constants/theme';
import { useLocation } from '@/context/location-context';
import { useTrip } from '@/context/trip-context';

const kinds = [
  { label: 'Accident / Sinistre', icon: 'warning-outline', tone: 'danger' as const },
  { label: 'Panne mécanique', icon: 'construct-outline', tone: 'warning' as const },
  { label: 'Crevaison / Pneu', icon: 'sync-outline', tone: 'warning' as const },
  { label: 'Contrôle Routier', icon: 'shield-checkmark-outline', tone: 'info' as const },
  { label: 'Retard / Blocage', icon: 'time-outline', tone: 'info' as const },
  { label: 'Autre anomalie', icon: 'help-circle-outline', tone: 'neutral' as const },
];

const severities = [
  { label: 'Faible (Information)', value: 'faible' },
  { label: 'Moyen (Assistance requise)', value: 'moyen' },
  { label: 'Critique / Urgent (Arrêt immédiat)', value: 'critique' },
];

export default function IncidentScreen() {
  const router = useRouter();
  const geo = useLocation();
  const { identifiedVehicle } = useTrip();

  const [selectedKind, setSelectedKind] = useState(kinds[0].label);
  const [severity, setSeverity] = useState('moyen');
  const [note, setNote] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit() {
    if (!note.trim()) {
      Alert.alert('Précision requise', 'Veuillez renseigner une brève description de l’incident pour informer l’équipe flotte.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Incident Transmis',
        `Votre déclaration (${selectedKind}) a été transmise en temps réel au gestionnaire de flotte avec votre position GPS (${geo.address || 'Abidjan'}).`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 800);
  }

  return (
    <Screen scroll>
      <View style={styles.top}>
        <BackButton />
        <Text style={styles.title}>Signaler un incident</Text>
        <View style={{ width: 38 }} />
      </View>

      <Text style={styles.sub}>
        Déclarez immédiatement toute anomalie, panne ou sinistre survenue pendant votre mission.
      </Text>

      {/* Vehicle & Location summary */}
      <View style={styles.infoBanner}>
        <View style={styles.infoRow}>
          <Ionicons name="car-sport-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>
            {identifiedVehicle.name} • {identifiedVehicle.plate}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>Position : {geo.address || 'Position GPS active'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>Chauffeur : {driver.fullName}</Text>
        </View>
      </View>

      {/* Incident Types */}
      <Text style={styles.sectionTitle}>TYPE D&apos;INCIDENT</Text>
      <View style={styles.chips}>
        {kinds.map((k) => {
          const isSelected = selectedKind === k.label;
          return (
            <Pressable
              key={k.label}
              onPress={() => setSelectedKind(k.label)}
              style={[styles.chip, isSelected && styles.chipOn]}>
              <Ionicons
                name={k.icon as any}
                size={16}
                color={isSelected ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.chipText, isSelected && styles.chipTextOn]}>{k.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Severity */}
      <Text style={styles.sectionTitle}>NIVEAU DE GRAVITÉ</Text>
      <View style={styles.severityList}>
        {severities.map((s) => (
          <Pressable
            key={s.value}
            onPress={() => setSeverity(s.value)}
            style={[styles.severityRow, severity === s.value && styles.severityRowActive]}>
            <Ionicons
              name={severity === s.value ? 'radio-button-on' : 'radio-button-off'}
              size={18}
              color={severity === s.value ? Colors.primary : Colors.textSecondary}
            />
            <Text style={[styles.severityLabel, severity === s.value && styles.severityLabelActive]}>
              {s.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Description */}
      <Text style={styles.sectionTitle}>DESCRIPTION DESCRIPTIVE</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Expliquez ce qui s'est passé, les dégâts apparents, ou l'assistance nécessaire…"
        placeholderTextColor={Colors.textMuted}
        multiline
        numberOfLines={4}
        style={styles.area}
      />

      {/* Photo attachment simulation */}
      <Text style={styles.sectionTitle}>PHOTO / PREUVE (OPTIONNEL)</Text>
      <Pressable
        onPress={() => setHasPhoto(!hasPhoto)}
        style={[styles.photoBox, hasPhoto && styles.photoBoxActive]}>
        <Ionicons
          name={hasPhoto ? 'checkmark-circle' : 'camera-outline'}
          size={24}
          color={hasPhoto ? Colors.success : Colors.primary}
        />
        <Text style={[styles.photoBoxText, hasPhoto && styles.photoBoxTextActive]}>
          {hasPhoto ? 'Photo jointe ✓ (1 image)' : '+ Prendre une photo / Joindre une image'}
        </Text>
      </Pressable>

      <View style={{ height: 16 }} />
      <Button
        label={isSubmitting ? 'Envoi en cours…' : 'Transmettre le signalement'}
        icon={<Ionicons name="send" size={16} color={Colors.white} />}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
      <View style={{ height: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  sub: { color: Colors.textSecondary, lineHeight: 20, marginBottom: 14 },
  infoBanner: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
    marginBottom: 16,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 12, color: Colors.text, fontWeight: '600' },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: 8, marginTop: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipOn: { backgroundColor: Colors.primarySoft, borderColor: Colors.primary },
  chipText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 13 },
  chipTextOn: { color: Colors.primary, fontWeight: '700' },
  severityList: { gap: 8, marginBottom: 12 },
  severityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  severityRowActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft },
  severityLabel: { fontSize: 13, color: Colors.textSecondary },
  severityLabelActive: { fontWeight: '700', color: Colors.text },
  area: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.white,
    marginBottom: 12,
  },
  photoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
    paddingVertical: 14,
    borderRadius: Radius.md,
    marginBottom: 16,
  },
  photoBoxActive: {
    borderColor: Colors.success,
    backgroundColor: Colors.successBg,
  },
  photoBoxText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
  photoBoxTextActive: { color: Colors.success },
});
