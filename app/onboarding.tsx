import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FleetIllustration, ReportsIllustration, TrackingIllustration } from '@/components/illustrations';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'expo-router';

const slides = [
  {
    title: 'Gestion de flotte intelligente',
    body: 'Surveillez vos véhicules en temps réel, optimisez vos itinéraires et améliorez l’efficacité opérationnelle',
    art: <FleetIllustration />,
  },
  {
    title: 'Suivi en temps réel',
    body: 'Suivez vos véhicules en direct et recevez des mises à jour instantanées sur leur position et leur statut',
    art: <TrackingIllustration />,
  },
  {
    title: 'Analyse et rapport',
    body: 'Obtenez des rapports détaillés pour prendre des décisions basées sur les données et réduire vos coûts',
    art: <ReportsIllustration />,
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const last = index === slides.length - 1;
  const slide = slides[index];

  async function finish() {
    await completeOnboarding();
    router.replace('/(auth)/login');
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.top}>
        <View />
        <Pressable onPress={finish}>
          <Text style={styles.skip}>Passer</Text>
        </Pressable>
      </View>

      <View style={styles.center}>
        {slide.art}
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
      </View>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <Button
        label={last ? 'Commencer' : 'Suivant'}
        onPress={() => {
          if (last) {
            void finish();
          } else {
            setIndex((i) => i + 1);
          }
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { justifyContent: 'space-between', paddingTop: 8 },
  top: { flexDirection: 'row', justifyContent: 'flex-end' },
  skip: { color: Colors.textSecondary, fontWeight: '600', fontSize: 15 },
  center: { alignItems: 'center', paddingHorizontal: 8, gap: 16 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E4E4E8',
  },
  dotActive: {
    width: 22,
    backgroundColor: Colors.primary,
  },
});
