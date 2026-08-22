import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Colors } from '@/constants/theme';

export function SplashScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient colors={['#0E1116', '#1A2230', '#12151B']} style={StyleSheet.absoluteFill} />
      <View style={styles.mapLayer} pointerEvents="none">
        <View style={[styles.road, { top: '22%', left: -30, width: '80%', transform: [{ rotate: '-18deg' }] }]} />
        <View style={[styles.road, { top: '48%', left: 40, width: '90%', transform: [{ rotate: '14deg' }] }]} />
        <View style={[styles.path]} />
        <Ionicons name="location" size={28} color={Colors.primary} style={[styles.pin, { top: '28%', left: '22%' }]} />
        <Ionicons name="location" size={34} color={Colors.primary} style={[styles.pin, { top: '58%', right: '18%' }]} />
        <Ionicons name="car" size={16} color={Colors.white} style={{ position: 'absolute', top: '36%', left: '38%' }} />
        <Ionicons name="car" size={16} color={Colors.white} style={{ position: 'absolute', top: '46%', left: '52%' }} />
        <Ionicons name="car" size={16} color={Colors.white} style={{ position: 'absolute', top: '54%', left: '64%' }} />
      </View>

      <SafeAreaView style={styles.content}>
        <View style={styles.center}>
          <Logo size="lg" light />
        </View>
        <Button label="Suivant" onPress={() => router.push('/onboarding')} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.mapDark },
  mapLayer: { ...StyleSheet.absoluteFillObject, opacity: 0.9 },
  road: {
    position: 'absolute',
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
  },
  path: {
    position: 'absolute',
    top: '32%',
    left: '24%',
    width: 210,
    height: 140,
    borderWidth: 4,
    borderColor: Colors.primary,
    borderRadius: 80,
    borderLeftColor: 'transparent',
    transform: [{ rotate: '28deg' }],
  },
  pin: { position: 'absolute' },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
