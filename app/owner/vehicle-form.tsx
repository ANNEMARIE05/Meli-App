import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { driversList, vehicles, type Vehicle } from '@/constants/data';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { useLocation } from '@/context/location-context';

export default function VehicleFormScreen() {
  const router = useRouter();
  const geo = useLocation();
  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [type, setType] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [km, setKm] = useState('0');
  const [imei, setImei] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [maintInterval, setMaintInterval] = useState('5000');
  const [error, setError] = useState('');

  function submit() {
    if (!name.trim() || !plate.trim() || !type.trim()) {
      setError('Veuillez renseigner le modèle, l’immatriculation et le type.');
      return;
    }

    const assignedDrv = driversList.find((d) => d.id === selectedDriverId);
    const parsedKm = parseInt(km.replace(/\D/g, ''), 10) || 0;
    const parsedMaint = parseInt(maintInterval.replace(/\D/g, ''), 10) || 5000;

    const newVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      name: name.trim(),
      plate: plate.trim().toUpperCase(),
      type: type.trim(),
      year: parseInt(year, 10) || new Date().getFullYear(),
      km: parsedKm,
      fuel: 100,
      status: 'actif',
      location: geo.permission === 'granted' && geo.coords ? geo.address : 'Position GPS à confirmer',
      lastUpdate: 'À l’instant',
      lastTripDuration: '--',
      lastTripDistance: '--',
      imei: imei.trim() || `864201049${Math.floor(Math.random() * 900000 + 100000)}`,
      assignedDriverId: assignedDrv?.id,
      assignedDriverName: assignedDrv?.fullName,
      assignedDriverPhone: assignedDrv?.phone,
      nextMaintenanceKm: parsedKm + parsedMaint,
    };

    vehicles.unshift(newVehicle);
    Alert.alert(
      'Véhicule Enregistré',
      `Le véhicule ${newVehicle.name} (${newVehicle.plate}) avec balise GPS IMEI ${newVehicle.imei} a été ajouté à votre flotte.`
    );
    router.replace('/owner/vehicles');
  }

  return (
    <Screen
      scroll
      bottom={
        <View>
          {error ? <Text style={[styles.error, { marginBottom: 10 }]}>{error}</Text> : null}
          <Button label="Enregistrer le véhicule et activer le suivi" onPress={submit} />
        </View>
      }>
      <View style={styles.top}>
        <BackButton />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Nouveau véhicule</Text>
          <Text style={styles.sub}>Ajout d’un véhicule et liaison balise GPS</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionHeader}>INFORMATIONS VÉHICULE</Text>
        <Input label="Marque & Modèle" placeholder="Ex. Toyota Hilux, Peugeot Partner…" value={name} onChangeText={setName} />
        <Input label="Plaque d'immatriculation" placeholder="Ex. 1234 AB 01" autoCapitalize="characters" value={plate} onChangeText={setPlate} />
        
        <View style={styles.rowTwo}>
          <View style={{ flex: 1 }}>
            <Input label="Type de véhicule" placeholder="Ex. 4x4, Berline, Fourgon" value={type} onChangeText={setType} />
          </View>
          <View style={{ width: 100 }}>
            <Input label="Année" placeholder="2024" keyboardType="number-pad" value={year} onChangeText={setYear} />
          </View>
        </View>

        <Input label="Kilométrage initial au compteur (km)" placeholder="Ex. 85000" keyboardType="number-pad" value={km} onChangeText={setKm} />

        <Text style={styles.sectionHeader}>TÉLÉMATIQUE & BALISE GPS (WHATGPS)</Text>
        <Input
          label="Numéro IMEI du Traceur GPS"
          placeholder="Ex. 864201049283719 (15 chiffres)"
          keyboardType="number-pad"
          value={imei}
          onChangeText={setImei}
        />
        <Text style={styles.helperText}>
          La balise GPS permet de suivre la position en temps réel et de recevoir les alertes moteur / vitesse.
        </Text>

        <Text style={styles.sectionHeader}>MAINTENANCE & VIDANGE</Text>
        <Input
          label="Intervalle de vidange recommandé (km)"
          placeholder="5000"
          keyboardType="number-pad"
          value={maintInterval}
          onChangeText={setMaintInterval}
        />

        <Text style={styles.sectionHeader}>ASSIGNER UN CHAUFFEUR (OPTIONNEL)</Text>
        <View style={styles.driverList}>
          {driversList.map((d) => {
            const isSelected = selectedDriverId === d.id;
            return (
              <Pressable
                key={d.id}
                onPress={() => setSelectedDriverId(isSelected ? '' : d.id)}
                style={[styles.driverCard, isSelected && styles.driverCardActive]}>
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverAvatarText}>{d.avatarLetter}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{d.fullName}</Text>
                  <Text style={styles.driverMeta}>{d.phone} • {d.experience}</Text>
                </View>
                <Ionicons
                  name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                  size={20}
                  color={isSelected ? Colors.primary : Colors.textMuted}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  sub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  form: { gap: 12 },
  sectionHeader: { fontSize: 11, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 0.6, marginTop: 10 },
  rowTwo: { flexDirection: 'row', gap: 10 },
  helperText: { fontSize: 11, color: Colors.textMuted, marginTop: -4, lineHeight: 16 },
  driverList: { gap: 8 },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    ...Shadow.soft,
  },
  driverCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft },
  driverAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatarText: { color: Colors.primary, fontWeight: '800', fontSize: 14 },
  driverName: { fontSize: 13, fontWeight: '700', color: Colors.text },
  driverMeta: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  error: { color: Colors.danger, fontWeight: '600', fontSize: 13, textAlign: 'center' },
});
