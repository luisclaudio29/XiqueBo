import { useState, useEffect } from 'react';
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
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS } from '@/constants/colors';
import {
  ServiceType,
  RideType,
  DeliveryType,
  Location as LocationType,
  XIQUE_DISTRICTS,
  PRICING,
} from '@/types/ride.types';

export default function RequestServiceScreen() {
  const router = useRouter();
  
  // Tipo de serviço
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [rideType, setRideType] = useState<RideType | null>(null);
  const [deliveryType, setDeliveryType] = useState<DeliveryType | null>(null);
  
  // Localização
  const [origin, setOrigin] = useState<LocationType | null>(null);
  const [destination, setDestination] = useState<LocationType | null>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  
  // Busca
  const [originSearch, setOriginSearch] = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [searchingOrigin, setSearchingOrigin] = useState(false);
  const [searchingDestination, setSearchingDestination] = useState(false);
  
  // Cálculos
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (origin && destination && (rideType || deliveryType)) {
      calculateRoute();
    }
  }, [origin, destination, rideType, deliveryType]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização negada');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      // Usar localização atual como origem
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address[0]) {
        setOrigin({
          address: `${address[0].street || ''}, ${address[0].name || 'Localização Atual'}`,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          city: address[0].city || 'Xique-Xique',
          district: address[0].district,
        });
        setOriginSearch('📍 Localização Atual');
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
    }
  };

  const searchLocation = async (query: string, isOrigin: boolean) => {
    if (!query || query.length < 3) return;

    try {
      // Simular busca de endereços na região de Xique-Xique
      // Em produção, usar Google Places API
      const results = XIQUE_DISTRICTS.filter(district =>
        district.toLowerCase().includes(query.toLowerCase())
      );

      if (results.length > 0) {
        // Simulando coordenadas (em produção, usar geocoding real)
        const mockLocation: LocationType = {
          address: results[0],
          latitude: -10.8231 + Math.random() * 0.1,
          longitude: -42.7289 + Math.random() * 0.1,
          city: 'Xique-Xique',
          district: results[0],
        };

        if (isOrigin) {
          setOrigin(mockLocation);
          setOriginSearch(results[0]);
        } else {
          setDestination(mockLocation);
          setDestinationSearch(results[0]);
        }
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  const calculateRoute = async () => {
    if (!origin || !destination) return;

    setIsCalculating(true);

    try {
      // Calcular distância (Haversine)
      const R = 6371; // Raio da Terra em km
      const dLat = ((destination.latitude - origin.latitude) * Math.PI) / 180;
      const dLon = ((destination.longitude - origin.longitude) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((origin.latitude * Math.PI) / 180) *
          Math.cos((destination.latitude * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const calculatedDistance = R * c;

      setDistance(calculatedDistance);
      setDuration(Math.ceil((calculatedDistance / 40) * 60)); // ~40km/h média

      // Calcular preço
      let pricePerKm = 0;
      
      if (serviceType === 'corrida' && rideType) {
        pricePerKm = PRICING.corrida[rideType];
      } else if (serviceType === 'entrega' && deliveryType) {
        pricePerKm = PRICING.entrega[deliveryType];
      }

      const calculatedPrice = Math.max(
        calculatedDistance * pricePerKm,
        PRICING.minimumFare
      );

      setPrice(calculatedPrice);
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleConfirm = () => {
    if (!serviceType) {
      Alert.alert('Erro', 'Selecione o tipo de serviço');
      return;
    }

    if (serviceType === 'corrida' && !rideType) {
      Alert.alert('Erro', 'Selecione o tipo de corrida');
      return;
    }

    if (serviceType === 'entrega' && !deliveryType) {
      Alert.alert('Erro', 'Selecione o tipo de entrega');
      return;
    }

    if (!origin || !destination) {
      Alert.alert('Erro', 'Defina origem e destino');
      return;
    }

    // Navegar para tela de confirmação com os dados
    router.push({
      pathname: '/confirm-service',
      params: {
        serviceType,
        rideType: rideType || '',
        deliveryType: deliveryType || '',
        originAddress: origin.address,
        destinationAddress: destination.address,
        distance: distance.toFixed(2),
        duration: duration.toString(),
        price: price.toFixed(2),
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Mapa */}
      <View style={styles.mapContainer}>
        {currentLocation ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={currentLocation}
            showsUserLocation
            showsMyLocationButton
          >
            {origin && (
              <Marker
                coordinate={{
                  latitude: origin.latitude,
                  longitude: origin.longitude,
                }}
                title="Origem"
                pinColor={COLORS.primary}
              />
            )}
            {destination && (
              <Marker
                coordinate={{
                  latitude: destination.latitude,
                  longitude: destination.longitude,
                }}
                title="Destino"
                pinColor={COLORS.secondary}
              />
            )}
            {origin && destination && (
              <Polyline
                coordinates={[
                  { latitude: origin.latitude, longitude: origin.longitude },
                  { latitude: destination.latitude, longitude: destination.longitude },
                ]}
                strokeColor={COLORS.primary}
                strokeWidth={3}
              />
            )}
          </MapView>
        ) : (
          <View style={styles.loadingMap}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Carregando mapa...</Text>
          </View>
        )}
      </View>

      {/* Conteúdo */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Seleção de Serviço */}
        <Text style={styles.sectionTitle}>Tipo de Serviço</Text>
        <View style={styles.serviceTypeContainer}>
          <TouchableOpacity
            style={[
              styles.serviceTypeButton,
              serviceType === 'corrida' && styles.serviceTypeButtonActive,
            ]}
            onPress={() => {
              setServiceType('corrida');
              setDeliveryType(null);
            }}
          >
            <Ionicons
              name="car"
              size={32}
              color={serviceType === 'corrida' ? COLORS.secondary : COLORS.textLight}
            />
            <Text
              style={[
                styles.serviceTypeText,
                serviceType === 'corrida' && styles.serviceTypeTextActive,
              ]}
            >
              Corrida
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.serviceTypeButton,
              serviceType === 'entrega' && styles.serviceTypeButtonActive,
            ]}
            onPress={() => {
              setServiceType('entrega');
              setRideType(null);
            }}
          >
            <Ionicons
              name="cube"
              size={32}
              color={serviceType === 'entrega' ? COLORS.secondary : COLORS.textLight}
            />
            <Text
              style={[
                styles.serviceTypeText,
                serviceType === 'entrega' && styles.serviceTypeTextActive,
              ]}
            >
              Entrega
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tipos de Corrida */}
        {serviceType === 'corrida' && (
          <>
            <Text style={styles.sectionTitle}>Tipo de Corrida</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  rideType === 'moto' && styles.optionButtonActive,
                ]}
                onPress={() => setRideType('moto')}
              >
                <View style={styles.optionHeader}>
                  <Ionicons name="bicycle" size={24} color={COLORS.primary} />
                  <Text style={styles.optionTitle}>Moto</Text>
                </View>
                <Text style={styles.optionDescription}>Corrida rápida e econômica</Text>
                <Text style={styles.optionPrice}>R$ {PRICING.corrida.moto}/km</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  rideType === 'taxi' && styles.optionButtonActive,
                ]}
                onPress={() => setRideType('taxi')}
              >
                <View style={styles.optionHeader}>
                  <Ionicons name="car-sport" size={24} color={COLORS.primary} />
                  <Text style={styles.optionTitle}>Táxi/Carro</Text>
                </View>
                <Text style={styles.optionDescription}>Corrida confortável</Text>
                <Text style={styles.optionPrice}>R$ {PRICING.corrida.taxi}/km</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  rideType === 'expresso' && styles.optionButtonActive,
                ]}
                onPress={() => setRideType('expresso')}
              >
                <View style={styles.optionHeader}>
                  <Ionicons name="flash" size={24} color={COLORS.primary} />
                  <Text style={styles.optionTitle}>Expresso</Text>
                </View>
                <Text style={styles.optionDescription}>Urgente - prioridade máxima</Text>
                <Text style={styles.optionPrice}>R$ {PRICING.corrida.expresso}/km</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Tipos de Entrega */}
        {serviceType === 'entrega' && (
          <>
            <Text style={styles.sectionTitle}>Tipo de Entrega</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  deliveryType === 'bicicleta' && styles.optionButtonActive,
                ]}
                onPress={() => setDeliveryType('bicicleta')}
              >
                <View style={styles.optionHeader}>
                  <Ionicons name="bicycle" size={24} color={COLORS.primary} />
                  <Text style={styles.optionTitle}>Bicicleta</Text>
                </View>
                <Text style={styles.optionDescription}>Pequenas entregas urbanas</Text>
                <Text style={styles.optionPrice}>R$ {PRICING.entrega.bicicleta}/km</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  deliveryType === 'moto' && styles.optionButtonActive,
                ]}
                onPress={() => setDeliveryType('moto')}
              >
                <View style={styles.optionHeader}>
                  <Ionicons name="bicycle" size={24} color={COLORS.primary} />
                  <Text style={styles.optionTitle}>Moto</Text>
                </View>
                <Text style={styles.optionDescription}>Entregas médias e rápidas</Text>
                <Text style={styles.optionPrice}>R$ {PRICING.entrega.moto}/km</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  deliveryType === 'carro' && styles.optionButtonActive,
                ]}
                onPress={() => setDeliveryType('carro')}
              >
                <View style={styles.optionHeader}>
                  <Ionicons name="car" size={24} color={COLORS.primary} />
                  <Text style={styles.optionTitle}>Carro</Text>
                </View>
                <Text style={styles.optionDescription}>Entregas grandes</Text>
                <Text style={styles.optionPrice}>R$ {PRICING.entrega.carro}/km</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  deliveryType === 'rural' && styles.optionButtonActive,
                ]}
                onPress={() => setDeliveryType('rural')}
              >
                <View style={styles.optionHeader}>
                  <Ionicons name="leaf" size={24} color={COLORS.primary} />
                  <Text style={styles.optionTitle}>Entrega Rural</Text>
                </View>
                <Text style={styles.optionDescription}>
                  Cargas, animais (boi, vaca, bode, ovelha)
                </Text>
                <Text style={styles.optionPrice}>R$ {PRICING.entrega.rural}/km</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Origem e Destino */}
        {(rideType || deliveryType) && (
          <>
            <Text style={styles.sectionTitle}>Endereços</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
              <TextInput
                style={styles.input}
                placeholder="Origem"
                placeholderTextColor={COLORS.grayDark}
                value={originSearch}
                onChangeText={setOriginSearch}
                onSubmitEditing={() => searchLocation(originSearch, true)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="navigate" size={20} color={COLORS.secondary} />
              <TextInput
                style={styles.input}
                placeholder="Destino"
                placeholderTextColor={COLORS.grayDark}
                value={destinationSearch}
                onChangeText={setDestinationSearch}
                onSubmitEditing={() => searchLocation(destinationSearch, false)}
              />
            </View>

            {/* Sugestões de Distritos */}
            <Text style={styles.suggestionsTitle}>Distritos disponíveis:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestions}>
              {XIQUE_DISTRICTS.map((district) => (
                <TouchableOpacity
                  key={district}
                  style={styles.suggestionChip}
                  onPress={() => {
                    if (!origin || originSearch === '📍 Localização Atual') {
                      setDestinationSearch(district);
                      searchLocation(district, false);
                    } else {
                      setOriginSearch(district);
                      searchLocation(district, true);
                    }
                  }}
                >
                  <Text style={styles.suggestionText}>{district}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Resumo */}
        {origin && destination && price > 0 && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Resumo</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Distância:</Text>
              <Text style={styles.summaryValue}>{distance.toFixed(1)} km</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tempo estimado:</Text>
              <Text style={styles.summaryValue}>{duration} min</Text>
            </View>
            <View style={[styles.summaryRow, styles.priceRow]}>
              <Text style={styles.priceLabel}>Valor:</Text>
              <Text style={styles.priceValue}>R$ {price.toFixed(2)}</Text>
            </View>
            {isCalculating && (
              <ActivityIndicator size="small" color={COLORS.primary} style={styles.calculating} />
            )}
          </View>
        )}

        {/* Botão Confirmar */}
        {price > 0 && (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            disabled={isLoading}
          >
            <Text style={styles.confirmButtonText}>
              {isLoading ? 'Processando...' : 'Confirmar Pedido'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapContainer: {
    height: '40%',
  },
  map: {
    flex: 1,
  },
  loadingMap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textLight,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  serviceTypeContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  serviceTypeButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  serviceTypeButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF9E6',
  },
  serviceTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  serviceTypeTextActive: {
    color: COLORS.secondary,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
  },
  optionButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF9E6',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  optionPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  suggestions: {
    marginBottom: 24,
  },
  suggestionChip: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  priceRow: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  calculating: {
    marginTop: 12,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
});

