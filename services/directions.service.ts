/**
 * Serviço de Direções e Rotas - Google Directions API
 * Calcula rotas reais pelas ruas com instruções de navegação
 */

import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import Constants from 'expo-constants';

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 
                             process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 
                             '';

export interface RouteStep {
  instruction: string;           // "Vire à direita na Rua ABC"
  distance: number;              // Distância em metros
  duration: number;              // Tempo em segundos
  startLocation: {
    lat: number;
    lng: number;
  };
  endLocation: {
    lat: number;
    lng: number;
  };
  maneuver?: string;             // "turn-right", "turn-left", etc.
}

export interface RouteInfo {
  distance: number;              // Distância total em km
  duration: number;              // Tempo total em minutos
  polyline: string;              // Polyline codificada para desenhar no mapa
  steps: RouteStep[];            // Passos da navegação
  bounds: {                      // Limites do mapa
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
}

/**
 * Calcula a rota real entre dois pontos usando Google Directions API
 */
export async function getRoute(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number },
  mode: 'driving' | 'walking' | 'bicycling' = 'driving'
): Promise<RouteInfo> {
  try {
    const originStr = `${origin.latitude},${origin.longitude}`;
    const destinationStr = `${destination.latitude},${destination.longitude}`;

    const url = `https://maps.googleapis.com/maps/api/directions/json?` +
      `origin=${originStr}&` +
      `destination=${destinationStr}&` +
      `mode=${mode}&` +
      `language=pt-BR&` +
      `key=${GOOGLE_MAPS_API_KEY}`;

    console.log('🗺️ Buscando rota:', { origin: originStr, destination: destinationStr });

    const response = await fetch(url);
    const data: any = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Directions API error: ${data.status}`);
    }

    const route = data.routes[0];
    const leg = route.legs[0];

    // Extrair steps com instruções
    const steps: RouteStep[] = leg.steps.map((step: any) => ({
      instruction: step.html_instructions
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"'),
      distance: step.distance.value,
      duration: step.duration.value,
      startLocation: step.start_location,
      endLocation: step.end_location,
      maneuver: step.maneuver,
    }));

    const routeInfo: RouteInfo = {
      distance: leg.distance.value / 1000, // Converter para km
      duration: leg.duration.value / 60,   // Converter para minutos
      polyline: route.overview_polyline.points,
      steps,
      bounds: route.bounds,
    };

    console.log('✅ Rota calculada:', {
      distance: `${routeInfo.distance.toFixed(1)} km`,
      duration: `${Math.round(routeInfo.duration)} min`,
      steps: routeInfo.steps.length,
    });

    return routeInfo;
  } catch (error) {
    console.error('❌ Erro ao calcular rota:', error);
    throw error;
  }
}

/**
 * Decodifica uma polyline do Google Maps para array de coordenadas
 */
export function decodePolyline(encoded: string): Array<{ latitude: number; longitude: number }> {
  const points: Array<{ latitude: number; longitude: number }> = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return points;
}

/**
 * Calcula a distância entre dois pontos em metros
 */
export function calculateDistance(
  point1: { latitude: number; longitude: number },
  point2: { latitude: number; longitude: number }
): number {
  const R = 6371000; // Raio da Terra em metros
  const dLat = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const dLon = ((point2.longitude - point1.longitude) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.latitude * Math.PI) / 180) *
      Math.cos((point2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Verifica qual step da navegação o usuário está atualmente
 */
export function getCurrentStep(
  currentLocation: { latitude: number; longitude: number },
  steps: RouteStep[]
): number {
  let closestStepIndex = 0;
  let minDistance = Infinity;

  steps.forEach((step, index) => {
    const distance = calculateDistance(currentLocation, {
      latitude: step.startLocation.lat,
      longitude: step.startLocation.lng,
    });

    if (distance < minDistance) {
      minDistance = distance;
      closestStepIndex = index;
    }
  });

  return closestStepIndex;
}

/**
 * Fala uma instrução de navegação (Text-to-Speech)
 */
export async function speakInstruction(instruction: string, language: string = 'pt-BR') {
  try {
    // Limpar instrução para melhor pronúncia
    const cleanInstruction = instruction
      .replace(/km/g, 'quilômetros')
      .replace(/m\b/g, 'metros')
      .replace(/R\./g, 'Rua')
      .replace(/Av\./g, 'Avenida');

    await Speech.speak(cleanInstruction, {
      language,
      pitch: 1.0,
      rate: 0.9,
    });
  } catch (error) {
    console.error('Erro ao falar instrução:', error);
  }
}

/**
 * Para a fala em andamento
 */
export function stopSpeaking() {
  Speech.stop();
}

/**
 * Verifica se deve anunciar a próxima instrução
 * Anuncia quando estiver a 50 metros do ponto de virada
 */
export function shouldAnnounceStep(
  currentLocation: { latitude: number; longitude: number },
  nextStep: RouteStep,
  lastAnnouncedStepIndex: number,
  currentStepIndex: number
): boolean {
  if (currentStepIndex === lastAnnouncedStepIndex) {
    return false; // Já foi anunciado
  }

  const distanceToStep = calculateDistance(currentLocation, {
    latitude: nextStep.startLocation.lat,
    longitude: nextStep.startLocation.lng,
  });

  // Anunciar quando estiver a menos de 50 metros
  return distanceToStep < 50;
}

/**
 * Formata a distância para exibição
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Formata o tempo para exibição
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}min`;
}

/**
 * Obtém o ícone de manobra
 */
export function getManeuverIcon(maneuver?: string): string {
  const icons: Record<string, string> = {
    'turn-left': '↰',
    'turn-right': '↱',
    'turn-slight-left': '↖',
    'turn-slight-right': '↗',
    'turn-sharp-left': '⤴',
    'turn-sharp-right': '⤵',
    'uturn-left': '⤶',
    'uturn-right': '⤷',
    'keep-left': '⬅',
    'keep-right': '➡',
    'merge': '🔀',
    'roundabout-left': '🔄',
    'roundabout-right': '🔄',
    'straight': '⬆',
    'ramp-left': '↰',
    'ramp-right': '↱',
    'fork-left': '⬅',
    'fork-right': '➡',
  };

  return icons[maneuver || ''] || '⬆';
}

export default {
  getRoute,
  decodePolyline,
  calculateDistance,
  getCurrentStep,
  speakInstruction,
  stopSpeaking,
  shouldAnnounceStep,
  formatDistance,
  formatDuration,
  getManeuverIcon,
};

