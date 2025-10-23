import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS } from '@/constants/colors';
import { getPovoads, SEDE_XIQUE_XIQUE } from '@/constants/povoados';

interface MapViewComponentProps {
  origin?: string;
  destination?: string;
  onLocationSelected?: (location: { latitude: number; longitude: number; address: string }) => void;
}

export function MapViewComponent({ origin, destination, onLocationSelected }: MapViewComponentProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Coordenadas de Xique-Xique, BA
  const XIQUE_XIQUE_COORDS = {
    latitude: -10.8236,
    longitude: -42.7273,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada');
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (error) {
        console.log('Erro ao obter localização:', error);
        setErrorMsg('Não foi possível obter sua localização');
      }
    })();
  }, []);

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
    try {
      // Em produção, usar Geocoding reverso para obter endereço
      const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      
      if (onLocationSelected) {
        onLocationSelected({ latitude, longitude, address });
      }
    } catch (error) {
      console.log('Erro ao processar localização:', error);
    }
  };

  const centerOnUserLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização');
    }
  };

  const initialRegion = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : XIQUE_XIQUE_COORDS;

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
        <Text style={styles.errorSubtext}>
          O mapa mostrará a região de Xique-Xique
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        onPress={handleMapPress}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Você está aqui"
            pinColor={COLORS.primary}
          />
        )}
        
        {/* Marcador da Sede de Xique-Xique */}
        <Marker
          coordinate={SEDE_XIQUE_XIQUE}
          title="Xique-Xique (Sede)"
          description="Centro da cidade"
          pinColor="#FFB800"
        />
        
        {/* Marcadores dos Povoados */}
        {getPovoads().map((povoado) => (
          <Marker
            key={povoado.id}
            coordinate={povoado.coordenadas}
            title={povoado.nome}
            description={`${povoado.distanciaXiqueXique}km da sede • ${povoado.tempoEstimado}min`}
            pinColor="#4ECDC4"
          />
        ))}
      </MapView>

      {/* Location Button */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={centerOnUserLocation}
      >
        <Text style={styles.locationButtonText}>📍</Text>
      </TouchableOpacity>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📍 Cobertura XiquêGo</Text>
        <Text style={styles.infoText}>
          Xique-Xique e região: Perto Velha, Iguira, Nova Iguira, Rumo, Mato Grosso, Vicente e mais
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  locationButton: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  locationButtonText: {
    fontSize: 24,
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },
});





