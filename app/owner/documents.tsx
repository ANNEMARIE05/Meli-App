import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Screen } from '@/components/ui/screen';
import { Colors, Radius } from '@/constants/theme';

const docs = [
  { id: '1', title: 'Carte grise', meta: 'PDF • 240 Ko' },
  { id: '2', title: 'Assurance', meta: 'Valide jusqu’au 12/2026' },
  { id: '3', title: 'Visite technique', meta: 'Expire dans 48 jours' },
];

export default function DocumentsScreen() {
  return (
    <Screen>
      <View style={styles.top}>
        <BackButton />
        <Text style={styles.title}>Documents</Text>
      </View>
      {docs.map((d) => (
        <View key={d.id} style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{d.title}</Text>
            <Text style={styles.meta}>{d.meta}</Text>
          </View>
          <Ionicons name="download-outline" size={18} color={Colors.textSecondary} />
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontWeight: '800', color: Colors.text },
  meta: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
});
