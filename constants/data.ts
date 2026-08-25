export type VehicleStatus = 'actif' | 'arrete' | 'maintenance';

export type DriverInfo = {
  id: string;
  fullName: string;
  phone: string;
  licenseNumber: string;
  experience: string;
  rating: number;
  avatarLetter: string;
  status: 'disponible' | 'en_mission' | 'repos';
  assignedVehicleId?: string;
};

export type Vehicle = {
  id: string;
  name: string;
  plate: string;
  type: string;
  year: number;
  km: number;
  fuel: number;
  status: VehicleStatus;
  location: string;
  lastUpdate: string;
  lastTripDuration: string;
  lastTripDistance: string;
  imei?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  nextMaintenanceKm?: number;
};

export type AlertItem = {
  id: string;
  type: 'critique' | 'avert' | 'info';
  title: string;
  vehicle: string;
  detail: string;
  time: string;
  unread?: boolean;
};

export type TripItem = {
  id: string;
  dateGroup: string;
  startTime: string;
  from: string;
  to: string;
  duration: string;
  distance: string;
};

export type MaintenanceCategory =
  | 'vidange'
  | 'freins'
  | 'pneus'
  | 'filtres'
  | 'revision'
  | 'visite_technique'
  | 'autre';

export type MaintenanceItem = {
  id: string;
  title: string;
  vehicle: string;
  vehicleId?: string;
  status: 'urgent' | 'prevoir' | 'fait';
  deadline: string;
  cost: string;
  category?: MaintenanceCategory;
  triggerKm?: number;
  intervalKm?: number;
  currentKm?: number;
  completedAt?: string;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: string;
  billingPeriod: string;
  features: string[];
  recommended?: boolean;
};

export type InvoiceItem = {
  id: string;
  number: string;
  date: string;
  amount: string;
  status: 'payee' | 'en_attente' | 'echue';
  period: string;
};

export type CorporateLogbookEntry = {
  id: string;
  date: string;
  driverName: string;
  driverPhone: string;
  vehicleName: string;
  vehiclePlate: string;
  departureTime: string;
  arrivalTime?: string;
  departureLocation: string;
  arrivalLocation?: string;
  startKm: number;
  endKm?: number;
  distanceKm?: number;
  status: 'en_cours' | 'termine' | 'incident';
  incidentDetails?: string;
  cleanliness?: string;
  fuelLevel?: number;
};

export const driversList: DriverInfo[] = [
  {
    id: 'drv1',
    fullName: 'Karim Diallo',
    phone: '+225 07 88 12 34 56',
    licenseNumber: 'CI-2018-847291',
    experience: '6 ans d’expérience',
    rating: 4.9,
    avatarLetter: 'K',
    status: 'disponible',
    assignedVehicleId: 'hilux',
  },
  {
    id: 'drv2',
    fullName: 'Moussa Koné',
    phone: '+225 05 44 22 11 00',
    licenseNumber: 'CI-2015-103948',
    experience: '9 ans d’expérience',
    rating: 4.8,
    avatarLetter: 'M',
    status: 'en_mission',
    assignedVehicleId: 'kangoo',
  },
  {
    id: 'drv3',
    fullName: 'Yves Bamba',
    phone: '+225 01 77 99 88 22',
    licenseNumber: 'CI-2021-992013',
    experience: '4 ans d’expérience',
    rating: 4.7,
    avatarLetter: 'Y',
    status: 'disponible',
    assignedVehicleId: 'sprinter',
  },
  {
    id: 'drv4',
    fullName: 'Amadou Soro',
    phone: '+225 07 11 22 33 44',
    licenseNumber: 'CI-2019-332194',
    experience: '5 ans d’expérience',
    rating: 4.9,
    avatarLetter: 'A',
    status: 'disponible',
  },
];

export const owner = {
  firstName: 'Hamed',
  lastName: 'Kouadio',
  fullName: 'Hamed Kouadio',
  role: 'Propriétaire & Gestionnaire Flotte',
  company: 'Meli Fleet Solutions',
  phone: '+225 07 12 34 56 78',
  email: 'h.kouadio@meli.app',
  memberSince: 'Membre depuis 2024',
  subscriptionStatus: 'Actif',
  planName: 'Forfait Flotte Pro GPS',
  nextBillingDate: '15 Septembre 2026',
  monthlyAmount: '25 000 FCFA / mois',
};

export const driver = {
  firstName: 'Karim',
  lastName: 'Diallo',
  fullName: 'Karim Diallo',
  company: 'TransCorp Abidjan',
  phone: '+225 07 88 12 34 56',
  license: 'CI-2018-847291',
  vehicle: {
    id: 'hilux',
    name: 'Toyota Hilux 4x4',
    plate: 'A 1234 BE',
    year: 2022,
    km: 87450,
  },
};

export const vehicles: Vehicle[] = [
  {
    id: 'hilux',
    name: 'Toyota Hilux',
    plate: 'A 1234 BE',
    type: '4x4 Pick-up',
    year: 2022,
    km: 87450,
    fuel: 68,
    status: 'actif',
    location: 'Abidjan Plateau',
    lastUpdate: '14:32',
    lastTripDuration: '2h 15',
    lastTripDistance: '18.4 km',
    imei: '864201049283719',
    assignedDriverId: 'drv1',
    assignedDriverName: 'Karim Diallo',
    assignedDriverPhone: '+225 07 88 12 34 56',
    nextMaintenanceKm: 90000,
  },
  {
    id: 'kangoo',
    name: 'Renault Kangoo Express',
    plate: 'B 5678 CA',
    type: 'Utilitaire léger',
    year: 2020,
    km: 123200,
    fuel: 41,
    status: 'arrete',
    location: 'Yopougon Zone Ind.',
    lastUpdate: '09:18',
    lastTripDuration: '48 min',
    lastTripDistance: '12.1 km',
    imei: '864201049283720',
    assignedDriverId: 'drv2',
    assignedDriverName: 'Moussa Koné',
    assignedDriverPhone: '+225 05 44 22 11 00',
    nextMaintenanceKm: 125000,
  },
  {
    id: 'sprinter',
    name: 'Mercedes Sprinter Van',
    plate: 'C 9012 DE',
    type: 'Fourgon 15m³',
    year: 2019,
    km: 210000,
    fuel: 22,
    status: 'maintenance',
    location: 'Atécoubé Garage Central',
    lastUpdate: 'Hier',
    lastTripDuration: '1h 02',
    lastTripDistance: '27.6 km',
    imei: '864201049283721',
    assignedDriverId: 'drv3',
    assignedDriverName: 'Yves Bamba',
    assignedDriverPhone: '+225 01 77 99 88 22',
    nextMaintenanceKm: 210500,
  },
];

export const alerts: AlertItem[] = [
  {
    id: 'a1',
    type: 'critique',
    title: 'Excès de vitesse détecté',
    vehicle: 'Toyota Hilux (A 1234 BE)',
    detail: '94 km/h relevé en zone limitée à 80 km/h (Bvd de la Paix)',
    time: 'Il y a 25 min',
    unread: true,
  },
  {
    id: 'a2',
    type: 'avert',
    title: 'Seuil vidange atteint (87 450 km)',
    vehicle: 'Toyota Hilux (A 1234 BE)',
    detail: 'Vidange programmée dans 2 550 km ou 12 jours',
    time: 'Il y a 2 h',
    unread: true,
  },
  {
    id: 'a3',
    type: 'critique',
    title: 'Sortie de zone autorisée (Géofence)',
    vehicle: 'Renault Kangoo (B 5678 CA)',
    detail: 'Véhicule en dehors du périmètre d’exploitation Abidjan Sud',
    time: 'Il y a 3 h',
    unread: false,
  },
  {
    id: 'a4',
    type: 'avert',
    title: 'Niveau batterie faible',
    vehicle: 'Mercedes Sprinter (C 9012 DE)',
    detail: 'Tension tracker GPS 11.8 V - Vérifier batterie moteur',
    time: 'Il y a 5 h',
  },
];

export const trips: TripItem[] = [
  {
    id: 't1',
    dateGroup: "Aujourd'hui",
    startTime: '13:47',
    from: 'Plateau - Siège',
    to: 'Adjamé - Dépôt Nord',
    duration: '34 min',
    distance: '18.4 km',
  },
  {
    id: 't2',
    dateGroup: "Aujourd'hui",
    startTime: '09:12',
    from: 'Cocody Riviera',
    to: 'Plateau - Siège',
    duration: '28 min',
    distance: '11.2 km',
  },
  {
    id: 't3',
    dateGroup: 'Hier',
    startTime: '16:20',
    from: 'Yopougon',
    to: 'Atécoubé Garage',
    duration: '41 min',
    distance: '22.6 km',
  },
  {
    id: 't4',
    dateGroup: 'Hier',
    startTime: '08:05',
    from: 'Marcory Zone 4',
    to: 'Treichville Port',
    duration: '19 min',
    distance: '8.1 km',
  },
];

export const maintenance: MaintenanceItem[] = [
  {
    id: 'm1',
    title: 'Vidange moteur & Filtre à huile',
    vehicle: 'Renault Kangoo',
    vehicleId: 'kangoo',
    status: 'urgent',
    deadline: 'dans 3 jours (à 125 000 km)',
    cost: '45 000 FCFA',
    category: 'vidange',
    triggerKm: 125000,
    intervalKm: 5000,
    currentKm: 123200,
  },
  {
    id: 'm2',
    title: 'Contrôle & Remplacement Plaquettes',
    vehicle: 'Toyota Hilux',
    vehicleId: 'hilux',
    status: 'prevoir',
    deadline: 'dans 12 jours (à 90 000 km)',
    cost: '65 000 FCFA',
    category: 'freins',
    triggerKm: 90000,
    intervalKm: 15000,
    currentKm: 87450,
  },
  {
    id: 'm3',
    title: 'Permutation & Pression des Pneus',
    vehicle: 'Toyota Hilux',
    vehicleId: 'hilux',
    status: 'prevoir',
    deadline: 'dans 20 jours',
    cost: '20 000 FCFA',
    category: 'pneus',
    triggerKm: 92000,
    intervalKm: 10000,
    currentKm: 87450,
  },
  {
    id: 'm4',
    title: 'Filtres air/carburant + Courroie',
    vehicle: 'Mercedes Sprinter',
    vehicleId: 'sprinter',
    status: 'fait',
    deadline: '12 août 2026',
    completedAt: '12 août 2026',
    cost: '140 000 FCFA',
    category: 'filtres',
    triggerKm: 210000,
    intervalKm: 20000,
    currentKm: 210000,
  },
  {
    id: 'm5',
    title: 'Visite technique & Diagnostic OBD',
    vehicle: 'Toyota Hilux',
    vehicleId: 'hilux',
    status: 'fait',
    deadline: '02 juil. 2026',
    completedAt: '02 juil. 2026',
    cost: '55 000 FCFA',
    category: 'visite_technique',
    triggerKm: 80000,
    intervalKm: 20000,
    currentKm: 87450,
  },
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Forfait Particulier GPS',
    price: '5 000 FCFA',
    billingPeriod: '/ mois par véhicule',
    features: [
      'Suivi GPS WhatsGPS en temps réel',
      'Historique des trajets 30 jours',
      'Alertes vitesse & géofencing',
      'Support client WhatsApp 7j/7',
    ],
  },
  {
    id: 'pro',
    name: 'Forfait Flotte Pro Entreprise',
    price: '12 500 FCFA',
    billingPeriod: '/ mois par véhicule',
    recommended: true,
    features: [
      'Tout le forfait Particulier inclus',
      'Gestion maintenance par seuils km & alertes',
      'QR Code véhicule & Carnet de bord digital',
      'Assignation & suivi multi-chauffeurs',
      'Rapports d’activité & exports Excel/PDF',
      'Support dédié prioritaire 24/7',
    ],
  },
  {
    id: 'corporate',
    name: 'Forfait Corporate Enterprise',
    price: '25 000 FCFA',
    billingPeriod: '/ mois (parc > 5 véhicules)',
    features: [
      'Accès API télématique illimité',
      'Gestion centralisée des sinistres & carburant',
      'Tableau de bord de supervision temps réel',
      'Intégration ERP & comptabilité sur mesure',
    ],
  },
];

export const invoicesList: InvoiceItem[] = [
  {
    id: 'inv-08-2026',
    number: 'FAC-2026-08-019',
    date: '15 Août 2026',
    amount: '25 000 FCFA',
    status: 'payee',
    period: 'Août 2026',
  },
  {
    id: 'inv-07-2026',
    number: 'FAC-2026-07-018',
    date: '15 Juillet 2026',
    amount: '25 000 FCFA',
    status: 'payee',
    period: 'Juillet 2026',
  },
  {
    id: 'inv-06-2026',
    number: 'FAC-2026-06-014',
    date: '15 Juin 2026',
    amount: '25 000 FCFA',
    status: 'payee',
    period: 'Juin 2026',
  },
];

export const corporateLogbook: CorporateLogbookEntry[] = [
  {
    id: 'log-1',
    date: "Aujourd'hui",
    driverName: 'Karim Diallo',
    driverPhone: '+225 07 88 12 34 56',
    vehicleName: 'Toyota Hilux 4x4',
    vehiclePlate: 'A 1234 BE',
    departureTime: '13:47',
    arrivalTime: '14:21',
    departureLocation: 'Plateau - Siège',
    arrivalLocation: 'Adjamé - Dépôt Nord',
    startKm: 87431,
    endKm: 87450,
    distanceKm: 19,
    status: 'termine',
    cleanliness: 'Propre',
    fuelLevel: 68,
  },
  {
    id: 'log-2',
    date: "Aujourd'hui",
    driverName: 'Moussa Koné',
    driverPhone: '+225 05 44 22 11 00',
    vehicleName: 'Renault Kangoo',
    vehiclePlate: 'B 5678 CA',
    departureTime: '11:15',
    arrivalTime: undefined,
    departureLocation: 'Yopougon Zone Ind.',
    startKm: 123180,
    status: 'en_cours',
    cleanliness: 'Correct',
    fuelLevel: 41,
  },
  {
    id: 'log-3',
    date: 'Hier',
    driverName: 'Yves Bamba',
    driverPhone: '+225 01 77 99 88 22',
    vehicleName: 'Mercedes Sprinter',
    vehiclePlate: 'C 9012 DE',
    departureTime: '08:30',
    arrivalTime: '17:45',
    departureLocation: 'Treichville Port',
    arrivalLocation: 'Atécoubé Garage Central',
    startKm: 209930,
    endKm: 210000,
    distanceKm: 70,
    status: 'incident',
    incidentDetails: 'Voyant moteur allumé à l’arrivée + bruit courroie',
    cleanliness: 'Poussiéreux',
    fuelLevel: 22,
  },
  {
    id: 'log-4',
    date: 'Hier',
    driverName: 'Karim Diallo',
    driverPhone: '+225 07 88 12 34 56',
    vehicleName: 'Toyota Hilux 4x4',
    vehiclePlate: 'A 1234 BE',
    departureTime: '09:00',
    arrivalTime: '10:30',
    departureLocation: 'Cocody Riviera',
    arrivalLocation: 'Plateau - Siège',
    startKm: 87410,
    endKm: 87431,
    distanceKm: 21,
    status: 'termine',
    cleanliness: 'Propre',
    fuelLevel: 75,
  },
];

export function getVehicle(id: string) {
  return vehicles.find((v) => v.id === id) ?? vehicles[0];
}

export type IdentifiedVehicle = {
  id: string;
  name: string;
  plate: string;
  year: number;
  km: number;
  fuel?: number;
  assignedDriver?: string;
};

export const assignedVehicle: IdentifiedVehicle = {
  id: 'hilux',
  name: driver.vehicle.name,
  plate: driver.vehicle.plate,
  year: driver.vehicle.year,
  km: driver.vehicle.km,
  fuel: 68,
  assignedDriver: driver.fullName,
};

function normalizeScanToken(value: string) {
  return value.toLowerCase().replace(/[\s-]/g, '');
}

export function resolveVehicleFromScan(raw: string): IdentifiedVehicle | null {
  const data = raw.trim();
  if (!data) return null;

  let parsed: { id?: string; plate?: string; name?: string; km?: number } | null = null;
  if (data.startsWith('{')) {
    try {
      parsed = JSON.parse(data);
    } catch {
      parsed = null;
    }
  }

  const needle = normalizeScanToken(parsed?.id ?? parsed?.plate ?? data);
  const catalog: IdentifiedVehicle[] = [
    assignedVehicle,
    ...vehicles.map((v) => ({
      id: v.id,
      name: v.name,
      plate: v.plate,
      year: v.year,
      km: v.km,
      fuel: v.fuel,
      assignedDriver: v.assignedDriverName,
    })),
  ];

  return (
    catalog.find(
      (item) =>
        normalizeScanToken(item.id) === needle ||
        normalizeScanToken(item.plate) === needle ||
        needle.includes(normalizeScanToken(item.plate)) ||
        needle.includes(normalizeScanToken(item.id))
    ) ?? null
  );
}

export const statusLabel: Record<VehicleStatus, string> = {
  actif: 'Actif',
  arrete: 'Arrêté',
  maintenance: 'Maintenance',
};
