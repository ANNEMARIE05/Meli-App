import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radius } from '@/constants/theme';

type Tone = 'success' | 'danger' | 'warning' | 'neutral' | 'info' | 'primary';

const tones: Record<Tone, { bg: string; fg: string }> = {
  success: { bg: Colors.successBg, fg: Colors.success },
  danger: { bg: Colors.dangerBg, fg: Colors.danger },
  warning: { bg: Colors.warningBg, fg: Colors.warning },
  neutral: { bg: '#F2F2F7', fg: Colors.textSecondary },
  info: { bg: Colors.infoBg, fg: Colors.info },
  primary: { bg: Colors.primarySoft, fg: Colors.primary },
};

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const c = tones[tone];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
