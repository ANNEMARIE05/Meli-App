import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { assignedVehicle, resolveVehicleFromScan } from '@/constants/data';
import { Colors } from '@/constants/theme';
import { useTrip } from '@/context/trip-context';

export default function ScanScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { identifyVehicle } = useTrip();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [locked, setLocked] = useState(false);
  const [status, setStatus] = useState('Placez le QR code du véhicule dans le cadre.');
  const lockedRef = useRef(false);

  useEffect(() => {
    if (!isFocused) {
      setTorch(false);
      return;
    }
    lockedRef.current = false;
    setLocked(false);
    setCameraError('');
    setStatus('Placez le QR code du véhicule dans le cadre.');
  }, [isFocused]);

  const goToVehicle = useCallback(
    (raw?: string) => {
      if (lockedRef.current) return;
      lockedRef.current = true;
      setLocked(true);
      identifyVehicle(resolveVehicleFromScan(raw ?? '') ?? assignedVehicle);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      router.push('/driver/vehicle');
    },
    [identifyVehicle, router]
  );

  function onBarcodeScanned(result: BarcodeScanningResult) {
    if (lockedRef.current || !result.data) return;
    setStatus('Véhicule identifié');
    goToVehicle(result.data);
  }

  const cameraReady = isFocused && !!permission?.granted && !cameraError;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {cameraReady ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torch}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={locked ? undefined : onBarcodeScanned}
          onMountError={(event) =>
            setCameraError(event.message || 'Impossible de démarrer la caméra.')
          }
        />
      ) : (
        <View style={styles.fallback} />
      )}
      <View style={styles.dim} pointerEvents="none" />

      <SafeAreaView style={styles.ui} pointerEvents="box-none">
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={Colors.white} />
        </Pressable>

        <View style={styles.center} pointerEvents="none">
          <View style={styles.frame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
          </View>
        </View>

        <View>
          <Text style={styles.hint}>{cameraError || status}</Text>

          {!permission ? (
            <View style={styles.loading}>
              <ActivityIndicator color={Colors.white} />
            </View>
          ) : null}

          {!permission?.granted && permission ? (
            <Button
              label="Autoriser la caméra"
              onPress={() => {
                void requestPermission().catch(() => {
                  setCameraError("Impossible d'obtenir l'accès à la caméra.");
                });
              }}
              style={{ marginBottom: 10 }}
            />
          ) : null}

          <View style={styles.controls}>
            <Pressable
              onPress={() => setTorch((value) => !value)}
              disabled={!cameraReady}
              style={[styles.torch, !cameraReady && styles.torchDisabled]}>
              <Ionicons name={torch ? 'flash' : 'flash-outline'} size={20} color={Colors.white} />
            </Pressable>
            <View style={{ flex: 1 }}>
              {cameraReady ? (
                <Button label="Véhicule assigné" variant="secondary" onPress={() => goToVehicle()} />
              ) : (
                <Button label="Continuer sans scan" onPress={() => goToVehicle()} />
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.mapNavy },
  fallback: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0F1622' },
  dim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,12,20,0.28)' },
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
  loading: { alignItems: 'center', marginBottom: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 8 },
  torch: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  torchDisabled: { opacity: 0.45 },
});
