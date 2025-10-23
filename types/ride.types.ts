export type RideType = 'moto' | 'taxi' | 'expresso';
export type DeliveryType = 'bicicleta' | 'moto' | 'carro' | 'rural';
export type ServiceType = 'corrida' | 'entrega';
export type VehicleType = 'moto' | 'carro' | 'bicicleta' | 'caminhao' | 'outro';

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  district?: string;
}

export interface RideRequest {
  serviceType: ServiceType;
  rideType?: RideType;
  deliveryType?: DeliveryType;
  origin: Location;
  destination: Location;
  distance: number;
  duration: number;
  price: number;
  paymentMethod: 'pix' | 'card' | 'cash';
  extras?: string[];
}

export interface DriverInfo {
  vehicleType: VehicleType;
  vehicleBrand: string;
  vehicleModel: string;
  vehiclePlate: string;
  vehiclePhoto?: string;
  driverPhoto?: string;
  serviceType: ServiceType; // 'corrida' ou 'entrega'
  cnh?: string;
}

// Distritos e povoados da região de Xique-Xique
export const XIQUE_DISTRICTS = [
  'Xique-Xique (Centro)',
  'Marreca Velha',
  'Rumo Novo',
  'Vacaria',
  'Pedra Branca',
  'Queimada',
  'Iguira',
  'Nova Iguira',
  'Perto Velha',
  'Mato Grosso',
  'Vicente',
];

// Preços base por tipo de corrida/entrega (por km)
export const PRICING = {
  corrida: {
    moto: 2.5,
    taxi: 3.0,
    expresso: 4.5,
  },
  entrega: {
    bicicleta: 2.0,
    moto: 2.5,
    carro: 3.5,
    rural: 5.0,
  },
  minimumFare: 5.0,
  companyCommission: 0.02, // 2%
  minimumWithdrawal: 140.0,
};
