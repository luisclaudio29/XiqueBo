// Lista de marcas e modelos de veículos
// Anos baseados nas regras de cada serviço:
// - Corridas: até 10 anos
// - Entregas urbanas: até 15 anos
// - Entregas rurais: qualquer ano

export const VEHICLE_YEARS = [
  '2025', '2024', '2023', '2022', '2021', 
  '2020', '2019', '2018', '2017', '2016', '2015',
  '2014', '2013', '2012', '2011', '2010',
  '2009', '2008', '2007', '2006', '2005',
  '2004', '2003', '2002', '2001', '2000',
  '1999', '1998', '1997', '1996', '1995',
  '1994', '1993', '1992', '1991', '1990',
  'Anterior a 1990'
];

// Regras de idade do veículo por tipo de serviço
export const VEHICLE_AGE_RULES = {
  corrida: {
    maxYears: 10,
    description: 'Corridas de passageiros',
    message: 'Para corridas de passageiros, o veículo deve ter no máximo 10 anos de uso.',
  },
  entrega_urbana: {
    maxYears: 15,
    description: 'Entregas urbanas',
    message: 'Para entregas urbanas, o veículo deve ter no máximo 15 anos de uso.',
  },
  entrega_rural: {
    maxYears: null, // Sem limite
    description: 'Entregas rurais',
    message: 'Para entregas rurais, aceitamos veículos de qualquer ano, desde que em bom estado.',
  },
};

// Função para calcular ano mínimo aceito
export function getMinimumVehicleYear(serviceCategory: 'corrida' | 'entrega', deliveryType?: string): number | null {
  const currentYear = new Date().getFullYear();
  
  if (serviceCategory === 'corrida') {
    return currentYear - VEHICLE_AGE_RULES.corrida.maxYears;
  }
  
  if (serviceCategory === 'entrega') {
    // Se for entrega rural, aceita qualquer ano
    if (deliveryType === 'entrega_rural') {
      return null; // Sem limite
    }
    // Para outras entregas (bicicleta, moto, carro), máximo 15 anos
    return currentYear - VEHICLE_AGE_RULES.entrega_urbana.maxYears;
  }
  
  return null;
}

// Função para validar ano do veículo
export function validateVehicleYear(
  year: string, 
  serviceCategory: 'corrida' | 'entrega',
  deliveryType?: string
): { valid: boolean; message?: string } {
  // Tratar "Anterior a 1990"
  if (year === 'Anterior a 1990') {
    if (serviceCategory === 'entrega' && deliveryType === 'entrega_rural') {
      return { valid: true };
    }
    return {
      valid: false,
      message: '🚫 Veículo muito antigo. Para corridas e entregas urbanas, são aceitos apenas veículos mais recentes.',
    };
  }
  
  const vehicleYear = parseInt(year);
  const minimumYear = getMinimumVehicleYear(serviceCategory, deliveryType);
  
  // Se não há limite (entrega rural), aceitar
  if (minimumYear === null) {
    return { valid: true };
  }
  
  // Validar idade
  if (vehicleYear < minimumYear) {
    const currentYear = new Date().getFullYear();
    const maxYears = currentYear - minimumYear;
    return {
      valid: false,
      message: `🚫 Seu veículo não atende aos critérios. Para ${serviceCategory === 'corrida' ? 'corridas' : 'entregas urbanas'}, são aceitos apenas veículos com até ${maxYears} anos de uso (${minimumYear} ou mais recente).`,
    };
  }
  
  return { valid: true };
}

export interface VehicleModel {
  name: string;
  type: 'hatch' | 'sedan' | 'suv' | 'pickup' | 'van';
}

export interface VehicleBrand {
  name: string;
  models: VehicleModel[];
}

export const VEHICLE_BRANDS: VehicleBrand[] = [
  {
    name: 'Chevrolet',
    models: [
      { name: 'Onix', type: 'hatch' },
      { name: 'Onix Plus', type: 'sedan' },
      { name: 'Prisma', type: 'sedan' },
      { name: 'Tracker', type: 'suv' },
      { name: 'Trailblazer', type: 'suv' },
      { name: 'S10', type: 'pickup' },
      { name: 'Montana', type: 'pickup' },
      { name: 'Spin', type: 'van' },
      { name: 'Cruze', type: 'sedan' },
      { name: 'Joy', type: 'hatch' },
    ],
  },
  {
    name: 'Volkswagen',
    models: [
      { name: 'Gol', type: 'hatch' },
      { name: 'Voyage', type: 'sedan' },
      { name: 'Polo', type: 'hatch' },
      { name: 'Virtus', type: 'sedan' },
      { name: 'T-Cross', type: 'suv' },
      { name: 'Nivus', type: 'suv' },
      { name: 'Taos', type: 'suv' },
      { name: 'Tiguan', type: 'suv' },
      { name: 'Amarok', type: 'pickup' },
      { name: 'Saveiro', type: 'pickup' },
      { name: 'Up!', type: 'hatch' },
      { name: 'Jetta', type: 'sedan' },
    ],
  },
  {
    name: 'Fiat',
    models: [
      { name: 'Uno', type: 'hatch' },
      { name: 'Mobi', type: 'hatch' },
      { name: 'Argo', type: 'hatch' },
      { name: 'Cronos', type: 'sedan' },
      { name: 'Pulse', type: 'suv' },
      { name: 'Fastback', type: 'suv' },
      { name: 'Toro', type: 'pickup' },
      { name: 'Strada', type: 'pickup' },
      { name: 'Fiorino', type: 'van' },
      { name: 'Doblo', type: 'van' },
    ],
  },
  {
    name: 'Ford',
    models: [
      { name: 'Ka', type: 'hatch' },
      { name: 'Ka Sedan', type: 'sedan' },
      { name: 'EcoSport', type: 'suv' },
      { name: 'Territory', type: 'suv' },
      { name: 'Ranger', type: 'pickup' },
      { name: 'Maverick', type: 'pickup' },
      { name: 'Focus', type: 'hatch' },
      { name: 'Fusion', type: 'sedan' },
    ],
  },
  {
    name: 'Toyota',
    models: [
      { name: 'Etios', type: 'hatch' },
      { name: 'Etios Sedan', type: 'sedan' },
      { name: 'Yaris', type: 'hatch' },
      { name: 'Yaris Sedan', type: 'sedan' },
      { name: 'Corolla', type: 'sedan' },
      { name: 'Corolla Cross', type: 'suv' },
      { name: 'RAV4', type: 'suv' },
      { name: 'SW4', type: 'suv' },
      { name: 'Hilux', type: 'pickup' },
    ],
  },
  {
    name: 'Hyundai',
    models: [
      { name: 'HB20', type: 'hatch' },
      { name: 'HB20S', type: 'sedan' },
      { name: 'HB20X', type: 'suv' },
      { name: 'Creta', type: 'suv' },
      { name: 'Tucson', type: 'suv' },
      { name: 'Santa Fe', type: 'suv' },
      { name: 'ix35', type: 'suv' },
      { name: 'Azera', type: 'sedan' },
      { name: 'Elantra', type: 'sedan' },
    ],
  },
  {
    name: 'Renault',
    models: [
      { name: 'Kwid', type: 'hatch' },
      { name: 'Sandero', type: 'hatch' },
      { name: 'Logan', type: 'sedan' },
      { name: 'Stepway', type: 'suv' },
      { name: 'Duster', type: 'suv' },
      { name: 'Oroch', type: 'pickup' },
      { name: 'Captur', type: 'suv' },
      { name: 'Kardian', type: 'suv' },
    ],
  },
  {
    name: 'Nissan',
    models: [
      { name: 'March', type: 'hatch' },
      { name: 'Versa', type: 'sedan' },
      { name: 'Kicks', type: 'suv' },
      { name: 'Sentra', type: 'sedan' },
      { name: 'Frontier', type: 'pickup' },
      { name: 'Livina', type: 'van' },
    ],
  },
  {
    name: 'Honda',
    models: [
      { name: 'Fit', type: 'hatch' },
      { name: 'City', type: 'sedan' },
      { name: 'Civic', type: 'sedan' },
      { name: 'HR-V', type: 'suv' },
      { name: 'WR-V', type: 'suv' },
      { name: 'CR-V', type: 'suv' },
    ],
  },
  {
    name: 'Jeep',
    models: [
      { name: 'Renegade', type: 'suv' },
      { name: 'Compass', type: 'suv' },
      { name: 'Commander', type: 'suv' },
    ],
  },
  {
    name: 'Peugeot',
    models: [
      { name: '208', type: 'hatch' },
      { name: '2008', type: 'suv' },
      { name: '3008', type: 'suv' },
      { name: '5008', type: 'suv' },
    ],
  },
  {
    name: 'Citroën',
    models: [
      { name: 'C3', type: 'hatch' },
      { name: 'C4 Cactus', type: 'suv' },
      { name: 'Aircross', type: 'suv' },
    ],
  },
  {
    name: 'Mitsubishi',
    models: [
      { name: 'L200', type: 'pickup' },
      { name: 'ASX', type: 'suv' },
      { name: 'Outlander', type: 'suv' },
      { name: 'Eclipse Cross', type: 'suv' },
    ],
  },
  {
    name: 'Kia',
    models: [
      { name: 'Picanto', type: 'hatch' },
      { name: 'Rio', type: 'sedan' },
      { name: 'Cerato', type: 'sedan' },
      { name: 'Sportage', type: 'suv' },
      { name: 'Sorento', type: 'suv' },
      { name: 'Seltos', type: 'suv' },
    ],
  },
  {
    name: 'Caoa Chery',
    models: [
      { name: 'Tiggo 2', type: 'suv' },
      { name: 'Tiggo 3X', type: 'suv' },
      { name: 'Tiggo 5X', type: 'suv' },
      { name: 'Tiggo 7', type: 'suv' },
      { name: 'Tiggo 8', type: 'suv' },
    ],
  },
  {
    name: 'BYD',
    models: [
      { name: 'Dolphin', type: 'hatch' },
      { name: 'Yuan Plus', type: 'suv' },
      { name: 'Song Plus', type: 'suv' },
      { name: 'Tan', type: 'suv' },
    ],
  },
  {
    name: 'GWM',
    models: [
      { name: 'Haval H6', type: 'suv' },
      { name: 'Poer', type: 'pickup' },
    ],
  },
  {
    name: 'JAC',
    models: [
      { name: 'T40', type: 'suv' },
      { name: 'T60', type: 'suv' },
      { name: 'T80', type: 'suv' },
    ],
  },
];

// Marcas de motos populares no Brasil
export const MOTORCYCLE_BRANDS = [
  {
    name: 'Honda',
    models: [
      'CG 160',
      'CG 160 Titan',
      'CG 160 Start',
      'Biz 125',
      'Pop 110i',
      'CB 250F Twister',
      'XRE 190',
      'Bros 160',
      'PCX',
      'ADV 150',
      'CB 500F',
      'CB 500X',
    ],
  },
  {
    name: 'Yamaha',
    models: [
      'Factor 150',
      'Fazer 150',
      'YBR 125',
      'Crosser 150',
      'Lander 250',
      'XTZ 150',
      'MT-03',
      'MT-07',
      'Nmax',
    ],
  },
  {
    name: 'Suzuki',
    models: [
      'Intruder 150',
      'GSX-S 150',
      'Burgman 125',
      'V-Strom 250',
    ],
  },
  {
    name: 'Dafra',
    models: [
      'Apache 160',
      'Citycom 300i',
      'Maxsym 400',
      'Next 250',
    ],
  },
  {
    name: 'Shineray',
    models: [
      'Jet 50',
      'Phoenix 50',
      'Explorer 150',
      'Work 125',
    ],
  },
  {
    name: 'Kawasaki',
    models: [
      'Z400',
      'Ninja 400',
      'Versys-X 300',
    ],
  },
];

// Tipos de veículos
export const VEHICLE_TYPES = [
  { value: 'moto', label: 'Moto', icon: '🏍️' },
  { value: 'carro', label: 'Carro', icon: '🚗' },
  { value: 'bicicleta', label: 'Bicicleta', icon: '🚴' },
  { value: 'caminhao', label: 'Caminhão', icon: '🚚' },
  { value: 'outro', label: 'Outro', icon: '🚙' },
];

// Cores populares
export const VEHICLE_COLORS = [
  'Branco',
  'Preto',
  'Prata',
  'Cinza',
  'Vermelho',
  'Azul',
  'Verde',
  'Amarelo',
  'Bege',
  'Marrom',
  'Laranja',
  'Dourado',
  'Outro',
];

// Helper functions
export function getModelsByBrand(brandName: string, isMotorcycle: boolean = false) {
  const brands = isMotorcycle ? MOTORCYCLE_BRANDS : VEHICLE_BRANDS;
  const brand = brands.find(b => b.name === brandName);
  
  if (!brand) return [];
  
  if (isMotorcycle) {
    return (brand as any).models; // Array de strings para motos
  }
  
  return (brand as VehicleBrand).models.map(m => m.name);
}

export function getAllBrands(isMotorcycle: boolean = false) {
  const brands = isMotorcycle ? MOTORCYCLE_BRANDS : VEHICLE_BRANDS;
  return brands.map(b => b.name).sort();
}

