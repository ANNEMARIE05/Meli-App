import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import { Link, useRouter, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';
import { Screen } from '@/components/ui/screen';
import { Colors, Radius } from '@/constants/theme';
import { useAuth, type UserRole } from '@/context/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [role, setRole] = useState<UserRole>('owner');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email.trim() || !password.trim()) {
      setError('Renseignez votre e-mail et votre mot de passe.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login({ email, password, role, remember });
      router.replace((role === 'driver' ? '/driver' : '/owner') as Href);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll>
      <View style={styles.brand}>
        <Logo />
      </View>
      <Text style={styles.title}>Connecte toi</Text>
      <Text style={styles.subtitle}>Rejoignez Meli app. Connectez-vous pour continuer</Text>

      <View style={styles.roles}>
        {(['owner', 'driver'] as const).map((r) => (
          <Pressable key={r} onPress={() => setRole(r)} style={[styles.role, role === r && styles.roleActive]}>
            <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
              {r === 'owner' ? 'Propriétaire' : 'Chauffeur'}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.form}>
        <Input
          label="Adresse e-mail ou numéro de téléphone"
          placeholder="Entrez votre adresse e-mail"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Mot de passe"
          placeholder="Entrez votre mot de passe"
          isPassword
          value={password}
          onChangeText={setPassword}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.row}>
          <Pressable style={styles.remember} onPress={() => setRemember((v) => !v)}>
            <Checkbox value={remember} onValueChange={setRemember} color={Colors.primary} />
            <Text style={styles.rememberText}>Se souvenir de moi</Text>
          </Pressable>
          <Link href="/(auth)/forgot-password" style={styles.link}>
            Mot de passe oublié ?
          </Link>
        </View>

        <Button label="Se connecter" onPress={() => void submit()} loading={loading} />

        <View style={styles.separator}>
          <View style={styles.line} />
          <Text style={styles.sepText}>Ou continuer avec</Text>
          <View style={styles.line} />
        </View>

        <Button
          variant="secondary"
          label="Continuer avec Google"
          icon={<Ionicons name="logo-google" size={18} color={Colors.text} />}
          onPress={() => void submit()}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Tu n’as pas encore de compte ? </Text>
        <Link href="/(auth)/register" style={styles.link}>
          Créer un compte
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: { alignItems: 'center', marginTop: 12, marginBottom: 18 },
  title: { fontSize: 32, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  subtitle: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
  roles: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  role: {
    flex: 1,
    height: 40,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleActive: { backgroundColor: Colors.primarySoft, borderColor: Colors.primary },
  roleText: { color: Colors.textSecondary, fontWeight: '600' },
  roleTextActive: { color: Colors.primary },
  form: { gap: 14 },
  error: { color: Colors.danger, fontSize: 13 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  remember: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rememberText: { color: Colors.text, fontSize: 13 },
  link: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
  separator: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 6 },
  line: { flex: 1, height: 1, backgroundColor: Colors.border },
  sepText: { color: Colors.textSecondary, fontSize: 12 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 22, flexWrap: 'wrap' },
  footerText: { color: Colors.textSecondary },
});
