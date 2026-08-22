import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EnvelopeLock } from '@/components/illustrations';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Colors } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function submit() {
    if (!email.trim()) {
      setError('Entrez votre adresse e-mail.');
      return;
    }
    router.push({ pathname: '/(auth)/otp', params: { next: 'reset' } });
  }

  return (
    <Screen>
      <BackButton />
      <View style={styles.center}>
        <EnvelopeLock />
        <Text style={styles.title}>Mot de passe oublié ?</Text>
        <Text style={styles.body}>
          Pas de souci ! Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe
        </Text>
        <View style={styles.form}>
          <Input
            label="Adresse e-mail"
            placeholder="Entrez votre adresse e-mail"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button label="Envoyer le lien" onPress={submit} />
        </View>
        <Link href="/(auth)/login" style={styles.backLink}>
          Retour à la connexion
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', paddingTop: 12 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  body: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 21,
    marginBottom: 24,
  },
  form: { width: '100%', gap: 14 },
  error: { color: Colors.danger },
  backLink: { color: Colors.primary, fontWeight: '700', marginTop: 18 },
});
