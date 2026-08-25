import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { assignedVehicle, resolveVehicleFromScan, vehicles } from '@/constants/data';
import { Colors, Radius } from '@/constants/theme';
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
  const [showPicker, setShowPicker] = useState(false);
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
      const matched = resolveVehicleFromScan(raw ?? '') ?? assignedVehicle;
      identifyVehicle(matched);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      router.push('/driver/vehicle');
    },
    [identifyVehicle, router]
  );

  function onBarcodeScanned(result: BarcodeScanningResult) {
    if (lockedRef.current || !result.data) return;
    setStatus('QR Code reconnu • Véhicule identifié');
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
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Ionicons name="chevron-back" size={22} color={Colors.white} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Scan QR Code Véhicule</Text>
            <Text style={styles.headerSub}>Carnet de bord numérique</Text>
          </View>
          <Pressable onPress={() => setShowPicker(true)} style={styles.fleetPickerBtn}>
            <Ionicons name="list" size={20} color={Colors.white} />
          </Pressable>
        </View>

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
              <Button
                label="Sélectionner dans la flotte"
                variant="secondary"
                onPress={() => setShowPicker(true)}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Modal - Choisir manuellement dans la flotte */}
      <Modal visible={showPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Véhicules du parc</Text>
              <Pressable onPress={() => setShowPicker(false)} style={styles.modalClose}>
                <Ionicons name="close" size={22} color={Colors.text} />
              </Pressable>
            </View>
            <Text style={styles.modalSub}>
              Simuler le scan d’un QR code collé sur un véhicule :
            </Text>

            {vehicles.map((v) => (
              <Pressable
                key={v.id}
                onPress={() => {
                  setShowPicker(false);
                  goToVehicle(v.id);
                }}
                style={styles.vehCard}>
                <View style={styles.vehIconWrap}>
                  <Ionicons name="car-sport" size={20} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vehName}>{v.name}</Text>
                  <Text style={styles.vehPlate}>{v.plate} • {v.type}</Text>
                  <Text style={styles.vehKm}>Compteur : {v.km.toLocaleString('fr-FR')} km</Text>
                </View>
                <Ionicons name="qr-code-outline" size={22} color={Colors.primary} />
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.mapNavy },
  fallback: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0F1622' },
  dim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,12,20,0.35)' },
  ui: { flex: 1, paddingHorizontal: 20, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: { alignItems: 'center' },
  headerTitle: { color: Colors.white, fontSize: 16, fontWeight: '800' },
  headerSub: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
  fleetPickerBtn: {
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
  hint: { color: Colors.white, textAlign: 'center', fontSize: 14, marginBottom: 14, fontWeight: '600' },
  loading: { alignItems: 'center', marginBottom: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 12 },
  torch: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  torchDisabled: { opacity: 0.45 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  modalClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  modalSub: { color: Colors.textSecondary, fontSize: 13, marginBottom: 16 },
  vehCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  vehIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  vehName: { fontWeight: '800', color: Colors.text, fontSize: 14 },
  vehPlate: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  vehKm: { color: Colors.primary, fontSize: 11, fontWeight: '700', marginTop: 2 },
});
