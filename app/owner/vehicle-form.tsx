import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Colors } from '@/constants/theme';

export default function VehicleFormScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  function submit() {
    if (!name || !plate || !type || !year) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    router.replace('/owner/vehicles');
  }

  return (
    <Screen scroll>
      <View style={styles.top}>
        <BackButton />
        <Text style={styles.title}>Nouveau véhicule</Text>
      </View>
      <View style={styles.form}>
        <Input label="Marque / Modèle" placeholder="Ex. Toyota Hilux" value={name} onChangeText={setName} />
        <Input label="Immatriculation" placeholder="Ex. A 1234 BE" autoCapitalize="characters" value={plate} onChangeText={setPlate} />
        <Input label="Type" placeholder="Ex. 4x4, Utilitaire…" value={type} onChangeText={setType} />
        <Input label="Année" placeholder="Ex. 2022" keyboardType="number-pad" value={year} onChangeText={setYear} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button label="Enregistrer le véhicule" onPress={submit} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  form: { gap: 14 },
  error: { color: Colors.danger },
});
