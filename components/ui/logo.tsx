import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  size?: Size;
  light?: boolean;
};

const SIZES: Record<Size, { pin: number; text: number; gap: number }> = {
  sm: { pin: 22, text: 22, gap: 6 },
  md: { pin: 28, text: 28, gap: 7 },
  lg: { pin: 38, text: 36, gap: 8 },
};

function MeliPin({ size, color, innerColor }: { size: number; color: string; innerColor: string }) {
  const stroke = Math.max(2.4, size * 0.11);
  const inner = size * 0.4;

  return (
    <View style={{ width: size, height: size * 1.28, alignItems: 'center' }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: stroke,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          backgroundColor: 'transparent',
        }}>
        <View
          style={{
            width: inner,
            height: inner,
            borderRadius: inner / 2,
            borderWidth: stroke * 0.85,
            borderColor: innerColor,
          }}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 1,
          width: size * 0.34,
          height: size * 0.34,
          borderColor: color,
          borderRightWidth: stroke,
          borderBottomWidth: stroke,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}

export function Logo({ size = 'md', light = false }: Props) {
  const metrics = SIZES[size];
  const color = light ? Colors.white : Colors.primary;
  const innerColor = light ? 'rgba(255,255,255,0.55)' : '#3D3D42';

  return (
    <View style={[styles.row, { gap: metrics.gap }]} accessibilityRole="image" accessibilityLabel="meli">
      <MeliPin size={metrics.pin} color={color} innerColor={innerColor} />
      <Text style={[styles.word, { fontSize: metrics.text, color }]}>meli</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  word: {
    fontWeight: '800',
    letterSpacing: -0.8,
    includeFontPadding: false,
  },
});
