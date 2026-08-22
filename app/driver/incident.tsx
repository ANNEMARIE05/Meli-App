import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Colors, Radius } from '@/constants/theme';

const kinds = ['Accident', 'Panne', 'Excès signalé', 'Autre'];

export default function IncidentScreen() {
  const router = useRouter();
  const [kind, setKind] = useState(kinds[0]);
  const [note, setNote] = useState('');

  return (
    <Screen>
      <View style={styles.top}>
        <BackButton />
        <Text style={styles.title}>Signaler un incident</Text>
      </View>
      <Text style={styles.sub}>Décrivez rapidement la situation. L’équipe flotte sera notifiée.</Text>
      <View style={styles.chips}>
        {kinds.map((k) => (
          <Pressable key={k} onPress={() => setKind(k)} style={[styles.chip, kind === k && styles.chipOn]}>
            <Text style={[styles.chipText, kind === k && styles.chipTextOn]}>{k}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Ajouter un commentaire…"
        placeholderTextColor={Colors.textMuted}
        multiline
        style={styles.area}
      />
      <Button
        label="Envoyer le signalement"
        onPress={() => router.back()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  sub: { color: Colors.textSecondary, lineHeight: 20, marginBottom: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipOn: { backgroundColor: Colors.primarySoft, borderColor: Colors.primary },
  chipText: { color: Colors.textSecondary, fontWeight: '600' },
  chipTextOn: { color: Colors.primary },
  area: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 14,
    textAlignVertical: 'top',
    marginBottom: 18,
    color: Colors.text,
  },
});
