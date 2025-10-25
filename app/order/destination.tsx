/**
 * Tela: Destino - Google Maps REAL + Autocomplete
 * Funciona em qualquer lugar do Brasil
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS } from '@/constants/colors';
import { useOrder } from '@/contexts/OrderContext';
import { AddressAutocomplete } from '@/components/address-autocomplete';

export default function DestinationSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const returnTo = params.returnTo as string;
  const { order, setDestination, calculateRoute } = useOrder();
  
  const [region, setRegion] = useState({
    latitude: order?.origin?.latitude || -10.8236,
    longitude: order?.origin?.longitude || -42.7273,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  
  const [markerPosition, setMarkerPosition] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (order?.destination) {
      setMarkerPosition({
        latitude: order.destination.latitude,
        longitude: order.destination.longitude,
      });
      setSelectedAddress(order.destination.address);
    }
  }, [order?.destination]);

  const handlePlaceSelected = (data: any, details: any) => {
    if (details && details.geometry) {
      const { lat, lng } = details.geometry.location;
      const coords = {
        latitude: lat,
        longitude: lng,
      };

      setMarkerPosition(coords);
      setRegion({
        ...region,
        latitude: lat,
        longitude: lng,
      });
      setSelectedAddress(details.formatted_address || data.description);
    }
  };

  const handleConfirm = async () => {
    if (!markerPosition || !selectedAddress) {
      Alert.alert('Erro', 'Por favor, selecione um local de destino.');
      return;
    }

    if (!order?.origin) {
      Alert.alert('Erro', 'Origem não definida. Por favor, volte e defina a origem primeiro.');
      return;
    }

    // Validar coordenadas
    if (!markerPosition.latitude || !markerPosition.longitude) {
      Alert.alert('Erro', 'Coordenadas do destino inválidas. Selecione novamente no mapa.');
      return;
    }

    setDestination({
      latitude: markerPosition.latitude,
      longitude: markerPosition.longitude,
      address: selectedAddress,
    });

    // Calcular rota
    setIsCalculating(true);
    try {
      await calculateRoute();
      
      // Se veio da tela única Uber, volta para lá
      if (returnTo) {
        router.back();
      } else {
        // Senão, vai para tela de detalhes/extras
        router.push('/order/details');
      }
    } catch (error: any) {
      Alert.alert(
        'Erro ao calcular rota',
        error.message || 'Não foi possível calcular a rota. Verifique se os pontos estão corretos e tente novamente.'
      );
    } finally {
      setIsCalculating(false);
    }
  };

  if (!order?.origin) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Por favor, defina a origem primeiro.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Para onde vai?',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#FFF',
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Mapa */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
      >
        {/* Marker de Origem */}
        {order.origin && (
          <Marker
            coordinate={{
              latitude: order.origin.latitude,
              longitude: order.origin.longitude,
            }}
            pinColor="green"
            title="Origem"
          />
        )}

        {/* Marker de Destino */}
        {markerPosition && (
          <Marker
            coordinate={markerPosition}
            draggable
            onDragEnd={(e) => {
              setMarkerPosition(e.nativeEvent.coordinate);
            }}
            pinColor="red"
            title="Destino"
          />
        )}

        {/* Polyline da Rota - Linha mostrando o caminho */}
        {order.origin && markerPosition && (
          <Polyline
            coordinates={[
              { 
                latitude: order.origin.latitude, 
                longitude: order.origin.longitude 
              },
              { 
                latitude: markerPosition.latitude, 
                longitude: markerPosition.longitude 
              },
            ]}
            strokeColor={COLORS.primary}
            strokeWidth={4}
            lineDashPattern={[1]}
          />
        )}
      </MapView>

      {/* Painel inferior */}
      <View style={styles.bottomPanel}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
          nestedScrollEnabled={true}
        >
          <Text style={styles.title}>Definir destino</Text>

          {/* Origem confirmada */}
          <View style={styles.originCard}>
            <Ionicons name="navigate-circle" size={20} color="#4CAF50" />
            <View style={styles.originInfo}>
              <Text style={styles.originLabel}>Origem</Text>
              <Text style={styles.originAddress} numberOfLines={1}>
                {order.origin.address}
              </Text>
            </View>
          </View>

          {/* ✅ Autocomplete de Endereços - BIBLIOTECA NATIVA! */}
          <AddressAutocomplete
            placeholder="Digite rua, número ou local de destino..."
            icon="navigate"
            iconColor="#FF5722"
            onLocationSelect={(location) => {
              const coords = {
                latitude: location.latitude,
                longitude: location.longitude,
              };
              setMarkerPosition(coords);
              setRegion({
                ...region,
                latitude: location.latitude,
                longitude: location.longitude,
              });
              setSelectedAddress(location.fullAddress);
            }}
            defaultValue={selectedAddress}
          />

          {/* Sugestões rápidas */}
          <View style={styles.quickSuggestions}>
            <Text style={styles.quickSuggestionsTitle}>Sugestões:</Text>
            <TouchableOpacity
              style={styles.suggestionChip}
              onPress={() => {
                // Mock: Casa
                Alert.alert('Em breve', 'Endereços favoritos em desenvolvimento.');
              }}
            >
              <Ionicons name="home" size={16} color={COLORS.primary} />
              <Text style={styles.suggestionChipText}>Casa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.suggestionChip}
              onPress={() => {
                // Mock: Trabalho
                Alert.alert('Em breve', 'Endereços favoritos em desenvolvimento.');
              }}
            >
              <Ionicons name="briefcase" size={16} color={COLORS.primary} />
              <Text style={styles.suggestionChipText}>Trabalho</Text>
            </TouchableOpacity>
          </View>

          {/* Endereço selecionado */}
          {selectedAddress && (
            <View style={styles.selectedAddressContainer}>
              <Ionicons name="checkmark-circle" size={20} color="#FF5722" />
              <Text style={styles.selectedAddressText} numberOfLines={2}>
                {selectedAddress}
              </Text>
            </View>
          )}

          {/* Botão Confirmar */}
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (!markerPosition || !selectedAddress || isCalculating) && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!markerPosition || !selectedAddress || isCalculating}
          >
            {isCalculating ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.confirmButtonText}>Confirmar destino</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  map: {
    flex: 1,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '75%', // ✅ Aumentado para ver mais conteúdo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  originCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  originInfo: {
    flex: 1,
    marginLeft: 10,
  },
  originLabel: {
    fontSize: 12,
    color: '#2E7D32',
    marginBottom: 4,
  },
  originAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B5E20',
  },
  quickSuggestions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  quickSuggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 12,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  suggestionChipText: {
    fontSize: 13,
    color: COLORS.primary,
    marginLeft: 6,
    fontWeight: '600',
  },
  selectedAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E0',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  selectedAddressText: {
    flex: 1,
    fontSize: 14,
    color: '#D84315',
    marginLeft: 8,
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  confirmButtonDisabled: {
    backgroundColor: '#CCC',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
