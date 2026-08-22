import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Colors, Radius } from '@/constants/theme';

export function FleetIllustration() {
  return (
    <View style={styles.stage}>
      <View style={styles.shadow} />
      <MaterialCommunityIcons name="van-utility" size={120} color="#D9D9DE" />
      <View style={styles.pin}>
        <Ionicons name="location" size={28} color={Colors.white} />
      </View>
    </View>
  );
}

export function TrackingIllustration() {
  return (
    <View style={styles.stage}>
      <MaterialCommunityIcons name="car-side" size={88} color="#D0D0D6" />
      <View style={styles.phone}>
        <Ionicons name="map" size={28} color={Colors.primary} />
      </View>
    </View>
  );
}

export function ReportsIllustration() {
  return (
    <View style={styles.stage}>
      <View style={styles.tablet}>
        <View style={styles.bars}>
          <View style={[styles.bar, { height: 18 }]} />
          <View style={[styles.bar, { height: 28, backgroundColor: Colors.primary }]} />
          <View style={[styles.bar, { height: 14 }]} />
        </View>
        <View style={styles.donut} />
      </View>
      <View style={[styles.pin, { right: 28, top: 18 }]}>
        <Ionicons name="shield-checkmark" size={22} color={Colors.white} />
      </View>
    </View>
  );
}

export function EnvelopeLock() {
  return (
    <View style={styles.stage}>
      <MaterialCommunityIcons name="email-lock" size={92} color={Colors.primary} />
    </View>
  );
}

export function OtpPhone() {
  return (
    <View style={styles.stage}>
      <MaterialCommunityIcons name="cellphone" size={96} color="#C8C8CE" />
      <View style={[styles.pin, { bottom: 18, right: 48 }]}>
        <Ionicons name="lock-closed" size={20} color={Colors.white} />
      </View>
    </View>
  );
}

export function ShieldCheck() {
  return (
    <View style={styles.stage}>
      <Ionicons name="shield" size={92} color="#3A3A40" />
      <View style={[styles.pin, { bottom: 22, right: 52, backgroundColor: Colors.success }]}>
        <Ionicons name="checkmark" size={20} color={Colors.white} />
      </View>
    </View>
  );
}

export function GarageReady() {
  return (
    <View style={styles.stage}>
      <MaterialCommunityIcons name="garage-open" size={80} color="#D7D7DC" />
      <MaterialCommunityIcons name="van-utility" size={70} color="#CFCFD4" />
      <View style={[styles.miniCheck, { left: 40 }]}>
        <Ionicons name="checkmark" size={14} color={Colors.white} />
      </View>
      <View style={[styles.miniCheck, { right: 44 }]}>
        <Ionicons name="checkmark" size={14} color={Colors.white} />
      </View>
    </View>
  );
}

export function EmptyTruck() {
  return (
    <View style={styles.emptyBox}>
      <MaterialCommunityIcons name="truck-outline" size={72} color={Colors.primary} />
      <View style={styles.plus}>
        <Ionicons name="add" size={18} color={Colors.white} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    position: 'absolute',
    bottom: 36,
    width: 140,
    height: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  pin: {
    position: 'absolute',
    top: 28,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: {
    position: 'absolute',
    right: 48,
    width: 54,
    height: 86,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#C9C9CF',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tablet: {
    width: 150,
    height: 100,
    borderRadius: Radius.lg,
    backgroundColor: '#F2F2F6',
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 16,
  },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  bar: { width: 10, borderRadius: 4, backgroundColor: '#D2D2D8' },
  donut: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 8,
    borderColor: Colors.primary,
    borderLeftColor: '#E6E6EA',
  },
  miniCheck: {
    position: 'absolute',
    bottom: 44,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBox: {
    width: 180,
    height: 180,
    borderRadius: 36,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  plus: {
    position: 'absolute',
    top: 36,
    right: 36,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
