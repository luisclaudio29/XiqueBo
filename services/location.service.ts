// Lugares populares de Xique-Xique e região
export const popularPlaces = [
  // Centro e principais avenidas
  { id: '1', name: 'Centro', address: 'Praça da Matriz, Centro - Xique-Xique', icon: '🔥', category: 'popular' },
  { id: '2', name: 'Av. Getúlio Vargas', address: 'Avenida Getúlio Vargas - Xique-Xique', icon: '🔥', category: 'popular' },
  { id: '3', name: 'Praça da Matriz', address: 'Praça da Matriz, Centro - Xique-Xique', icon: '⛪', category: 'popular' },
  
  // Hospitais e saúde
  { id: '4', name: 'Hospital Municipal', address: 'Rua da Saúde, 789 - Xique-Xique', icon: '🏥', category: 'health' },
  { id: '5', name: 'Clínica São Lucas', address: 'Av. Principal, 456 - Xique-Xique', icon: '🏥', category: 'health' },
  { id: '6', name: 'UBS Centro', address: 'Rua da Saúde, Centro - Xique-Xique', icon: '⚕️', category: 'health' },
  
  // Escolas
  { id: '7', name: 'Colégio Estadual', address: 'Av. da Educação, 321 - Xique-Xique', icon: '🏫', category: 'education' },
  { id: '8', name: 'Escola Municipal', address: 'Rua das Crianças, 654 - Xique-Xique', icon: '🏫', category: 'education' },
  
  // Lazer e eventos
  { id: '9', name: 'Parque Aquático Xique-Xique', address: 'Estrada do Parque - Xique-Xique', icon: '🏊', category: 'leisure' },
  { id: '10', name: 'Clube Social', address: 'Rua do Lazer, Centro - Xique-Xique', icon: '🎉', category: 'leisure' },
  
  // Restaurantes
  { id: '11', name: 'Churrascaria Boi na Brasa', address: 'Av. Principal, 123 - Xique-Xique', icon: '🍖', category: 'restaurant' },
  { id: '12', name: 'Pizzaria La Bella', address: 'Rua das Pizzas, 789 - Xique-Xique', icon: '🍕', category: 'restaurant' },
  
  // Comidas famosas
  { id: '13', name: 'Barraca do Seu João', address: 'Praça da Feira - Xique-Xique', icon: '🍔', category: 'food' },
  { id: '14', name: 'Pastelaria da Praça', address: 'Praça da Matriz - Xique-Xique', icon: '🥟', category: 'food' },
  { id: '15', name: 'Tapiocaria da Maria', address: 'Rua da Tapioca, Centro - Xique-Xique', icon: '🫓', category: 'food' },
  
  // Povoados
  { id: '16', name: 'Perto Velha', address: 'Povoado Perto Velha - Xique-Xique', icon: '🏘️', category: 'village' },
  { id: '17', name: 'Iguira', address: 'Povoado Iguira - Xique-Xique', icon: '🏘️', category: 'village' },
  { id: '18', name: 'Nova Iguira', address: 'Povoado Nova Iguira - Xique-Xique', icon: '🏘️', category: 'village' },
  { id: '19', name: 'Rumo', address: 'Povoado Rumo - Xique-Xique', icon: '🏘️', category: 'village' },
  { id: '20', name: 'Mato Grosso', address: 'Povoado Mato Grosso - Xique-Xique', icon: '🏘️', category: 'village' },
  { id: '21', name: 'Vicente', address: 'Povoado Vicente - Xique-Xique', icon: '🏘️', category: 'village' },
  
  // Mercados e comércio
  { id: '22', name: 'Feira Municipal', address: 'Praça da Feira - Xique-Xique', icon: '🛒', category: 'shopping' },
  { id: '23', name: 'Mercado Central', address: 'Rua do Comércio - Xique-Xique', icon: '🏬', category: 'shopping' },
];

// Filtrar sugestões baseadas no texto digitado
export function filterSuggestions(query: string, currentLocationAddress: string) {
  if (!query || query.length < 2) {
    // Se não digitou nada ou apenas 1 letra, mostra os favoritos
    return [
      { id: 'gps', name: '📍 Localização Atual', address: currentLocationAddress, icon: '📍', category: 'gps' },
      ...popularPlaces.slice(0, 5),
    ];
  }

  const lowerQuery = query.toLowerCase();
  
  // Filtra lugares que correspondem à busca
  const filtered = popularPlaces.filter(
    (place) =>
      place.name.toLowerCase().includes(lowerQuery) ||
      place.address.toLowerCase().includes(lowerQuery)
  );

  // Adiciona localização atual no topo
  return [
    { id: 'gps', name: '📍 Localização Atual', address: currentLocationAddress, icon: '📍', category: 'gps' },
    ...filtered.slice(0, 5),
  ];
}

// Favoritos do usuário (pode vir de AsyncStorage no futuro)
export function getFavorites() {
  return [
    { id: 'home', name: 'Casa', address: 'Rua das Flores, 123 - Xique-Xique', icon: '🏠', category: 'favorite' },
    { id: 'work', name: 'Trabalho', address: 'Av. Getúlio Vargas, 456 - Xique-Xique', icon: '💼', category: 'favorite' },
  ];
}

// Combinar GPS + favoritos + populares
export function getCombinedSuggestions(currentLocationAddress: string, query: string = '') {
  const favorites = getFavorites();
  
  if (!query || query.length < 2) {
    return [
      { id: 'gps', name: '📍 Localização Atual', address: currentLocationAddress, icon: '📍', category: 'gps' },
      ...favorites,
      ...popularPlaces.slice(0, 4),
    ];
  }

  return filterSuggestions(query, currentLocationAddress);
}




