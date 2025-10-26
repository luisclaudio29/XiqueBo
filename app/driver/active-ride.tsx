/**
 * Tela de Corrida Ativa - Motorista/Entregador
 * Navegação turn-by-turn com voz (estilo Google Maps)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Camera } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import { COLORS } from '@/constants/colors';
import DirectionsService, {
  type RouteInfo,
  type RouteStep,
} from '@/services/directions.service';

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 
                             process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 
                             '';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ActiveRideScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // 🧪 MODO TESTE: Usar coordenadas de Xique-Xique
  const TEST_MODE = true; // MUDE PARA false QUANDO TESTAR EM XIQUE-XIQUE DE VERDADE
  
  // Dados da corrida (viriam do banco de dados)
  const [rideData] = useState({
    rideId: String(params.rideId || 'ride-123'),
    passengerName: String(params.passengerName || 'João Silva'),
    passengerPhone: String(params.passengerPhone || '(74) 9999-9999'),
    origin: {
      address: params.originAddress || 'R. da Maternidade, 131 - Xique-Xique, BA',
      latitude: parseFloat(params.originLat as string) || -10.8230,
      longitude: parseFloat(params.originLng as string) || -42.7280,
    },
    destination: {
      address: params.destAddress || 'R. Cinquenta e Nove, 2-46 - Xique-Xique, BA',
      latitude: parseFloat(params.destLat as string) || -10.8250,
      longitude: parseFloat(params.destLng as string) || -42.7310,
    },
    price: parseFloat(params.price as string) || 12.50,
    paymentMethod: params.paymentMethod || 'Dinheiro',
  });

  // Estados
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [lastAnnouncedStep, setLastAnnouncedStep] = useState(-1);
  const [isLoadingRoute, setIsLoadingRoute] = useState(true);
  const [navigationStarted, setNavigationStarted] = useState(false);
  const [arrivedAtDestination, setArrivedAtDestination] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [mapViewMode, setMapViewMode] = useState<'overview' | 'navigation'>('overview');
  const [heading, setHeading] = useState(0); // Direção do movimento (0-360°)
  const [previousLocation, setPreviousLocation] = useState<any>(null);
  const [isOffRoute, setIsOffRoute] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const mapRef = useRef<MapView>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const headingSubscription = useRef<Location.LocationSubscription | null>(null);

  // Carregar rota ao montar
  useEffect(() => {
    loadRoute();
    startLocationTracking();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
      if (headingSubscription.current) {
        headingSubscription.current.remove();
      }
      DirectionsService.stopSpeaking();
    };
  }, []);

  // Atualizar navegação quando localização muda
  useEffect(() => {
    if (currentLocation && routeInfo && navigationStarted) {
      updateNavigation();
      updateCameraPosition();
      checkIfOffRoute();
    }
  }, [currentLocation, routeInfo, navigationStarted]);

  // Calcular heading (direção) baseado no movimento
  useEffect(() => {
    if (currentLocation && previousLocation && navigationStarted) {
      const calculatedHeading = calculateHeading(previousLocation, currentLocation);
      setHeading(calculatedHeading);
    }
    if (currentLocation) {
      setPreviousLocation(currentLocation);
    }
  }, [currentLocation]);

  /**
   * Carrega a rota do Google Directions API
   */
  const loadRoute = async () => {
    try {
      setIsLoadingRoute(true);
      
      const route = await DirectionsService.getRoute(
        rideData.origin,
        rideData.destination,
        'driving'
      );

      setRouteInfo(route);
      
      // Ajustar mapa para mostrar toda a rota após um pequeno delay
      setTimeout(() => {
        if (mapRef.current && route) {
          const polylineCoords = DirectionsService.decodePolyline(route.polyline);
          
          if (polylineCoords.length > 0) {
            console.log('📍 Ajustando mapa para mostrar rota completa');
            mapRef.current.fitToCoordinates(polylineCoords, {
              edgePadding: { top: 150, right: 80, bottom: 400, left: 80 },
              animated: true,
            });
          }
        }
      }, 1000);

      console.log('✅ Rota carregada:', {
        distance: route.distance,
        duration: route.duration,
        steps: route.steps.length,
        polyline: route.polyline.substring(0, 50) + '...',
      });
    } catch (error) {
      console.error('❌ Erro ao carregar rota:', error);
      Alert.alert('Erro', 'Não foi possível calcular a rota. Verifique sua conexão.');
    } finally {
      setIsLoadingRoute(false);
    }
  };

  /**
   * Inicia rastreamento da localização em tempo real
   */
  const startLocationTracking = async () => {
    try {
      // 🧪 MODO TESTE: Se está testando, usar localização FAKE de Xique-Xique
      if (TEST_MODE) {
        console.log('🧪 MODO TESTE ATIVADO: Usando localização de Xique-Xique');
        
        // Localização FAKE no meio da rota em Xique-Xique
        const fakeLocation = {
          latitude: (rideData.origin.latitude + rideData.destination.latitude) / 2,
          longitude: (rideData.origin.longitude + rideData.destination.longitude) / 2,
        };
        
        setCurrentLocation(fakeLocation);
        
        // Simular movimento ao longo da rota (para testes)
        let step = 0;
        const totalSteps = 20;
        
        locationSubscription.current = setInterval(() => {
          step++;
          if (step >= totalSteps) {
            step = 0;
          }
          
          // Interpolar entre origem e destino
          const progress = step / totalSteps;
          const lat = rideData.origin.latitude + 
                     (rideData.destination.latitude - rideData.origin.latitude) * progress;
          const lng = rideData.origin.longitude + 
                     (rideData.destination.longitude - rideData.origin.longitude) * progress;
          
          setCurrentLocation({ latitude: lat, longitude: lng });
        }, 3000) as any; // Atualizar a cada 3 segundos
        
        return;
      }
      
      // MODO REAL: Usar GPS de verdade
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Permita o acesso à localização para navegar.');
        return;
      }

      // Obter localização inicial
      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCurrentLocation({
        latitude: initialLocation.coords.latitude,
        longitude: initialLocation.coords.longitude,
      });

      // Rastrear localização continuamente
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Atualizar a cada 5 segundos
          distanceInterval: 10, // Ou quando mover 10 metros
        },
        (location) => {
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );
    } catch (error) {
      console.error('Erro ao rastrear localização:', error);
    }
  };

  /**
   * Atualiza a navegação baseado na posição atual
   */
  const updateNavigation = () => {
    if (!routeInfo || !currentLocation) return;

    // Verificar em qual passo estamos
    const newStepIndex = DirectionsService.getCurrentStep(currentLocation, routeInfo.steps);
    
    if (newStepIndex !== currentStepIndex) {
      setCurrentStepIndex(newStepIndex);
    }

    // Verificar se deve anunciar próxima instrução
    const nextStep = routeInfo.steps[newStepIndex + 1];
    if (nextStep && voiceEnabled) {
      const shouldAnnounce = DirectionsService.shouldAnnounceStep(
        currentLocation,
        nextStep,
        lastAnnouncedStep,
        newStepIndex
      );

      if (shouldAnnounce) {
        DirectionsService.speakInstruction(nextStep.instruction);
        setLastAnnouncedStep(newStepIndex);
      }
    }

    // Verificar se chegou ao destino
    const distanceToDestination = DirectionsService.calculateDistance(
      currentLocation,
      rideData.destination
    );

    if (distanceToDestination < 50 && !arrivedAtDestination) {
      setArrivedAtDestination(true);
      if (voiceEnabled) {
        DirectionsService.speakInstruction('Você chegou ao destino');
      }
    }
  };

  /**
   * Calcula o heading (direção) entre dois pontos
   */
  const calculateHeading = (from: any, to: any): number => {
    const lat1 = from.latitude * (Math.PI / 180);
    const lat2 = to.latitude * (Math.PI / 180);
    const dLng = (to.longitude - from.longitude) * (Math.PI / 180);

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
             Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    let heading = Math.atan2(y, x) * (180 / Math.PI);
    heading = (heading + 360) % 360; // Normalizar para 0-360

    return heading;
  };

  /**
   * Atualiza a posição da câmera para seguir o motorista
   */
  const updateCameraPosition = () => {
    if (!mapRef.current || !currentLocation || !navigationStarted) return;

    // Câmera em primeira pessoa com heading
    mapRef.current.animateCamera({
      center: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      },
      pitch: 65, // Ângulo mais inclinado para perspectiva 3D
      heading: heading, // Rotaciona conforme a direção do movimento
      zoom: 18, // Bem próximo para ver ruas
      altitude: 200, // Altitude da câmera
    }, { duration: 500 }); // Animação suave de 500ms
  };

  /**
   * Verifica se o motorista saiu da rota
   */
  const checkIfOffRoute = () => {
    if (!currentLocation || !routeInfo || !navigationStarted) return;

    // Calcular distância até a polyline da rota
    const polylineCoords = DirectionsService.decodePolyline(routeInfo.polyline);
    
    let minDistance = Infinity;
    for (const point of polylineCoords) {
      const distance = DirectionsService.calculateDistance(currentLocation, point);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }

    // Se está a mais de 50 metros da rota, considera fora da rota
    if (minDistance > 50 && !isOffRoute) {
      setIsOffRoute(true);
      Alert.alert(
        'Fora da Rota',
        'Você saiu da rota. Deseja recalcular?',
        [
          { text: 'Não', style: 'cancel', onPress: () => setIsOffRoute(false) },
          { text: 'Sim', onPress: recalculateRoute },
        ]
      );
    } else if (minDistance <= 50 && isOffRoute) {
      setIsOffRoute(false);
    }
  };

  /**
   * Recalcula a rota a partir da posição atual
   */
  const recalculateRoute = async () => {
    if (!currentLocation || isRecalculating) return;

    try {
      setIsRecalculating(true);
      console.log('🔄 Recalculando rota...');

      // Calcular nova rota da posição atual até o destino
      const newRoute = await DirectionsService.getRoute(
        currentLocation,
        rideData.destination,
        'driving'
      );

      setRouteInfo(newRoute);
      setCurrentStepIndex(0);
      setLastAnnouncedStep(-1);
      setIsOffRoute(false);

      if (voiceEnabled) {
        DirectionsService.speakInstruction('Rota recalculada. ' + newRoute.steps[0].instruction);
      }

      console.log('✅ Rota recalculada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao recalcular rota:', error);
      Alert.alert('Erro', 'Não foi possível recalcular a rota.');
    } finally {
      setIsRecalculating(false);
    }
  };

  /**
   * Inicia a navegação
   */
  const handleStartNavigation = () => {
    setNavigationStarted(true);
    setMapViewMode('navigation'); // Mudar para modo navegação
    
    // Mudar câmera para perspectiva 3D
    if (mapRef.current && currentLocation) {
      mapRef.current.animateCamera({
        center: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        pitch: 60, // Ângulo de 60 graus (perspectiva)
        heading: 0, // Direção
        zoom: 17, // Zoom mais próximo
      }, { duration: 1000 });
    }
    
    if (routeInfo && voiceEnabled) {
      const firstStep = routeInfo.steps[0];
      DirectionsService.speakInstruction(firstStep.instruction);
    }
  };

  /**
   * Finaliza a corrida
   */
  const handleFinishRide = () => {
    Alert.alert(
      'Finalizar Corrida',
      'Confirma que o passageiro desceu e a corrida foi concluída?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            DirectionsService.stopSpeaking();
            router.back();
            Alert.alert('Corrida Finalizada', 'Corrida concluída com sucesso!');
          },
        },
      ]
    );
  };

  /**
   * Converte heading para direção cardeal
   */
  const getCompassDirection = (degrees: number): string => {
    const directions = ['Norte', 'Nordeste', 'Leste', 'Sudeste', 'Sul', 'Sudoeste', 'Oeste', 'Noroeste'];
    const index = Math.round(((degrees % 360) / 45)) % 8;
    return directions[index];
  };

  /**
   * Liga para o passageiro
   */
  const handleCallPassenger = () => {
    Alert.alert('Ligar', `Ligando para ${rideData.passengerName}...`);
  };

  /**
   * Envia mensagem para o passageiro
   */
  const handleMessagePassenger = () => {
    Alert.alert('Mensagem', `Enviar mensagem para ${rideData.passengerName}`);
  };

  if (isLoadingRoute) {
    return (
      <View style={styles.loadingContainer}>
        {TEST_MODE && (
          <View style={styles.testModeBadge}>
            <Text style={styles.testModeText}>🧪 MODO TESTE</Text>
            <Text style={styles.testModeSubtext}>Simulando GPS em Xique-Xique</Text>
          </View>
        )}
        <Text style={styles.loadingText}>Calculando melhor rota...</Text>
      </View>
    );
  }

  const currentStep = routeInfo?.steps[currentStepIndex];
  const polylineCoords = routeInfo 
    ? DirectionsService.decodePolyline(routeInfo.polyline)
    : [];

  // Log para debug
  console.log('🗺️ Polyline coords:', polylineCoords.length);

  return (
    <View style={styles.container}>
      {/* Badge de Modo Teste */}
      {TEST_MODE && (
        <View style={styles.testModeBadgeFloating}>
          <Text style={styles.testModeTextFloating}>🧪 MODO TESTE</Text>
        </View>
      )}
      
      {/* Mapa com Rota */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: (rideData.origin.latitude + rideData.destination.latitude) / 2,
          longitude: (rideData.origin.longitude + rideData.destination.longitude) / 2,
          latitudeDelta: Math.abs(rideData.origin.latitude - rideData.destination.latitude) * 2.5,
          longitudeDelta: Math.abs(rideData.origin.longitude - rideData.destination.longitude) * 2.5,
        }}
        showsUserLocation={true}
        followsUserLocation={navigationStarted}
        showsMyLocationButton={true}
        showsCompass={true}
        showsTraffic={false}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        showsBuildings={true}
        showsIndoors={true}
        showsIndoorLevelPicker={true}
        showsPointsOfInterest={true}
        showsScale={navigationStarted}
      >
        {/* Rota Dinâmica com MapViewDirections */}
        {!isRecalculating && (
          <MapViewDirections
            origin={{
              latitude: rideData.origin.latitude,
              longitude: rideData.origin.longitude,
            }}
            destination={{
              latitude: rideData.destination.latitude,
              longitude: rideData.destination.longitude,
            }}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={navigationStarted ? 8 : 6}
            strokeColor={isOffRoute ? "#FF5722" : "#4285F4"}
            optimizeWaypoints={true}
            onReady={(result) => {
              console.log(`✅ Rota renderizada: ${result.distance} km, ${result.duration} min`);
            }}
            onError={(errorMessage) => {
              console.error('❌ Erro MapViewDirections:', errorMessage);
            }}
            precision="high"
            mode="DRIVING"
            language="pt-BR"
            region="BR"
          />
        )}

        {/* Marcador Origem - Verde (só mostra antes de iniciar navegação) */}
        {!navigationStarted && (
          <Marker
          coordinate={{
            latitude: rideData.origin.latitude,
            longitude: rideData.origin.longitude,
          }}
          title="Origem"
          description={String(rideData.origin.address)}
        >
          <View style={styles.markerOrigin}>
            <Text style={styles.markerText}>A</Text>
          </View>
        </Marker>
        )}

        {/* Marcador Destino - Vermelho (sempre visível) */}
        <Marker
          coordinate={{
            latitude: rideData.destination.latitude,
            longitude: rideData.destination.longitude,
          }}
          title="Destino"
          description={String(rideData.destination.address)}
        >
          <View style={styles.markerDestination}>
            <Text style={styles.markerText}>B</Text>
          </View>
        </Marker>
      </MapView>

      {/* Indicador de Recálculo */}
      {isRecalculating && (
        <View style={styles.recalculatingBanner}>
          <Ionicons name="sync" size={20} color="#FFF" />
          <Text style={styles.recalculatingText}>Recalculando rota...</Text>
        </View>
      )}

      {/* Card de Instrução Atual - GRANDE E VISÍVEL */}
      {currentStep && navigationStarted && !isRecalculating && (
        <View style={[
          styles.instructionCardLarge,
          isOffRoute && styles.instructionCardOffRoute
        ]}>
          {isOffRoute && (
            <View style={styles.offRouteBadge}>
              <Ionicons name="warning" size={16} color="#FFF" />
              <Text style={styles.offRouteText}>FORA DA ROTA</Text>
            </View>
          )}
          
          <View style={styles.instructionHeaderLarge}>
            <View style={[
              styles.maneuverIconContainer,
              isOffRoute && styles.maneuverIconContainerOffRoute
            ]}>
              <Text style={styles.maneuverIconLarge}>
                {DirectionsService.getManeuverIcon(currentStep.maneuver)}
              </Text>
            </View>
            <View style={styles.instructionInfoLarge}>
              <Text style={styles.instructionDistanceLarge}>
                {DirectionsService.formatDistance(currentStep.distance)}
              </Text>
              <Text style={styles.instructionTextLarge} numberOfLines={2}>
                {currentStep.instruction}
              </Text>
              
              {/* Direção atual (heading) */}
              <Text style={styles.headingText}>
                {getCompassDirection(heading)}
              </Text>
            </View>
          </View>
          
          {/* Próximo passo (se existir) */}
          {routeInfo && routeInfo.steps[currentStepIndex + 1] && !isOffRoute && (
            <View style={styles.nextStepPreview}>
              <Text style={styles.nextStepLabel}>Depois:</Text>
              <Text style={styles.nextStepText} numberOfLines={1}>
                {routeInfo.steps[currentStepIndex + 1].instruction}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Card de Informações da Corrida - Só mostra antes de iniciar navegação */}
      {!navigationStarted && (
        <View style={styles.rideInfoCard}>
          <View style={styles.rideInfoRow}>
            <View style={styles.rideInfoItem}>
              <Text style={styles.rideInfoLabel}>Distância</Text>
              <Text style={styles.rideInfoValue}>
                {routeInfo ? DirectionsService.formatDistance(routeInfo.distance * 1000) : '-'}
              </Text>
            </View>
            <View style={styles.rideInfoDivider} />
            <View style={styles.rideInfoItem}>
              <Text style={styles.rideInfoLabel}>Tempo</Text>
              <Text style={styles.rideInfoValue}>
                {routeInfo ? DirectionsService.formatDuration(routeInfo.duration) : '-'}
              </Text>
            </View>
            <View style={styles.rideInfoDivider} />
            <View style={styles.rideInfoItem}>
              <Text style={styles.rideInfoLabel}>Valor</Text>
              <Text style={styles.rideInfoValue}>R$ {rideData.price.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      )}
      
      {/* Mini card durante navegação */}
      {navigationStarted && !arrivedAtDestination && (
        <View style={styles.miniInfoCard}>
          <Text style={styles.miniInfoText}>
            ⏱️ {routeInfo ? DirectionsService.formatDuration(routeInfo.duration) : '-'} · 
            📍 {routeInfo ? DirectionsService.formatDistance(routeInfo.distance * 1000) : '-'} · 
            💰 R$ {rideData.price.toFixed(2)}
          </Text>
        </View>
      )}

      {/* Card do Passageiro */}
      <View style={styles.passengerCard}>
        <View style={styles.passengerInfo}>
          <View style={styles.passengerAvatar}>
            <Text style={styles.passengerInitial}>
              {String(rideData.passengerName).charAt(0)}
            </Text>
          </View>
          <View style={styles.passengerDetails}>
            <Text style={styles.passengerName}>{rideData.passengerName}</Text>
            <Text style={styles.passengerPayment}>Pagamento: {rideData.paymentMethod}</Text>
          </View>
        </View>

        <View style={styles.passengerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCallPassenger}>
            <Ionicons name="call" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleMessagePassenger}>
            <Ionicons name="chatbubble" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, !voiceEnabled && styles.actionButtonDisabled]}
            onPress={() => setVoiceEnabled(!voiceEnabled)}
          >
            <Ionicons
              name={voiceEnabled ? 'volume-high' : 'volume-mute'}
              size={20}
              color="#FFF"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionBar}>
        {!navigationStarted ? (
          <TouchableOpacity style={styles.startButton} onPress={handleStartNavigation}>
            <Ionicons name="navigate" size={28} color="#FFF" style={{ marginRight: 10 }} />
            <Text style={styles.startButtonText}>INICIAR NAVEGAÇÃO</Text>
          </TouchableOpacity>
        ) : arrivedAtDestination ? (
          <TouchableOpacity style={styles.finishButton} onPress={handleFinishRide}>
            <Ionicons name="checkmark-circle" size={28} color="#FFF" style={{ marginRight: 10 }} />
            <Text style={styles.finishButtonText}>FINALIZAR CORRIDA</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  instructionCardLarge: {
    position: 'absolute',
    top: 20,
    left: 15,
    right: 15,
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  instructionHeaderLarge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maneuverIconContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#FFF',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  maneuverIconLarge: {
    fontSize: 50,
  },
  instructionInfoLarge: {
    flex: 1,
  },
  instructionDistanceLarge: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  instructionTextLarge: {
    fontSize: 18,
    color: '#E5E7EB',
    lineHeight: 24,
    fontWeight: '500',
  },
  nextStepPreview: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextStepLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginRight: 8,
    fontWeight: '600',
  },
  nextStepText: {
    fontSize: 14,
    color: '#D1D5DB',
    flex: 1,
  },
  miniInfoCard: {
    position: 'absolute',
    top: 20,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  miniInfoText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  rideInfoCard: {
    position: 'absolute',
    top: 160,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  rideInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rideInfoItem: {
    alignItems: 'center',
  },
  rideInfoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  rideInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rideInfoDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  passengerCard: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  passengerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  passengerInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  passengerDetails: {
    flex: 1,
  },
  passengerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  passengerPayment: {
    fontSize: 14,
    color: '#666',
  },
  passengerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#999',
  },
  actionBar: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  startButton: {
    backgroundColor: '#4285F4',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  finishButton: {
    backgroundColor: '#34A853',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  finishButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  navigationInfo: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  navigationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  markerOrigin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#34A853',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  markerDestination: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EA4335',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  markerText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  testModeBadge: {
    backgroundColor: '#FF9800',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  testModeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  testModeSubtext: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 4,
  },
  testModeBadgeFloating: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF9800',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  testModeTextFloating: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  recalculatingBanner: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FF9800',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    zIndex: 999,
  },
  recalculatingText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  instructionCardOffRoute: {
    backgroundColor: '#E53935',
  },
  offRouteBadge: {
    backgroundColor: '#C62828',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  offRouteText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  maneuverIconContainerOffRoute: {
    backgroundColor: '#FFCDD2',
  },
  headingText: {
    fontSize: 14,
    color: '#B0BEC5',
    marginTop: 8,
    fontWeight: '600',
  },
});

