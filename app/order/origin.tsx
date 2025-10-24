/**
 * Tela: Origem - Google Maps REAL + Autocomplete
 * Permite pedir para outra pessoa
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
  TextInput,
  ScrollView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS } from '@/constants/colors';
import { useOrder } from '@/contexts/OrderContext';
import { GooglePlacesInput } from '@/components/google-places-input';

export default function OriginSelectionScreen() {
  const router = useRouter();
  const { order, setOrigin } = useOrder();
  
  const [region, setRegion] = useState({
    latitude: -10.8236, // Xique-Xique padrão
    longitude: -42.7273,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  
  const [markerPosition, setMarkerPosition] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Opção: Pedir para outra pessoa
  const [pedirParaOutraPessoa, setPedirParaOutraPessoa] = useState(false);
  const [nomeOutraPessoa, setNomeOutraPessoa] = useState('');
  const [telefoneOutraPessoa, setTelefoneOutraPessoa] = useState('');

  useEffect(() => {
    if (order?.origin) {
      setMarkerPosition({
        latitude: order.origin.latitude,
        longitude: order.origin.longitude,
      });
      setSelectedAddress(order.origin.address);
    }
  }, [order?.origin]);

  const handleUseCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'Por favor, conceda permissão de localização para usar esta funcionalidade.'
        );
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setMarkerPosition(coords);
      setRegion({
        ...region,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      // Reverse geocoding para pegar endereço
      const address = await Location.reverseGeocodeAsync(coords);
      if (address[0]) {
        const addr = address[0];
        const fullAddress = `${addr.street || ''}, ${addr.subregion || addr.city || ''}, ${addr.region || ''} - ${addr.country || ''}`;
        setSelectedAddress(fullAddress);
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível obter sua localização. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleConfirm = () => {
    if (!markerPosition || !selectedAddress) {
      Alert.alert('Erro', 'Por favor, selecione um local de origem.');
      return;
    }

    if (pedirParaOutraPessoa) {
      if (!nomeOutraPessoa.trim() || !telefoneOutraPessoa.trim()) {
        Alert.alert(
          'Dados incompletos',
          'Por favor, preencha o nome e telefone da pessoa para quem você está pedindo.'
        );
        return;
      }
    }

    setOrigin({
      latitude: markerPosition.latitude,
      longitude: markerPosition.longitude,
      address: selectedAddress,
      requestedFor: pedirParaOutraPessoa ? {
        name: nomeOutraPessoa,
        phone: telefoneOutraPessoa,
      } : undefined,
    });

    router.push('/order/destination');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Onde você está?',
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
        showsMyLocationButton={false}
      >
        {markerPosition && (
          <Marker
            coordinate={markerPosition}
            draggable
            onDragEnd={(e) => {
              setMarkerPosition(e.nativeEvent.coordinate);
            }}
          />
        )}
      </MapView>

      {/* Painel inferior */}
      <View style={styles.bottomPanel}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Definir ponto de partida</Text>

          {/* Google Places Autocomplete */}
          <GooglePlacesInput
            placeholder="Buscar endereço..."
            onPlaceSelected={handlePlaceSelected}
            defaultValue={selectedAddress}
          />

          {/* Botão Localização Atual */}
          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={handleUseCurrentLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="locate" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.currentLocationText}>Usar minha localização atual</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Opção: Pedir para outra pessoa */}
          <View style={styles.switchContainer}>
            <View style={styles.switchLabel}>
              <Ionicons name="person-add" size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
              <Text style={styles.switchText}>Pedir para outra pessoa</Text>
            </View>
            <Switch
              value={pedirParaOutraPessoa}
              onValueChange={setPedirParaOutraPessoa}
              trackColor={{ false: '#ccc', true: COLORS.primaryLight }}
              thumbColor={pedirParaOutraPessoa ? COLORS.primary : '#f4f3f4'}
            />
          </View>

          {pedirParaOutraPessoa && (
            <View style={styles.extraInfoContainer}>
              <Text style={styles.extraInfoLabel}>Dados da pessoa:</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="#999"
                value={nomeOutraPessoa}
                onChangeText={setNomeOutraPessoa}
              />
              <TextInput
                style={styles.input}
                placeholder="Telefone (com DDD)"
                placeholderTextColor="#999"
                value={telefoneOutraPessoa}
                onChangeText={setTelefoneOutraPessoa}
                keyboardType="phone-pad"
              />
              <Text style={styles.extraInfoNote}>
                💡 A corrida será solicitada em nome dessa pessoa
              </Text>
            </View>
          )}

          {/* Endereço selecionado */}
          {selectedAddress && (
            <View style={styles.selectedAddressContainer}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.selectedAddressText} numberOfLines={2}>
                {selectedAddress}
              </Text>
            </View>
          )}

          {/* Botão Confirmar */}
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (!markerPosition || !selectedAddress) && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!markerPosition || !selectedAddress || loading}
          >
            <Text style={styles.confirmButtonText}>Confirmar ponto de partida</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
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
    maxHeight: '60%',
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
  currentLocationButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  currentLocationText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 16,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  extraInfoContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
  },
  extraInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#000',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  extraInfoNote: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  selectedAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  selectedAddressText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D32',
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
});
