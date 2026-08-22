import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

export function Logo({ size = 'md', light = false }: { size?: 'sm' | 'md' | 'lg'; light?: boolean }) {
  const pin = size === 'lg' ? 34 : size === 'sm' ? 22 : 28;
  const text = size === 'lg' ? 36 : size === 'sm' ? 22 : 28;

  return (
    <View style={styles.row}>
      <Ionicons name="location" size={pin} color={Colors.primary} />
      <Text style={[styles.word, { fontSize: text, color: light ? Colors.white : Colors.text }]}>meli</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  word: {
    fontWeight: '800',
    letterSpacing: -0.6,
  },
});
