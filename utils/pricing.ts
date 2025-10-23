// Sistema de cálculo de preços do XiquêGo

export interface RideExtras {
  bagagem?: boolean;
  pets?: boolean;
  prioridade?: boolean;
  assistenciaIdoso?: boolean;
  volumoso?: boolean;
}

export type ServiceType = 'comum' | 'expressa' | 'bagagem' | 'pets' | 'moto' | 'mototaxi' | 
                         'entrega_carro' | 'entrega_moto' | 'entrega_bicicleta';

export interface RideDetails {
  distanceKm: number;
  serviceType: ServiceType;
  extras?: RideExtras;
}

// Preços base por km
const BASE_PRICE_PER_KM = 2.5;
const MIN_PRICE = 5.0;

// Multiplicadores por tipo de serviço
const SERVICE_MULTIPLIERS: Record<ServiceType, number> = {
  comum: 1.0,           // Carro - corrida padrão
  moto: 0.9,            // Moto - mais econômico
  mototaxi: 0.8,        // Mototáxi - mais barato
  expressa: 1.5,        // Prioridade
  bagagem: 1.3,         // Com bagagem
  pets: 1.2,            // Com pets
  entrega_carro: 1.4,   // Entrega grande (carro)
  entrega_moto: 1.0,    // Entrega média (moto)
  entrega_bicicleta: 0.7, // Entrega pequena (bicicleta)
};

// Preços extras
const EXTRA_PRICES = {
  bagagem: 3.0,
  pets: 2.0,
  prioridade: 5.0,
  assistenciaIdoso: 4.0,
  volumoso: 4.0,
};

/**
 * Calcula o preço estimado da corrida
 */
export function calculateRidePrice(details: RideDetails): number {
  const { distanceKm, serviceType, extras } = details;

  // Preço base pela distância
  let price = distanceKm * BASE_PRICE_PER_KM;

  // Aplica multiplicador do tipo de serviço
  price *= SERVICE_MULTIPLIERS[serviceType] || 1.0;

  // Adiciona preços extras
  if (extras) {
    if (extras.bagagem) price += EXTRA_PRICES.bagagem;
    if (extras.pets) price += EXTRA_PRICES.pets;
    if (extras.prioridade) price += EXTRA_PRICES.prioridade;
    if (extras.assistenciaIdoso) price += EXTRA_PRICES.assistenciaIdoso;
    if (extras.volumoso) price += EXTRA_PRICES.volumoso;
  }

  // Garante preço mínimo
  return Math.max(price, MIN_PRICE);
}

/**
 * Calcula a comissão da empresa (2%)
 */
export function calculateCommission(ridePrice: number): number {
  return ridePrice * 0.02;
}

/**
 * Calcula o valor que o motorista recebe (98%)
 */
export function calculateDriverEarnings(ridePrice: number): number {
  return ridePrice - calculateCommission(ridePrice);
}

/**
 * Calcula a taxa de cancelamento (1%)
 */
export function calculateCancellationFee(ridePrice: number): number {
  return ridePrice * 0.01;
}

/**
 * Estima a distância entre dois pontos (simulação simplificada)
 * Em produção, usar API de mapas real
 */
export function estimateDistance(origin: string, destination: string): number {
  // Simulação: retorna distância aleatória entre 2 e 15 km
  // Em produção, usar Google Maps Distance Matrix API ou similar
  const baseDistance = Math.random() * 13 + 2;
  return Math.round(baseDistance * 10) / 10;
}

/**
 * Estima o tempo de viagem em minutos
 */
export function estimateDuration(distanceKm: number): number {
  // Assume velocidade média de 30 km/h em área urbana
  const hours = distanceKm / 30;
  return Math.round(hours * 60);
}

