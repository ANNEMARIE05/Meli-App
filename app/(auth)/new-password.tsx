import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ShieldCheck } from '@/components/illustrations';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Colors } from '@/constants/theme';

export default function NewPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  function submit() {
    if (!password || !confirm) {
      setError('Renseignez les deux champs.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    router.replace('/(auth)/login');
  }

  return (
    <Screen>
      <BackButton />
      <View style={styles.center}>
        <ShieldCheck />
        <Text style={styles.title}>Nouveau mot de passe</Text>
        <Text style={styles.body}>Entrez votre nouveau mot de passe pour sécuriser votre compte</Text>
        <View style={styles.form}>
          <Input label="Mot de passe" placeholder="Entrez votre mot de passe" isPassword value={password} onChangeText={setPassword} />
          <Input label="Mot de passe" placeholder="Entrez votre mot de passe" isPassword value={confirm} onChangeText={setConfirm} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button label="Mettre à jour" onPress={submit} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  body: { color: Colors.textSecondary, textAlign: 'center', marginVertical: 12, lineHeight: 21 },
  form: { width: '100%', gap: 14, marginTop: 8 },
  error: { color: Colors.danger },
});
