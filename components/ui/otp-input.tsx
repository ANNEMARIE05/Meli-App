import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors, Radius } from '@/constants/theme';

export function OtpInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const refs = useRef<(TextInput | null)[]>([]);
  const [focused, setFocused] = useState(0);
  const digits = value.padEnd(6, ' ').slice(0, 6).split('');

  function setAt(index: number, char: string) {
    const clean = char.replace(/\D/g, '').slice(-1);
    const next = value.split('');
    while (next.length < 6) next.push('');
    next[index] = clean;
    const joined = next.join('').slice(0, 6);
    onChange(joined);
    if (clean && index < 5) {
      refs.current[index + 1]?.focus();
    }
  }

  return (
    <View style={styles.row}>
      {digits.map((d, i) => (
        <View key={i} style={styles.group}>
          <TextInput
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={d.trim()}
            keyboardType="number-pad"
            maxLength={1}
            onFocus={() => setFocused(i)}
            onChangeText={(t) => setAt(i, t)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && !value[i] && i > 0) {
                refs.current[i - 1]?.focus();
              }
            }}
            style={[styles.box, focused === i && styles.boxActive]}
          />
          {i === 2 ? <Text style={styles.dash}>-</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  box: {
    width: 46,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  boxActive: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  dash: {
    color: Colors.textMuted,
    fontSize: 22,
    fontWeight: '600',
  },
});
