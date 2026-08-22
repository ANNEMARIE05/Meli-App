export type VehicleStatus = 'actif' | 'arrete' | 'maintenance';

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

export type MaintenanceItem = {
  id: string;
  title: string;
  vehicle: string;
  status: 'urgent' | 'prevoir' | 'fait';
  deadline: string;
  cost: string;
};

export const owner = {
  firstName: 'Hamed',
  lastName: 'Kouadio',
  fullName: 'Hamed Kouadio',
  role: 'Propriétaire - Individuel',
  company: 'Meli Fleet',
  phone: '+225 07 12 34 56 78',
  email: 'h.kouadio@meli.app',
  memberSince: 'Membre depuis 2024',
};

export const driver = {
  firstName: 'Karim',
  lastName: 'Diallo',
  fullName: 'Karim Diallo',
  company: 'TransCorp Abidjan',
  vehicle: {
    name: 'Toyota HiAce',
    plate: 'AB 2024 CI',
    year: 2023,
    km: 142380,
  },
};

export const vehicles: Vehicle[] = [
  {
    id: 'hilux',
    name: 'Toyota Hilux',
    plate: 'A 1234 BE',
    type: '4x4',
    year: 2022,
    km: 87450,
    fuel: 68,
    status: 'actif',
    location: 'Abidjan Plateau',
    lastUpdate: '14:32',
    lastTripDuration: '2h 15',
    lastTripDistance: '18.4 km',
  },
  {
    id: 'kangoo',
    name: 'Renault Kangoo',
    plate: 'B 5678 CA',
    type: 'Utilitaire',
    year: 2020,
    km: 123200,
    fuel: 41,
    status: 'arrete',
    location: 'Yopougon',
    lastUpdate: '09:18',
    lastTripDuration: '48 min',
    lastTripDistance: '12.1 km',
  },
  {
    id: 'sprinter',
    name: 'Mercedes Sprinter',
    plate: 'C 9012 DE',
    type: 'Fourgon',
    year: 2019,
    km: 210000,
    fuel: 22,
    status: 'maintenance',
    location: 'Atécoubé',
    lastUpdate: 'Hier',
    lastTripDuration: '1h 02',
    lastTripDistance: '27.6 km',
  },
];

export const alerts: AlertItem[] = [
  {
    id: 'a1',
    type: 'critique',
    title: 'Excès de vitesse',
    vehicle: 'Toyota Hilux',
    detail: 'Toyota Hilux - 94 km/h zone 80',
    time: 'Il y a 25 min',
    unread: true,
  },
  {
    id: 'a2',
    type: 'avert',
    title: 'Entretien à programmer',
    vehicle: 'Renault Kangoo',
    detail: 'Renault Kangoo - dans 3 jours',
    time: 'Il y a 2 h',
  },
  {
    id: 'a3',
    type: 'avert',
    title: 'Batterie faible',
    vehicle: 'Mercedes Sprinter',
    detail: 'Mercedes Sprinter - 11.8 V',
    time: 'Il y a 5 h',
  },
];

export const trips: TripItem[] = [
  {
    id: 't1',
    dateGroup: "Aujourd'hui",
    startTime: '13:47',
    from: 'Plateau',
    to: 'Adjamé',
    duration: '34 min',
    distance: '18.4 km',
  },
  {
    id: 't2',
    dateGroup: "Aujourd'hui",
    startTime: '09:12',
    from: 'Cocody',
    to: 'Plateau',
    duration: '28 min',
    distance: '11.2 km',
  },
  {
    id: 't3',
    dateGroup: 'Hier',
    startTime: '16:20',
    from: 'Yopougon',
    to: 'Atécoubé',
    duration: '41 min',
    distance: '22.6 km',
  },
  {
    id: 't4',
    dateGroup: 'Hier',
    startTime: '08:05',
    from: 'Marcory',
    to: 'Treichville',
    duration: '19 min',
    distance: '8.1 km',
  },
];

export const maintenance: MaintenanceItem[] = [
  {
    id: 'm1',
    title: "Vidange d'huile",
    vehicle: 'Renault Kangoo',
    status: 'urgent',
    deadline: 'dans 3 jours',
    cost: '350 DH',
  },
  {
    id: 'm2',
    title: 'Contrôle pneus',
    vehicle: 'Toyota Hilux',
    status: 'prevoir',
    deadline: 'dans 12 jours',
    cost: '180 DH',
  },
  {
    id: 'm3',
    title: 'Filtres + courroie',
    vehicle: 'Mercedes Sprinter',
    status: 'fait',
    deadline: '12 août 2026',
    cost: '620 DH',
  },
  {
    id: 'm4',
    title: 'Révision générale',
    vehicle: 'Toyota Hilux',
    status: 'fait',
    deadline: '02 juil. 2026',
    cost: '890 DH',
  },
];

export function getVehicle(id: string) {
  return vehicles.find((v) => v.id === id) ?? vehicles[0];
}

export const statusLabel: Record<VehicleStatus, string> = {
  actif: 'Actif',
  arrete: 'Arrêté',
  maintenance: 'Maintenance',
};
