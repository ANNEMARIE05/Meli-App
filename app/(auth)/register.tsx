import { Checkbox } from 'expo-checkbox';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [company, setCompany] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (!company || !fullName || !email || !phone || !password || !confirm) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!accepted) {
      setError('Veuillez accepter les conditions d’utilisation.');
      return;
    }
    setError('');
    await register({ company, fullName, email, phone, password });
    router.push({ pathname: '/(auth)/otp', params: { next: 'owner' } });
  }

  return (
    <Screen scroll>
      <BackButton />
      <Text style={styles.title}>Créer un compte</Text>
      <Text style={styles.subtitle}>Remplissez vos informations pour commencer</Text>

      <View style={styles.form}>
        <Input label="Nom de l'entreprise" placeholder="Entrez le nom de votre entreprise" value={company} onChangeText={setCompany} />
        <Input label="Nom et prénom" placeholder="Entrez votre nom complet" value={fullName} onChangeText={setFullName} />
        <Input
          label="Adresse e-mail"
          placeholder="Entrez votre adresse e-mail"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Numéro de téléphone"
          placeholder="Ex. 07 00 00 00 00"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          leftAddon={
            <View style={styles.cc}>
              <Text style={styles.ccText}>+225</Text>
            </View>
          }
        />
        <Input label="Mot de passe" placeholder="Créez un mot de passe" isPassword value={password} onChangeText={setPassword} />
        <Input label="Confirmer le mot de passe" placeholder="Confirmez votre mot de passe" isPassword value={confirm} onChangeText={setConfirm} />

        <Pressable style={styles.terms} onPress={() => setAccepted((v) => !v)}>
          <Checkbox value={accepted} onValueChange={setAccepted} color={Colors.primary} />
          <Text style={styles.termsText}>
            J’accepte les <Text style={styles.link}>conditions d’utilisation</Text> et la{' '}
            <Text style={styles.link}>politique de confidentialité</Text>
          </Text>
        </Pressable>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button label="Créer mon compte" onPress={() => void submit()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, textAlign: 'center', marginTop: 12 },
  subtitle: { textAlign: 'center', color: Colors.textSecondary, marginTop: 8, marginBottom: 20 },
  form: { gap: 14, paddingBottom: 24 },
  cc: {
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  ccText: { fontWeight: '700', color: Colors.text },
  terms: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  termsText: { flex: 1, color: Colors.textSecondary, lineHeight: 20 },
  link: { color: Colors.primary, fontWeight: '700' },
  error: { color: Colors.danger },
});
