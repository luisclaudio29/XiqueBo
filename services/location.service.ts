/**
 * Location Service - Mock de favoritos e recentes
 */

export interface FavoriteLocation {
  id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
}

export function getFavorites(): FavoriteLocation[] {
  return [
    {
      id: '1',
      label: 'Casa',
      address: 'Av. JJ Seabra, 123 - Centro, Xique-Xique',
      latitude: -10.8236,
      longitude: -42.7273,
    },
    {
      id: '2',
      label: 'Trabalho',
      address: 'Rua Coronel Durval, 456 - Bairro Novo',
      latitude: -10.8240,
      longitude: -42.7280,
    },
  ];
}

export function getRecent(): FavoriteLocation[] {
  return [
    {
      id: '3',
      label: 'Recente',
      address: 'Praça da Matriz - Centro, Xique-Xique',
      latitude: -10.8230,
      longitude: -42.7270,
    },
  ];
}
