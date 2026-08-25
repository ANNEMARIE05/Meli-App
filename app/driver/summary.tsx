import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPreview } from '@/components/ui/map-preview';
import { Screen } from '@/components/ui/screen';
import { formatDuration } from '@/constants/geo';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useLocation } from '@/context/location-context';
import { tripTimeLabel, useTrip } from '@/context/trip-context';

export default function TripSummaryScreen() {
  const router = useRouter();
  const geo = useLocation();
  const { lastTrip, identifiedVehicle } = useTrip();
  const lastPoint = lastTrip?.path[lastTrip.path.length - 1] ?? geo.coords;

  const startKm = identifiedVehicle.km || 87431;
  const calculatedDistance = lastTrip ? Math.max(1, Math.round(lastTrip.distanceKm)) : 19;
  const [endKmInput, setEndKmInput] = useState(String(startKm + calculatedDistance));
  const [cleanliness, setCleanliness] = useState('Propre');
  const [isSaved, setIsSaved] = useState(false);

  const parsedEndKm = parseInt(endKmInput.replace(/\D/g, ''), 10) || startKm + calculatedDistance;
  const effectiveDistance = Math.max(0, parsedEndKm - startKm);

  function handleSaveToLogbook() {
    setIsSaved(true);
    Alert.alert(
      'Carnet de bord mis à jour ✓',
      `La mission a été clôturée avec succès : ${effectiveDistance} km parcourus enregistrés au registre flotte d’entreprise.`,
      [
        {
          text: 'Voir le carnet de bord',
          onPress: () => router.replace('/driver/logbook' as Href),
        },
        {
          text: 'Accueil Chauffeur',
          onPress: () => router.replace('/driver' as Href),
        },
      ]
    );
  }

  return (
    <Screen scroll>
      <View style={styles.center}>
        <View style={styles.check}>
          <Ionicons name="checkmark" size={32} color={Colors.white} />
        </View>
        <Text style={styles.title}>Mission Clôturée</Text>
        <Badge label="• Enregistrement Carnet Digital" tone="success" />
      </View>

      <MapPreview
        height={130}
        latitude={lastPoint?.latitude}
        longitude={lastPoint?.longitude}
        path={lastTrip?.path}
        label={`${lastTrip?.fromAddress ?? 'Départ'} → ${lastTrip?.toAddress ?? geo.address}`}
      />

      {/* Vehicle identity */}
      <Text style={styles.section}>VÉHICULE & CHAUFFEUR</Text>
      <View style={styles.card}>
        <Row label="Véhicule" value={identifiedVehicle.name} />
        <Row label="Immatriculation" value={identifiedVehicle.plate} />
        <Row label="Chauffeur" value="Karim Diallo" last />
      </View>

      {/* Relevé Compteur (Remplacement du carnet papier) */}
      <Text style={styles.section}>RELEVÉ COMPTEUR KILOMÉTRIQUE</Text>
      <View style={styles.card}>
        <Row label="Km au départ (Début mission)" value={`${startKm.toLocaleString('fr-FR')} km`} />
        <View style={styles.kmInputRow}>
          <Text style={styles.label}>Km au retour (Compteur)</Text>
          <TextInput
            style={styles.kmInput}
            value={endKmInput}
            onChangeText={setEndKmInput}
            keyboardType="number-pad"
            placeholder="Ex. 87450"
          />
        </View>
        <Row
          label="Distance totale calculée"
          value={<Text style={styles.distAccent}>{effectiveDistance} km</Text>}
          last
        />
      </View>

      {/* Trip stats */}
      <Text style={styles.section}>STATISTIQUES DE COURSE</Text>
      <View style={styles.card}>
        <Row label="Heure de départ" value={tripTimeLabel(lastTrip?.startedAt ?? null) || '13:47'} />
        <Row label="Heure d’arrivée" value={tripTimeLabel(lastTrip?.endedAt ?? null) || '14:21'} />
        <Row label="Durée totale" value={lastTrip ? formatDuration(lastTrip.durationSec) : '34 min'} last />
      </View>

      {/* Vehicle status check upon return */}
      <Text style={styles.section}>ÉTAT DU VÉHICULE AU RETOUR</Text>
      <View style={styles.cleanGrid}>
        {['Propre', 'Correct', 'Poussiéreux / À laver'].map((status) => (
          <Pressable
            key={status}
            onPress={() => setCleanliness(status)}
            style={[styles.cleanBtn, cleanliness === status && styles.cleanBtnActive]}>
            <Text style={[styles.cleanBtnText, cleanliness === status && styles.cleanBtnTextActive]}>
              {status}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ height: 16 }} />
      <Button
        label={isSaved ? 'Enregistré dans le carnet ✓' : 'Valider & Enregistrer au Carnet de Bord'}
        icon={<Ionicons name="save-outline" size={18} color={Colors.white} />}
        onPress={handleSaveToLogbook}
      />
      <View style={{ height: 10 }} />
      <Button
        variant="secondary"
        label="Consulter le Carnet de Bord Flotte"
        icon={<Ionicons name="book-outline" size={18} color={Colors.primary} />}
        onPress={() => router.push('/driver/logbook')}
      />
      <View style={{ height: 10 }} />
      <Button
        variant="outline"
        label="Signaler un incident lors du trajet"
        icon={<Ionicons name="warning-outline" size={18} color={Colors.danger} />}
        onPress={() => router.push('/driver/incident')}
      />
      <View style={{ height: 24 }} />
    </Screen>
  );
}

function Row({ label, value, last }: { label: string; value: React.ReactNode; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.border]}>
      <Text style={styles.label}>{label}</Text>
      {typeof value === 'string' ? <Text style={styles.value}>{value}</Text> : value}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', marginBottom: 14, gap: 8 },
  check: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text },
  section: { marginTop: 14, marginBottom: 6, color: Colors.textSecondary, fontWeight: '800', letterSpacing: 0.5, fontSize: 11 },
  card: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    backgroundColor: Colors.white,
    ...Shadow.soft,
  },
  row: { minHeight: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  border: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  label: { color: Colors.textSecondary, fontSize: 13 },
  value: { fontWeight: '700', color: Colors.text, fontSize: 13 },
  distAccent: { fontWeight: '800', color: Colors.primary, fontSize: 14 },
  kmInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  kmInput: {
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
    borderRadius: Radius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontWeight: '800',
    color: Colors.primary,
    fontSize: 14,
    minWidth: 100,
    textAlign: 'right',
  },
  cleanGrid: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  cleanBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  cleanBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft },
  cleanBtnText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  cleanBtnTextActive: { color: Colors.primary, fontWeight: '800' },
});
