import { useRouter, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyTruck } from '@/components/illustrations';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Colors } from '@/constants/theme';

export default function AddVehicleScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.top}>
        <BackButton />
        <Text style={styles.header}>Ajouter un véhicule</Text>
      </View>
      <View style={styles.center}>
        <EmptyTruck />
        <Text style={styles.title}>Aucun véhicule enregistré</Text>
        <Text style={styles.body}>
          Ajoutez votre premier véhicule pour suivre sa position, ses trajets et son état de santé.
        </Text>
      </View>
      <Button label="+ Ajouter mon premier véhicule" onPress={() => router.push('/owner/vehicle-form')} />
      <Pressable onPress={() => router.replace('/owner' as Href)} style={styles.backHome}>
        <Text style={styles.backHomeText}>Retour à l’accueil</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  header: { fontSize: 20, fontWeight: '800', color: Colors.text },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 12 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  body: { color: Colors.textSecondary, textAlign: 'center', lineHeight: 21 },
  backHome: { alignItems: 'center', paddingVertical: 14 },
  backHomeText: { color: Colors.primary, fontWeight: '700' },
});
