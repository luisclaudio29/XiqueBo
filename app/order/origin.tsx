/**
 * Tela: Selecionar Origem
 * Segunda etapa do fluxo
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS } from '@/constants/colors';
import { useOrder } from '@/contexts/OrderContext';
import { getFavorites } from '@/services/location.service';

export default function SelectOriginScreen() {
  const router = useRouter();
  const { order, setOrigin } = useOrder();
  
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    checkLocationPermission();
    loadSuggestions();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setLocationPermission(status === 'granted');
  };

  const loadSuggestions = () => {
    // Mock: endereços favoritos e recentes
    const favorites = [
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

    const recents = [
      {
        id: '3',
        label: 'Recente',
        address: 'Praça da Matriz - Centro, Xique-Xique',
        latitude: -10.8230,
        longitude: -42.7270,
      },
    ];

    setSuggestions([...favorites, ...recents]);
  };

  const handleUseCurrentLocation = async () => {
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Para usar sua localização atual, habilite a permissão de localização nas configurações.'
        );
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Mock: reverse geocoding
      const address = `Rua Exemplo, ${Math.floor(Math.random() * 1000)} - Xique-Xique, BA`;

      handleSelectLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address,
        label: 'Minha localização',
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLocation = (location: any) => {
    if (!location.latitude || !location.longitude || !location.address) {
      Alert.alert('Erro', 'Localização inválida.');
      return;
    }

    setOrigin({
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
      label: location.label,
    });

    router.push('/order/destination');
  };

  const handleManualEntry = () => {
    if (!searchText.trim()) {
      Alert.alert('Atenção', 'Digite um endereço para continuar.');
      return;
    }

    // Mock: geocoding do texto digitado
    handleSelectLocation({
      latitude: -10.8236 + (Math.random() - 0.5) * 0.01,
      longitude: -42.7273 + (Math.random() - 0.5) * 0.01,
      address: searchText,
      label: undefined,
    });
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum pedido em andamento</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>De onde você está saindo?</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Campo de busca */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIcon}>
            <Ionicons name="search" size={20} color="#999" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Digite o endereço de origem..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleManualEntry}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Botão usar localização atual */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={handleUseCurrentLocation}
          disabled={loading}
        >
          <View style={styles.currentLocationIcon}>
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Ionicons name="locate" size={24} color={COLORS.primary} />
            )}
          </View>
          <View style={styles.currentLocationInfo}>
            <Text style={styles.currentLocationTitle}>
              Usar minha localização atual
            </Text>
            <Text style={styles.currentLocationSubtitle}>
              {locationPermission ? 'GPS ativado' : 'Permissão necessária'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* Sugestões */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Sugestões</Text>

          {suggestions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.suggestionItem}
              onPress={() => handleSelectLocation(item)}
            >
              <View style={styles.suggestionIcon}>
                <Ionicons
                  name={
                    item.label === 'Casa'
                      ? 'home'
                      : item.label === 'Trabalho'
                      ? 'briefcase'
                      : 'time'
                  }
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.suggestionInfo}>
                <Text style={styles.suggestionLabel}>{item.label}</Text>
                <Text style={styles.suggestionAddress}>{item.address}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFF',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    color: '#000',
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentLocationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currentLocationInfo: {
    flex: 1,
  },
  currentLocationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  currentLocationSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  suggestionsContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  suggestionAddress: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

