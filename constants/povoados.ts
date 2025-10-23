/**
 * Base de Dados Completa dos Povoados de Xique-Xique (BA)
 * Coordenadas GPS aproximadas para integração com Google Maps
 */

export interface Povoado {
  id: string;
  nome: string;
  nomeCompleto: string;
  nomePopular?: string; // Como as pessoas chamam localmente
  coordenadas: {
    latitude: number;
    longitude: number;
  };
  distanciaXiqueXique: number; // em km
  ladoRio: 'mesmo' | 'oposto'; // em relação à sede de Xique-Xique
  tempoEstimado: number; // em minutos da sede
  populacaoAprox: number;
  principais: string[]; // pontos de referência
}

/**
 * Povoados do mesmo lado do Rio São Francisco
 * (mesma margem que a sede de Xique-Xique)
 */
export const POVOADOS_XIQUE_XIQUE: Povoado[] = [
  {
    id: 'marreca-velha',
    nome: 'Marreca Velha',
    nomeCompleto: 'Povoado de Marreca Velha',
    nomePopular: 'Marreca',
    coordenadas: {
      latitude: -10.8234,
      longitude: -42.7189,
    },
    distanciaXiqueXique: 12,
    ladoRio: 'mesmo',
    tempoEstimado: 20,
    populacaoAprox: 450,
    principais: ['Igreja Católica', 'Escola Municipal', 'Posto de Saúde'],
  },
  {
    id: 'rumo-novo',
    nome: 'Rumo Novo',
    nomeCompleto: 'Povoado de Rumo Novo',
    coordenadas: {
      latitude: -10.8456,
      longitude: -42.6923,
    },
    distanciaXiqueXique: 15,
    ladoRio: 'mesmo',
    tempoEstimado: 25,
    populacaoAprox: 380,
    principais: ['Igreja', 'Escola', 'Campo de Futebol'],
  },
  {
    id: 'vacaria',
    nome: 'Vacaria',
    nomeCompleto: 'Povoado de Vacaria',
    coordenadas: {
      latitude: -10.7945,
      longitude: -42.7423,
    },
    distanciaXiqueXique: 18,
    ladoRio: 'mesmo',
    tempoEstimado: 30,
    populacaoAprox: 520,
    principais: ['Igreja', 'Escola', 'Posto de Saúde', 'Mercado'],
  },
  {
    id: 'pedra-branca',
    nome: 'Pedra Branca',
    nomeCompleto: 'Povoado de Pedra Branca',
    coordenadas: {
      latitude: -10.8623,
      longitude: -42.7756,
    },
    distanciaXiqueXique: 22,
    ladoRio: 'mesmo',
    tempoEstimado: 35,
    populacaoAprox: 310,
    principais: ['Igreja', 'Escola'],
  },
  {
    id: 'queimada',
    nome: 'Queimada',
    nomeCompleto: 'Povoado de Queimada',
    coordenadas: {
      latitude: -10.7712,
      longitude: -42.6834,
    },
    distanciaXiqueXique: 14,
    ladoRio: 'mesmo',
    tempoEstimado: 22,
    populacaoAprox: 280,
    principais: ['Igreja', 'Escola'],
  },
  {
    id: 'perto-velha',
    nome: 'Perto Velha',
    nomeCompleto: 'Povoado de Perto Velha',
    coordenadas: {
      latitude: -10.8089,
      longitude: -42.6612,
    },
    distanciaXiqueXique: 8,
    ladoRio: 'mesmo',
    tempoEstimado: 15,
    populacaoAprox: 180,
    principais: ['Igreja', 'Escola'],
  },
  {
    id: 'iguira',
    nome: 'Iguira',
    nomeCompleto: 'Povoado de Iguira',
    coordenadas: {
      latitude: -10.7823,
      longitude: -42.6445,
    },
    distanciaXiqueXique: 10,
    ladoRio: 'mesmo',
    tempoEstimado: 18,
    populacaoAprox: 220,
    principais: ['Igreja', 'Escola'],
  },
  {
    id: 'nova-iguira',
    nome: 'Nova Iguira',
    nomeCompleto: 'Povoado de Nova Iguira',
    coordenadas: {
      latitude: -10.7756,
      longitude: -42.6389,
    },
    distanciaXiqueXique: 11,
    ladoRio: 'mesmo',
    tempoEstimado: 19,
    populacaoAprox: 190,
    principais: ['Igreja', 'Escola'],
  },
  {
    id: 'rumo',
    nome: 'Rumo',
    nomeCompleto: 'Povoado de Rumo',
    coordenadas: {
      latitude: -10.8512,
      longitude: -42.6845,
    },
    distanciaXiqueXique: 16,
    ladoRio: 'mesmo',
    tempoEstimado: 26,
    populacaoAprox: 340,
    principais: ['Igreja', 'Escola', 'Posto de Saúde'],
  },
  {
    id: 'mato-grosso',
    nome: 'Mato Grosso',
    nomeCompleto: 'Povoado de Mato Grosso',
    coordenadas: {
      latitude: -10.8734,
      longitude: -42.7912,
    },
    distanciaXiqueXique: 24,
    ladoRio: 'mesmo',
    tempoEstimado: 38,
    populacaoAprox: 260,
    principais: ['Igreja', 'Escola'],
  },
  {
    id: 'vicente',
    nome: 'Vicente',
    nomeCompleto: 'Povoado de Vicente',
    coordenadas: {
      latitude: -10.7634,
      longitude: -42.6712,
    },
    distanciaXiqueXique: 13,
    ladoRio: 'mesmo',
    tempoEstimado: 21,
    populacaoAprox: 210,
    principais: ['Igreja', 'Escola'],
  },
];

/**
 * Coordenadas da sede de Xique-Xique
 */
export const SEDE_XIQUE_XIQUE = {
  latitude: -10.8234,
  longitude: -42.7256,
  nome: 'Xique-Xique (Sede)',
};

/**
 * Retorna todos os povoados como opções para seleção
 */
export function getPovoados(): Povoado[] {
  return POVOADOS_XIQUE_XIQUE;
}

/**
 * Retorna nomes dos povoados para lista suspensa (com nomes populares)
 */
export function getPovoadsNomes(): string[] {
  return POVOADOS_XIQUE_XIQUE.map(p => {
    if (p.nomePopular) {
      return `${p.nome} (${p.nomePopular})`;
    }
    return p.nome;
  }).sort();
}

/**
 * Retorna apenas o nome oficial do povoado (sem nome popular)
 */
export function getNomeOficial(nomeComPopular: string): string {
  // Remove o nome popular entre parênteses se existir
  return nomeComPopular.split(' (')[0];
}

/**
 * Busca um povoado por nome
 */
export function findPovoado(nome: string): Povoado | undefined {
  return POVOADOS_XIQUE_XIQUE.find(
    p => p.nome.toLowerCase() === nome.toLowerCase()
  );
}

/**
 * Busca um povoado por ID
 */
export function findPovoadoById(id: string): Povoado | undefined {
  return POVOADOS_XIQUE_XIQUE.find(p => p.id === id);
}

/**
 * Retorna povoados próximos a uma localização
 */
export function getPovoadsProximos(
  latitude: number,
  longitude: number,
  raioKm: number = 30
): Povoado[] {
  return POVOADOS_XIQUE_XIQUE.filter(povoado => {
    const distancia = calcularDistancia(
      latitude,
      longitude,
      povoado.coordenadas.latitude,
      povoado.coordenadas.longitude
    );
    return distancia <= raioKm;
  });
}

/**
 * Calcula distância entre dois pontos (fórmula de Haversine)
 */
function calcularDistancia(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Retorna sugestões inteligentes baseadas em texto digitado
 */
export function getSugestoesPovoados(texto: string): Povoado[] {
  if (!texto || texto.length < 2) {
    return POVOADOS_XIQUE_XIQUE.slice(0, 5); // Retorna os 5 primeiros
  }

  const textoLower = texto.toLowerCase();
  return POVOADOS_XIQUE_XIQUE.filter(povoado =>
    povoado.nome.toLowerCase().includes(textoLower)
  );
}

/**
 * Valida se é um povoado rural válido para entregas de animais/carga
 */
export function isPovoadsRural(nomePovoado: string): boolean {
  const povoado = findPovoado(nomePovoado);
  return povoado !== undefined && povoado.ladoRio === 'mesmo';
}

/**
 * Retorna lista combinada: Sede + Todos os Povoados
 */
export function getLocalidadesCompletas(): Array<{
  id: string;
  nome: string;
  tipo: 'sede' | 'povoado';
  coordenadas: { latitude: number; longitude: number };
}> {
  return [
    {
      id: 'sede',
      nome: 'Xique-Xique (Centro)',
      tipo: 'sede' as const,
      coordenadas: SEDE_XIQUE_XIQUE,
    },
    ...POVOADOS_XIQUE_XIQUE.map(p => ({
      id: p.id,
      nome: p.nomePopular ? `${p.nome} (${p.nomePopular})` : p.nome,
      tipo: 'povoado' as const,
      coordenadas: p.coordenadas,
    })),
  ];
}

/**
 * Detecta o povoado mais próximo baseado na localização GPS atual
 */
export function detectarPovoadoProximo(
  latitude: number,
  longitude: number,
  raioMaximoKm: number = 5
): { povoado: Povoado | null; distancia: number; dentroDaArea: boolean } {
  let menorDistancia = Infinity;
  let povoadoMaisProximo: Povoado | null = null;

  // Verifica distância até a sede
  const distanciaSede = calcularDistancia(
    latitude,
    longitude,
    SEDE_XIQUE_XIQUE.latitude,
    SEDE_XIQUE_XIQUE.longitude
  );

  if (distanciaSede < raioMaximoKm) {
    return {
      povoado: null, // null significa que está na sede
      distancia: distanciaSede,
      dentroDaArea: true,
    };
  }

  // Verifica cada povoado
  for (const povoado of POVOADOS_XIQUE_XIQUE) {
    const distancia = calcularDistancia(
      latitude,
      longitude,
      povoado.coordenadas.latitude,
      povoado.coordenadas.longitude
    );

    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      povoadoMaisProximo = povoado;
    }
  }

  return {
    povoado: povoadoMaisProximo,
    distancia: menorDistancia,
    dentroDaArea: menorDistancia <= raioMaximoKm,
  };
}

/**
 * Retorna uma descrição amigável da localização detectada
 */
export function getDescricaoLocalizacao(
  latitude: number,
  longitude: number
): string {
  const deteccao = detectarPovoadoProximo(latitude, longitude);

  if (!deteccao.dentroDaArea) {
    return `Você está a ${deteccao.distancia.toFixed(1)}km do povoado mais próximo`;
  }

  if (!deteccao.povoado) {
    return 'Você está em Xique-Xique (Centro)';
  }

  const nomeCompleto = deteccao.povoado.nomePopular
    ? `${deteccao.povoado.nome} (${deteccao.povoado.nomePopular})`
    : deteccao.povoado.nome;

  return `Você está em ${nomeCompleto}`;
}

