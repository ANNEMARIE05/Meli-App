import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/theme';

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const scannedRef = useRef(false);

  function goNext() {
    if (scannedRef.current) return;
    scannedRef.current = true;
    router.push('/driver/vehicle');
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {permission?.granted ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={goNext}
        />
      ) : (
        <View style={styles.fallback} />
      )}
      <View style={styles.dim} />

      <SafeAreaView style={styles.ui}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={Colors.white} />
        </Pressable>

        <View style={styles.center}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            <Ionicons name="qr-code-outline" size={72} color="rgba(255,255,255,0.35)" />
          </View>
        </View>

        <Text style={styles.hint}>Placez le QR code du véhicule dans le cadre.</Text>

        {!permission?.granted ? (
          <Button label="Autoriser la caméra" onPress={() => void requestPermission()} style={{ marginBottom: 10 }} />
        ) : null}

        <View style={styles.controls}>
          <Pressable onPress={() => setTorch((v) => !v)} style={styles.torch}>
            <Ionicons name={torch ? 'flash' : 'flash-outline'} size={20} color={Colors.white} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Button label="Scanner" onPress={goNext} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.mapNavy },
  fallback: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0F1622' },
  dim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,12,20,0.35)' },
  ui: { flex: 1, paddingHorizontal: 20, justifyContent: 'space-between' },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { alignItems: 'center' },
  frame: {
    width: 250,
    height: 250,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderColor: Colors.primary,
  },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 },
  hint: { color: Colors.white, textAlign: 'center', fontSize: 15, marginBottom: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 8 },
  torch: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
