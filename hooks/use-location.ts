import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string | null;
  loading: boolean;
  error: string | null;
}

export function useLocation() {
  const [locationData, setLocationData] = useState<LocationData>({
    latitude: 0,
    longitude: 0,
    address: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        // Pedir permissão
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          if (isMounted) {
            setLocationData(prev => ({
              ...prev,
              loading: false,
              error: 'Permissão de localização negada',
            }));
          }
          return;
        }

        // Pegar localização atual
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        // Geocoding reverso (coordenadas → endereço)
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        const address = reverseGeocode[0];
        const formattedAddress = address
          ? `${address.street || 'Rua'}, ${address.subregion || 'Centro'} - ${address.city || 'Xique-Xique'}`
          : 'Localização Atual';

        if (isMounted) {
          setLocationData({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            address: formattedAddress,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Erro ao obter localização:', error);
        if (isMounted) {
          setLocationData(prev => ({
            ...prev,
            loading: false,
            error: 'Erro ao obter localização',
            address: 'Xique-Xique, BA',
          }));
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshLocation = async () => {
    setLocationData(prev => ({ ...prev, loading: true }));

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const address = reverseGeocode[0];
      const formattedAddress = address
        ? `${address.street || 'Rua'}, ${address.subregion || 'Centro'} - ${address.city || 'Xique-Xique'}`
        : 'Localização Atual';

      setLocationData({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: formattedAddress,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Erro ao atualizar localização:', error);
      setLocationData(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao atualizar localização',
      }));
    }
  };

  return {
    ...locationData,
    refreshLocation,
  };
}




