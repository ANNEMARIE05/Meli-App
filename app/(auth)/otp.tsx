import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OtpPhone } from '@/components/illustrations';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/ui/otp-input';
import { Screen } from '@/components/ui/screen';
import { Colors } from '@/constants/theme';

export default function OtpScreen() {
  const router = useRouter();
  const { next } = useLocalSearchParams<{ next?: string }>();
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(45);
  const [error, setError] = useState('');

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  function verify() {
    if (code.replace(/\s/g, '').length < 6) {
      setError('Entrez le code à 6 chiffres.');
      return;
    }
    if (next === 'reset') {
      router.push('/(auth)/new-password');
      return;
    }
    router.replace((next === 'driver' ? '/driver' : '/owner') as Href);
  }

  return (
    <Screen>
      <BackButton />
      <View style={styles.center}>
        <OtpPhone />
        <Text style={styles.title}>Validation</Text>
        <Text style={styles.body}>Nous avons envoyé un code à 6 chiffres à votre email ou téléphone</Text>
        <OtpInput value={code} onChange={setCode} />
        <Text style={styles.timer}>
          Renvoyez le code dans <Text style={styles.time}>00:{String(seconds).padStart(2, '0')}</Text>
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.btn}>
          <Button label="Vérifier" onPress={verify} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center' },
  title: { fontSize: 30, fontWeight: '800', color: Colors.text, marginTop: 4 },
  body: { color: Colors.textSecondary, textAlign: 'center', marginVertical: 12, lineHeight: 21 },
  timer: { marginTop: 18, color: Colors.textSecondary },
  time: { color: Colors.primary, fontWeight: '800' },
  error: { color: Colors.danger, marginTop: 8 },
  btn: { width: '100%', marginTop: 24 },
});
