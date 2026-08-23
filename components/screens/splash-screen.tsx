import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

export function SplashScreen() {
  const router = useRouter();
  const { onboarded } = useAuth();

  function next() {
    router.replace(onboarded ? '/(auth)/login' : '/onboarding');
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Image
        source={require('../../assets/images/splash-bg.jpg')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <LinearGradient
        colors={['rgba(10,12,16,0.08)', 'transparent', 'rgba(10,12,16,0.55)']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.content}>
        <View style={styles.center} />
        <Button label="Suivant" onPress={next} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.mapDark,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  center: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 8,
  },
});
