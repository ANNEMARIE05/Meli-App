import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { corporateLogbook, type CorporateLogbookEntry } from '@/constants/data';
import { Colors, Radius, Shadow } from '@/constants/theme';

export default function CorporateLogbookScreen() {
  const router = useRouter();
  const [logbook] = useState<CorporateLogbookEntry[]>(corporateLogbook);
  const [filter, setFilter] = useState<'all' | 'today' | 'incident'>('all');
  const [search, setSearch] = useState('');

  const filteredLogs = logbook.filter((item) => {
    if (filter === 'today' && item.date !== "Aujourd'hui") return false;
    if (filter === 'incident' && item.status !== 'incident') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.driverName.toLowerCase().includes(q) ||
        item.vehicleName.toLowerCase().includes(q) ||
        item.vehiclePlate.toLowerCase().includes(q) ||
        item.departureLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function handleExport() {
    Alert.alert(
      'Export Carnet de Bord',
      'Le registre numérique des trajets et prises de véhicules a été généré et exporté au format PDF & Excel pour le service flotte.'
    );
  }

  return (
    <Screen scroll>
      <View style={styles.top}>
        <BackButton />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Carnet de Bord Flotte</Text>
          <Text style={styles.sub}>Registre numérique des prises de service</Text>
        </View>
        <Pressable onPress={handleExport} style={styles.exportBtn}>
          <Ionicons name="download-outline" size={20} color={Colors.primary} />
        </Pressable>
      </View>

      {/* Info replacing paper notebook */}
      <View style={styles.infoBanner}>
        <Ionicons name="book-outline" size={20} color={Colors.primary} />
        <Text style={styles.infoText}>
          Ce carnet digital remplace l&apos;ancien cahier de bord papier. Chaque scan QR code enregistre automatiquement le kilométrage et l&apos;horodatage.
        </Text>
      </View>

      {/* Search & Filters */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
        <TextInput
          placeholder="Rechercher par chauffeur, véhicule, plaque…"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={Colors.textMuted}
          style={styles.searchInput}
        />
        {search ? (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.filterTabs}>
        <Pressable
          onPress={() => setFilter('all')}
          style={[styles.tab, filter === 'all' && styles.tabActive]}>
          <Text style={[styles.tabText, filter === 'all' && styles.tabTextActive]}>
            Tous ({logbook.length})
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFilter('today')}
          style={[styles.tab, filter === 'today' && styles.tabActive]}>
          <Text style={[styles.tabText, filter === 'today' && styles.tabTextActive]}>
            Aujourd’hui
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFilter('incident')}
          style={[styles.tab, filter === 'incident' && styles.tabActive]}>
          <Text style={[styles.tabText, filter === 'incident' && styles.tabTextActive]}>
            Incidents
          </Text>
        </Pressable>
      </View>

      {/* Log entries */}
      {filteredLogs.map((entry) => {
        const isRunning = entry.status === 'en_cours';
        const hasIncident = entry.status === 'incident';

        return (
          <View key={entry.id} style={[styles.card, hasIncident && styles.cardIncident]}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.vehicleName}>{entry.vehicleName}</Text>
                <Text style={styles.vehiclePlate}>{entry.vehiclePlate}</Text>
              </View>
              <Badge
                label={isRunning ? '• En cours' : hasIncident ? 'Incident' : 'Terminé'}
                tone={isRunning ? 'info' : hasIncident ? 'danger' : 'success'}
              />
            </View>

            {/* Driver info */}
            <View style={styles.driverRow}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverAvatarText}>{entry.driverName.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.driverName}>{entry.driverName}</Text>
                <Text style={styles.driverPhone}>{entry.driverPhone}</Text>
              </View>
              <Text style={styles.entryDate}>{entry.date}</Text>
            </View>

            {/* Route & Times */}
            <View style={styles.routeBox}>
              <View style={styles.routePoint}>
                <View style={styles.dotGreen} />
                <Text style={styles.routeLoc}>
                  Départ : <Text style={styles.bold}>{entry.departureLocation}</Text> ({entry.departureTime})
                </Text>
              </View>
              <View style={styles.routePoint}>
                <View style={[styles.dotGreen, { backgroundColor: isRunning ? Colors.textMuted : Colors.primary }]} />
                <Text style={styles.routeLoc}>
                  Arrivée :{' '}
                  <Text style={styles.bold}>
                    {isRunning ? 'En route…' : `${entry.arrivalLocation || 'Dépôt'} (${entry.arrivalTime || '--'})`}
                  </Text>
                </Text>
              </View>
            </View>

            {/* Mileage readings (Compteur départ vs arrivée) */}
            <View style={styles.kmGrid}>
              <View style={styles.kmCol}>
                <Text style={styles.kmLabel}>Km Départ</Text>
                <Text style={styles.kmVal}>{entry.startKm.toLocaleString('fr-FR')} km</Text>
              </View>
              <View style={styles.kmCol}>
                <Text style={styles.kmLabel}>Km Retour</Text>
                <Text style={styles.kmVal}>
                  {entry.endKm ? `${entry.endKm.toLocaleString('fr-FR')} km` : 'En cours'}
                </Text>
              </View>
              <View style={styles.kmCol}>
                <Text style={styles.kmLabel}>Distance Totale</Text>
                <Text style={[styles.kmVal, { color: Colors.primary }]}>
                  {entry.distanceKm ? `+${entry.distanceKm} km` : '--'}
                </Text>
              </View>
            </View>

            {/* Incident note if any */}
            {hasIncident && entry.incidentDetails ? (
              <View style={styles.incidentBox}>
                <Ionicons name="warning" size={16} color={Colors.danger} />
                <Text style={styles.incidentNote}>{entry.incidentDetails}</Text>
              </View>
            ) : null}
          </View>
        );
      })}

      <View style={{ height: 16 }} />
      <Button
        label="Scanner un nouveau véhicule"
        icon={<Ionicons name="qr-code-outline" size={18} color={Colors.white} />}
        onPress={() => router.push('/driver/scan')}
      />
      <View style={{ height: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  sub: { color: Colors.textSecondary, fontSize: 12 },
  exportBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBanner: {
    backgroundColor: Colors.primarySoft,
    borderRadius: Radius.lg,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  infoText: { flex: 1, fontSize: 12, color: Colors.primary, fontWeight: '600', lineHeight: 17 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 13, color: Colors.text, padding: 0 },
  filterTabs: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white, fontWeight: '800' },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 12,
    ...Shadow.soft,
  },
  cardIncident: { borderColor: Colors.danger, borderLeftWidth: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  vehicleName: { fontSize: 15, fontWeight: '800', color: Colors.text },
  vehiclePlate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  driverAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatarText: { color: Colors.primary, fontWeight: '800', fontSize: 14 },
  driverName: { fontWeight: '700', fontSize: 13, color: Colors.text },
  driverPhone: { fontSize: 11, color: Colors.textSecondary },
  entryDate: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  routeBox: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 10,
    gap: 6,
    marginBottom: 10,
  },
  routePoint: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  routeLoc: { fontSize: 12, color: Colors.textSecondary },
  bold: { fontWeight: '700', color: Colors.text },
  kmGrid: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 10, justifyContent: 'space-around' },
  kmCol: { alignItems: 'center' },
  kmLabel: { fontSize: 10, color: Colors.textSecondary, textTransform: 'uppercase', fontWeight: '700' },
  kmVal: { fontSize: 13, fontWeight: '800', color: Colors.text, marginTop: 2 },
  incidentBox: {
    marginTop: 10,
    backgroundColor: Colors.dangerBg,
    borderRadius: Radius.md,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  incidentNote: { flex: 1, fontSize: 12, color: Colors.danger, fontWeight: '600' },
});
