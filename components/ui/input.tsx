import { Ionicons } from '@expo/vector-icons';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { Colors, Radius } from '@/constants/theme';

type Props = TextInputProps & {
  label: string;
  error?: string;
  isPassword?: boolean;
  leftAddon?: ReactNode;
};

export function Input({ label, error, isPassword, leftAddon, style, ...rest }: Props) {
  const [hidden, setHidden] = useState(isPassword);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, error && styles.fieldError]}>
        {leftAddon}
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          placeholderTextColor={Colors.textMuted}
          style={[styles.input, style]}
        />
        {isPassword ? (
          <Pressable onPress={() => setHidden((v) => !v)} hitSlop={10}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={Colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  field: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    gap: 8,
  },
  fieldError: {
    borderColor: Colors.danger,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 14,
  },
  error: {
    color: Colors.danger,
    fontSize: 12,
  },
});
