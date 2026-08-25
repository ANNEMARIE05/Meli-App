/**
 * WhatsGPS API v1.4.0 TypeScript Types & Enums
 * Immediate Positioning Platform Protocol
 */

// ==========================================
// 1. Core API Types & Responses
// ==========================================

export type WhatsGPSResponse<T = unknown> = {
  ret: number; // 1 = Success, <= 0 or other = Error code
  msg?: string;
  data?: T;
  total?: number;
};

// ==========================================
// 2. Enumerations (Section 5.1 of Documentation)
// ==========================================

export enum UserType {
  ADMINISTRATOR = 0,
  AGENT = 1,
  GENERAL_USER = 2,
  LOGISTICS_USER = 3,
  RENTAL_USER = 4,
  VEHICLE_USER = 5,
  WIND_CONTROL_USER = 6,
}

export enum MapCoordinateType {
  ORIGINAL_WGS84 = 0,
  BAIDU = 1,
  GOOGLE_GCJ02 = 2,
}

export enum LocationType {
  NO_LOCATION = 0,
  SATELLITE = 1,
  BEIDOU = 2,
  BASE_STATION = 3,
  WIFI = 4,
}

export enum VehicleAlarmType {
  VIBRATION = 1,
  POWER_OFF = 2,
  LOW_POWER = 3,
  SOS = 4,
  SPEEDING = 5,
  FENCE_PLATFORM = 6,
  DISPLACEMENT = 7,
  LOW_POWER_ALT = 8,
  OUT_AREA_TERMINAL = 9,
  DETACH = 10,
  LIGHT = 11,
  MAGNETIC_INDUCTION = 12,
  ANTI_DISASSEMBLY = 13,
  BLUETOOTH = 14,
  SIGNAL_SHIELD = 15,
  FALSE_BASE_STATION = 16,
  SHORTLIST_PLATFORM = 17,
  SHORTLIST_TERMINAL = 18,
  FENCE_TERMINAL = 19,
  DOOR_OPEN = 20,
  FATIGUE_DRIVING = 21,
  ALARM_AT_2 = 22,
  OUT_OF_TWO = 23,
  TIMEOUT_WARNING = 24,
  TERMINAL_OFFLINE = 25,
  OIL_ALERT = 30,
  ACC_ALARM = 31,
  ACC_OFF_ALARM = 32,
}

export enum VehicleIconType {
  WATER_DROPLET = 1,
  TRUCK_PICKUP = 2,
  CARS = 3,
  BUS = 4,
  TRUCK_CARGO = 5,
  MOTORCYCLE = 6,
  SHIPS = 7,
  MIXER = 8,
  TRAIN = 9,
  TAXI = 10,
  AGRICULTURAL = 11,
  PEOPLE = 12,
}

export enum DeviceStatus {
  ESTABLISHED = 0,
  NO_PROTECTION = 1,
  SLEEP = 2,
  POWER_CUT = 3,
  SPORTS = 4,
  ACC_FEATURES = 5,
  DOOR_OPEN = 6,
  THROTTLE_BREAK = 7,
  SWITCH = 8,
  MOTOR_LOCK = 9,
  OVERFLOW_VOLTAGE = 10,
  REMOVAL_STATUS = 11,
}

export enum FenceShapeType {
  CIRCLE = 0,
  POLYGON = 1,
}

// ==========================================
// 3. Business Models (Section 5.2)
// ==========================================

export interface WhatsGPSUserData {
  userId: number;
  parentId?: number;
  userType: UserType;
  userName: string;
  name: string;
  linkMan?: string;
  linkPhone?: string;
  email?: string;
  address?: string;
  imageURL?: string;
  allCount?: number;
  onlineCount?: number;
  offlineCount?: number;
  notActiveCount?: number;
}

export interface WhatsGPSVehicle {
  carId: number;
  userId: number;
  machineType?: string;
  carType?: number;
  imei: string;
  carNO: string; // License Plate
  simNO?: string;
  imsi?: string;
  iccid?: string;
  machineName?: string;
  driverName?: string;
  driverTel?: string;
  fuelConsumption?: number;
  serviceState?: number;
  serviceTime?: string;
  platformTime?: string;
  saleTime?: string;
  updateTime?: string;
  remark?: string;
}

export interface WhatsGPSVehicleStatus {
  carId: number;
  online: boolean;
  pointTime: string; // UTC Positioning time
  heartTime?: string; // UTC Heartbeat
  staticTime?: string; // UTC Static time
  pointType?: LocationType;
  lon: number;
  lat: number;
  lonc?: number; // Calibrated
  latc?: number; // Calibrated
  speed: number;
  dir: number; // Course/heading (0-360 degrees)
  status?: number;
  alarm?: number;
  isStop?: boolean;
  stopTime?: number; // rest time in seconds
  accState?: number; // 1 = ON, 0 = OFF
  voltage?: number; // mV
  batteryPercent?: number; // 0-100%
  remainingOilPercent?: number;
  temperature?: number;
  cumulativeMileage?: number; // in meters or km
}

export interface WhatsGPSLocationPoint {
  carId: number;
  imei?: string;
  dataDt?: string;
  pointDt: string; // UTC location timestamp
  pointType?: number;
  lon: number;
  lat: number;
  lonc?: number;
  latc?: number;
  altitude?: number;
  speed: number;
  dir: number;
  status?: number;
  alarm?: number;
  exData?: string;
  remark?: string;
  stopTime?: number;
  signalMile?: number;
  mileage?: number;
  isStop?: boolean;
}

export interface WhatsGPSElectronicFence {
  carFenceId: number;
  userId?: number;
  name: string;
  type: FenceShapeType; // 0: Circle, 1: Polygon
  radius?: number; // in meters (for circle)
  points: string; // "lon,lat;lon,lat;..." or "lon,lat"
  inSwitch?: boolean; // Alarm on enter
  outSwitch?: boolean; // Alarm on exit
  pushSubFlag?: boolean;
  boundCarCount?: number;
  remark?: string;
}

export interface WhatsGPSAlarm {
  alarmId: string | number;
  carId: number;
  userType?: number;
  userId?: number;
  machineName?: string;
  alarmType: VehicleAlarmType;
  alarmTime: string; // UTC
  pointTime?: string; // UTC
  speed?: number;
  dir?: number;
  pointType?: number;
  lon: number;
  lat: number;
  isNew?: boolean;
  remark?: string;
}

export interface WhatsGPSAlarmSwitch {
  type: VehicleAlarmType;
  name: string;
  isOpen: boolean;
  emailOpen?: boolean;
}

export interface WhatsGPSTravelStats {
  carId: number;
  startTime: string;
  endTime: string;
  mileage: number;
  startLon?: number;
  startLat?: number;
  endLon?: number;
  endLat?: number;
}

export interface WhatsGPSStopDetail {
  carId: number;
  pointDt: string;
  state: number; // 1: ON, 0: OFF
  time: number; // duration in seconds
  lon: number;
  lat: number;
  remark?: string;
}

export interface WhatsGPSSpeedingDetail {
  carId: number;
  startTime: string;
  endTime: string;
  maxSpeed: number;
  avgSpeed: number;
  lon: number;
  lat: number;
}

// ==========================================
// 4. Platform Error Code Map (Section 5.3)
// ==========================================

export const WhatsGPSErrorMessages: Record<number, string> = {
  1: 'Succès',
  0: 'Échec de la requête',
  [-101]: 'Système occupé',
  [-102]: 'Opération non autorisée',
  [-103]: 'Limites fonctionnelles atteintes',
  [-104]: 'Nombre maximum de véhicules par groupe dépassé',
  [-105]: 'Opération métier occupée',
  [-106]: 'Erreur de saisie',
  [-1001]: 'Jeton de session manquant',
  [-1002]: 'Jeton de session invalide ou expiré',
  [-2001]: 'La longitude ne peut pas être vide',
  [-2002]: 'La latitude ne peut pas être vide',
  [-2003]: 'Le rayon ne peut pas être vide',
  [-2004]: 'Date de début requise',
  [-2005]: 'Date de fin requise',
  [-10001]: 'Nom de connexion requis',
  [-10002]: 'Mot de passe requis',
  [-10003]: 'Identifiant ou mot de passe incorrect',
  [-10004]: 'Identifiant utilisateur non spécifié',
  [-10005]: "Le nom d'utilisateur existe déjà",
  [-10006]: "L'utilisateur n'existe pas",
  [-20001]: 'Identifiant de véhicule requis',
  [-20002]: 'Aucun véhicule trouvé',
  [-20003]: 'Numéro IMEI requis',
  [-20006]: 'Le numéro IMEI doit comporter 15 chiffres',
  [-20008]: "L'IMEI existe déjà",
  [-20010]: 'Aucune donnée de géolocalisation disponible',
  [-40001]: 'Type de clôture électronique invalide',
  [-40003]: 'Clôture électronique déjà existante',
  [-40004]: 'Clôture électronique introuvable',
  [-80001]: "Identifiant d'alarme requis",
};

export function getErrorMessage(code: number, defaultMsg = 'Erreur inconnue'): string {
  return WhatsGPSErrorMessages[code] || `${defaultMsg} (Code: ${code})`;
}
