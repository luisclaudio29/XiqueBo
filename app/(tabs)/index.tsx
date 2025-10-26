import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS } from '@/constants/colors';
import AuthService from '@/services/auth.service';
import OfflineIndicator from '@/components/offline-indicator';
import HotspotsButton from '@/components/hotspots-button';
import DraggableFloatingButton from '@/components/draggable-floating-button';
import { NewRideNotification } from '@/components/new-ride-notification';
import { TripHistoryCard } from '@/components/trip-history-card';
import HistoryService, { RouteFrequency } from '@/services/history.service';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('Cliente');
  const [userAddress, setUserAddress] = useState('Carregando localização...');
  const [userType, setUserType] = useState<'cliente' | 'motorista' | 'entregador'>('cliente');
  const [notificationCount, setNotificationCount] = useState(3);
  const [onlineDrivers, setOnlineDrivers] = useState(23);
  const [topRoutes, setTopRoutes] = useState<RouteFrequency[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Estados para motorista/entregador
  const [isOnline, setIsOnline] = useState(false);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [todayTrips, setTodayTrips] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  
  // Estados do mapa
  const [userLocation, setUserLocation] = useState({
    latitude: -10.8236,
    longitude: -42.7273,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  
  // Estados de nova corrida
  const [showNewRide, setShowNewRide] = useState(false);
  const [hasActiveRide, setHasActiveRide] = useState(false); // Se está em corrida ativa
  const [pendingRides, setPendingRides] = useState<string[]>([]); // IDs de corridas pendentes
  const [mockRideData, setMockRideData] = useState({
    rideId: 'ride-' + Date.now(),
    passengerName: 'Maria Silva',
    passengerPhone: '(74) 99999-9999',
    passengerRating: 4.8,
    origin: {
      address: 'R. da Maternidade, 131 - Xique-Xique, BA',
      latitude: -10.8230,
      longitude: -42.7280,
    },
    destination: {
      address: 'R. Cinquenta e Nove, 2-46 - Xique-Xique, BA',
      latitude: -10.8250,
      longitude: -42.7310,
    },
    distance: 3.2,
    duration: 8,
    price: 12.50,
    paymentMethod: 'Dinheiro',
  });

  useEffect(() => {
    loadUserData();
    loadTripHistory();
  }, []);

  // Detectar quando volta para essa tela (finaliza corrida)
  useFocusEffect(
    React.useCallback(() => {
      // Quando voltar para a home, resetar estado de corrida ativa
      return () => {
        // Esta função roda quando SAI da tela
      };
    }, [])
  );

  // Listener para quando volta da tela de corrida
  useEffect(() => {
    // Simular: se estava em corrida e voltou, resetar
    const checkIfCameBackFromRide = () => {
      if (hasActiveRide) {
        // Verifica se realmente está na tela de corrida ativa
        // Se voltou pra home, reseta
        setHasActiveRide(false);
        
        // Se tinha pedidos pendentes, mostrar o primeiro
        if (pendingRides.length > 0 && isOnline) {
          setTimeout(() => {
            setShowNewRide(true);
          }, 1000);
        }
      }
    };
    
    checkIfCameBackFromRide();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        setUserName(user.name || 'Cliente');
        
        // Define o tipo de usuário
        const userTypeValue = user.userType as string;
        if (userTypeValue === 'motorista' && user.hasMotoristaRegistration) {
          setUserType('motorista');
        } else if (userTypeValue === 'entregador' && user.hasMotoristaRegistration) {
          setUserType('entregador');
        } else {
          setUserType('cliente');
        }
        
        if (user.address) {
          const addr = user.address;
          setUserAddress(`${addr.street || ''}, ${addr.city || 'Xique-Xique'} - ${addr.state || 'BA'}`);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const loadTripHistory = async () => {
    setIsLoadingHistory(true);
    try {
      // Carrega as rotas mais feitas
      const routes = await HistoryService.getMostFrequentRoutes('passenger', 5);
      
      // Se não houver histórico, popular com dados mock para demonstração
      if (routes.length === 0) {
        await HistoryService.populateMockData('passenger');
        const mockRoutes = await HistoryService.getMostFrequentRoutes('passenger', 5);
        setTopRoutes(mockRoutes);
      } else {
        setTopRoutes(routes);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleRideRequest = () => {
    // NOVA TELA ÚNICA ESTILO UBER - TUDO EM UMA PÁGINA!
    router.push({ pathname: '/request-ride-uber-style', params: { mode: 'corrida' } });
  };

  const handleDeliveryRequest = () => {
    // NOVA TELA ÚNICA ESTILO UBER - TUDO EM UMA PÁGINA!
    router.push({ pathname: '/request-ride-uber-style', params: { mode: 'entrega' } });
  };

  const handleRouteSelect = (route: RouteFrequency) => {
    // Redireciona para tela de solicitação com origem e destino pré-preenchidos
    router.push({
      pathname: '/order/category',
      params: {
        mode: 'corrida',
        origin: route.origin,
        destination: route.destination,
      },
    });
  };

  const handleToggleOnline = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    
    // Simular recebimento de corrida após 10 segundos de ficar online
    if (newStatus) {
      setTimeout(() => {
        // Gerar novo pedido
        const newRideId = 'ride-' + Date.now();
        setPendingRides(prev => [...prev, newRideId]);
        
        // Se NÃO está em corrida ativa, mostrar modal
        // Se está em corrida, apenas a bolinha pulsa (não mostra modal)
        if (!hasActiveRide) {
          setShowNewRide(true);
        }
      }, 10000); // 10 segundos
    }
  };
  
  const handleAcceptRide = (rideId: string) => {
    setShowNewRide(false);
    setHasActiveRide(true); // Marca que está em corrida ativa
    console.log('✅ Corrida aceita:', rideId);
    
    // Remove das pendentes
    setPendingRides(prev => prev.filter(id => id !== rideId));
    
    // Navegar para tela de corrida ativa com os dados da corrida
    router.push({
      pathname: '/driver/active-ride',
      params: {
        rideId: mockRideData.rideId,
        passengerName: mockRideData.passengerName,
        passengerPhone: mockRideData.passengerPhone,
        passengerRating: mockRideData.passengerRating.toString(),
        originAddress: mockRideData.origin.address,
        originLat: mockRideData.origin.latitude.toString(),
        originLng: mockRideData.origin.longitude.toString(),
        destAddress: mockRideData.destination.address,
        destLat: mockRideData.destination.latitude.toString(),
        destLng: mockRideData.destination.longitude.toString(),
        distance: mockRideData.distance.toString(),
        duration: mockRideData.duration.toString(),
        price: mockRideData.price.toString(),
        paymentMethod: mockRideData.paymentMethod,
      },
    });
  };
  
  const handleRejectRide = (rideId: string) => {
    setShowNewRide(false);
    console.log('❌ Corrida recusada:', rideId);
    
    // Remove das pendentes
    setPendingRides(prev => prev.filter(id => id !== rideId));
    
    // Gerar nova corrida após 5 segundos
    setTimeout(() => {
      // Atualizar dados para simular nova corrida
      const newRideId = 'ride-' + Date.now();
      setMockRideData({
        rideId: newRideId,
        passengerName: ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Lima'][Math.floor(Math.random() * 4)],
        passengerPhone: '(74) 99999-9999',
        passengerRating: 4.5 + Math.random() * 0.5,
        origin: {
          address: 'R. da Maternidade, 131 - Xique-Xique, BA',
          latitude: -10.8230 + (Math.random() - 0.5) * 0.01,
          longitude: -42.7280 + (Math.random() - 0.5) * 0.01,
        },
        destination: {
          address: 'R. Cinquenta e Nove, 2-46 - Xique-Xique, BA',
          latitude: -10.8250 + (Math.random() - 0.5) * 0.01,
          longitude: -42.7310 + (Math.random() - 0.5) * 0.01,
        },
        distance: 2 + Math.random() * 8,
        duration: 5 + Math.floor(Math.random() * 15),
        price: 10 + Math.random() * 30,
        paymentMethod: ['Dinheiro', 'PIX', 'Cartão'][Math.floor(Math.random() * 3)],
      });
      
      setPendingRides(prev => [...prev, newRideId]);
      
      // Se NÃO está em corrida ativa, mostrar modal
      if (isOnline && !hasActiveRide) {
        setShowNewRide(true);
      }
    }, 5000);
  };

  // Interface para Motorista/Entregador
  if (userType === 'motorista' || userType === 'entregador') {
    return (
      <View style={styles.container}>
        <OfflineIndicator />
        
        {/* Header Compacto - Sempre visível */}
        <View style={styles.driverHeader}>
          <TouchableOpacity
            style={styles.driverAvatar}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
          
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{userName}</Text>
            <Text style={styles.driverStatus}>
              {userType === 'motorista' ? 'Motorista' : 'Entregador'} • {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>

          <TouchableOpacity style={styles.notificationBadge}>
            <Ionicons name="notifications" size={24} color={COLORS.secondary} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* MODO ONLINE - Mapa Estilo Uber */}
        {isOnline ? (
          <View style={styles.onlineMapContainer}>
            {/* Mapa em tela cheia */}
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.onlineMap}
              initialRegion={userLocation}
              showsUserLocation
              showsMyLocationButton={false}
              showsCompass={false}
              toolbarEnabled={false}
            >
              {/* Marcador de localização do motorista */}
              <Marker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                title="Você está aqui"
                description="Sua localização atual"
              >
                <View style={styles.driverMarker}>
                  <Ionicons name="car" size={24} color="#FFF" />
                </View>
              </Marker>
            </MapView>

            {/* Card de Status Flutuante no Topo */}
            <View style={styles.onlineStatusCard}>
              <View style={styles.onlineStatusIndicator}>
                <View style={styles.onlineGreenDot} />
                <Text style={styles.onlineStatusText}>Você está Online</Text>
              </View>
              <Text style={styles.onlineStatusSubtext}>
                Aguardando solicitações...
              </Text>
            </View>

            {/* Botão Offline Flutuante no Topo Direito */}
            <TouchableOpacity
              style={styles.goOfflineButton}
              onPress={handleToggleOnline}
            >
              <Ionicons name="power" size={20} color="#FFF" />
              <Text style={styles.goOfflineButtonText}>Ficar Offline</Text>
            </TouchableOpacity>

            {/* Card de Ganhos Hoje - Flutuante */}
            <View style={styles.earningsFloatingCard}>
              <View style={styles.earningsFloatingRow}>
                <View>
                  <Text style={styles.earningsFloatingValue}>R$ {todayEarnings.toFixed(2)}</Text>
                  <Text style={styles.earningsFloatingLabel}>Ganhos Hoje</Text>
                </View>
                <View style={styles.earningsFloatingDivider} />
                <View>
                  <Text style={styles.earningsFloatingValue}>{todayTrips}</Text>
                  <Text style={styles.earningsFloatingLabel}>
                    {userType === 'motorista' ? 'Corridas' : 'Entregas'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Botão Flutuante Laranja Arrastável - PULSA quando há pedidos pendentes */}
            <DraggableFloatingButton
              icon="navigate"
              backgroundColor="#FF8C00"
              size={70}
              pulse={pendingRides.length > 0} // PULSA quando há pedidos pendentes
              onPress={() => {
                // Se tem pedidos pendentes e NÃO está em corrida, mostrar modal
                if (pendingRides.length > 0 && !hasActiveRide) {
                  setShowNewRide(true);
                } else if (hasActiveRide) {
                  // Se está em corrida, mostrar alerta
                  Alert.alert(
                    'Corrida em Andamento',
                    `Você tem ${pendingRides.length} pedido(s) pendente(s).\nFinalize a corrida atual primeiro!`,
                    [{ text: 'OK' }]
                  );
                }
              }}
            />
          </View>
        ) : (
          // MODO OFFLINE - Tela de informações
          <View style={styles.offlineContainer}>
            {/* BOTÃO GIGANTE ON/OFF - SUPER VISÍVEL */}
            <View style={styles.bigToggleContainer}>
              <Text style={styles.bigToggleTitle}>Você está</Text>
              <Text style={styles.bigToggleStatus}>OFFLINE</Text>
              <Text style={styles.bigToggleSubtext}>
                Toque no botão abaixo para ficar disponível e começar a receber{' '}
                {userType === 'motorista' ? 'corridas' : 'entregas'}
              </Text>
              
              {/* BOTÃO GIGANTE */}
              <TouchableOpacity
                style={styles.hugeOnlineButton}
                onPress={handleToggleOnline}
                activeOpacity={0.8}
              >
                <View style={styles.hugeButtonContent}>
                  <Text style={styles.hugeButtonIcon}>⚡</Text>
                  <Text style={styles.hugeButtonText}>FICAR ONLINE</Text>
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

          {/* Ganhos de Hoje */}
          <View style={styles.earningsSection}>
            <View style={styles.earningsCard}>
              <View style={styles.earningsHeader}>
                <Text style={styles.earningsTitle}>💰 Ganhos de Hoje</Text>
                <TouchableOpacity>
                  <Text style={styles.seeDetailsLink}>Ver detalhes</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.earningsContent}>
                <View style={styles.earningsItem}>
                  <Text style={styles.earningsValue}>R$ {todayEarnings.toFixed(2)}</Text>
                  <Text style={styles.earningsLabel}>Total Ganho</Text>
                </View>
                
                <View style={styles.earningsDivider} />
                
                <View style={styles.earningsItem}>
                  <Text style={styles.earningsValue}>{todayTrips}</Text>
                  <Text style={styles.earningsLabel}>
                    {userType === 'motorista' ? 'Corridas' : 'Entregas'}
                  </Text>
                </View>
                
                <View style={styles.earningsDivider} />
                
                <View style={styles.earningsItem}>
                  <Text style={styles.earningsValue}>
                    {todayTrips > 0 ? `R$ ${(todayEarnings / todayTrips).toFixed(2)}` : 'R$ 0,00'}
                  </Text>
                  <Text style={styles.earningsLabel}>Média</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Solicitações Pendentes */}
          {isOnline && pendingRequests > 0 && (
            <View style={styles.requestsSection}>
              <View style={styles.requestsCard}>
                <View style={styles.requestsHeader}>
                  <Ionicons name="notifications-circle" size={24} color={COLORS.primary} />
                  <Text style={styles.requestsTitle}>
                    {pendingRequests} {pendingRequests === 1 ? 'Solicitação' : 'Solicitações'} Próximas
                  </Text>
                </View>
                <TouchableOpacity style={styles.viewRequestsButton}>
                  <Text style={styles.viewRequestsButtonText}>Ver Solicitações</Text>
                  <Ionicons name="chevron-forward" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Mensagem quando Offline */}
          {!isOnline && (
            <View style={styles.offlineMessage}>
              <Text style={styles.offlineMessageIcon}>😴</Text>
              <Text style={styles.offlineMessageTitle}>Você está offline</Text>
              <Text style={styles.offlineMessageText}>
                Fique online para começar a receber solicitações de{' '}
                {userType === 'motorista' ? 'corridas' : 'entregas'}
              </Text>
            </View>
          )}

          {/* Estatísticas Rápidas */}
          <View style={styles.statsSection}>
            <Text style={styles.statsSectionTitle}>📊 Suas Estatísticas</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={styles.statValue}>5.0</Text>
                <Text style={styles.statLabel}>Avaliação</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statIcon}>📅</Text>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Esta Semana</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🏆</Text>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Este Mês</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statIcon}>💯</Text>
                <Text style={styles.statValue}>0%</Text>
                <Text style={styles.statLabel}>Aceitação</Text>
              </View>
            </View>
          </View>

          {/* Dicas */}
          <View style={styles.tipsSection}>
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>💡</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Dica do Dia</Text>
                <Text style={styles.tipText}>
                  Horários de pico: 7h-9h e 17h-19h são os melhores para ganhar mais!
                </Text>
              </View>
            </View>
          </View>

              {/* Espaçamento final */}
              <View style={{ height: 100 }} />
            </ScrollView>
          </View>
        )}
        
        {/* Notificação de Nova Corrida - SÓ MOSTRA SE NÃO ESTÁ EM CORRIDA ATIVA */}
        <NewRideNotification
          visible={showNewRide && !hasActiveRide}
          rideData={mockRideData}
          onAccept={handleAcceptRide}
          onReject={handleRejectRide}
        />
      </View>
    );
  }

  // Interface para Cliente
  return (
    <View style={styles.container}>
      <OfflineIndicator />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Amarelo */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => router.push('/profile')}
            >
              <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.greeting}>Olá, {userName}!</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color="#C41E3A" />
                <Text style={styles.address} numberOfLines={1}>
                  {userAddress}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBadge}>
            <Ionicons name="notifications" size={24} color="#FFF" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Motoristas Online */}
        <View style={styles.onlineDrivers}>
          <Ionicons name="car" size={20} color={COLORS.primary} />
          <Text style={styles.onlineText}>{onlineDrivers} motoristas online agora</Text>
        </View>

        {/* O que você precisa? */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O que você precisa?</Text>
          <View style={styles.servicesRow}>
            {/* Card Corrida */}
            <TouchableOpacity
              style={[styles.serviceCard, styles.rideCard]}
              onPress={handleRideRequest}
            >
              <View style={styles.serviceIconContainer}>
                <Text style={styles.serviceIcon}>🚗</Text>
              </View>
              <Text style={styles.serviceName}>Corrida</Text>
              <Text style={styles.serviceDescription}>
                Carro, Moto ou{'\n'}Mototáxi
              </Text>
              <View style={styles.priceTag}>
                <Text style={styles.priceText}>A partir de R$ 5</Text>
              </View>
            </TouchableOpacity>

            {/* Card Entrega */}
            <TouchableOpacity
              style={[styles.serviceCard, styles.deliveryCard]}
              onPress={handleDeliveryRequest}
            >
              <View style={styles.serviceIconContainer}>
                <Text style={styles.serviceIcon}>📦</Text>
              </View>
              <Text style={styles.serviceName}>Entrega</Text>
              <Text style={styles.serviceDescription}>Rápida e segura</Text>
              <View style={styles.priceTagDelivery}>
                <Text style={styles.priceText}>A partir de R$ 4</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Promoções */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Promoções</Text>
            <TouchableOpacity>
              <Text style={styles.updateButton}>Atualizar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Frete Grátis */}
            <View style={[styles.promoCard, styles.promoTurquoise]}>
              <Text style={styles.promoIcon}>📦</Text>
              <Text style={styles.promoTitle}>Frete Grátis</Text>
              <Text style={styles.promoDescription}>Em entregas até 5km</Text>
              <View style={styles.promoDivider} />
              <Text style={styles.promoValidity}>Válido hoje</Text>
            </View>

            {/* Segunda-feira */}
            <View style={[styles.promoCard, styles.promoYellow]}>
              <Text style={styles.promoTitle}>Segunda-feira</Text>
              <Text style={styles.promoDescription}>15% off em corridas</Text>
              <View style={styles.promoDivider} />
              <Text style={styles.promoValidity}>Todas as segundas</Text>
            </View>
          </ScrollView>
        </View>

        {/* Suas viagens mais feitas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suas viagens mais feitas</Text>
            <TouchableOpacity onPress={loadTripHistory}>
              <Text style={styles.updateButton}>Atualizar</Text>
            </TouchableOpacity>
          </View>

          {isLoadingHistory ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Carregando histórico...</Text>
            </View>
          ) : topRoutes.length > 0 ? (
            topRoutes.map((route) => (
              <TripHistoryCard
                key={route.routeKey}
                route={route}
                onPress={handleRouteSelect}
                showPrice={userType === 'cliente'}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="map-outline" size={48} color={COLORS.grayDark} />
              <Text style={styles.emptyStateText}>
                Você ainda não fez nenhuma viagem
              </Text>
              <Text style={styles.emptyStateHint}>
                Suas rotas mais frequentes aparecerão aqui
              </Text>
            </View>
          )}
        </View>

        {/* Cards Informativos */}
        <View style={styles.section}>
          {/* Cobertura Total */}
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>✨</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Cobertura Total</Text>
              <Text style={styles.infoDescription}>
                Atendemos toda Xique-Xique e povoados próximos ao Rio São Francisco
              </Text>
            </View>
          </View>

          {/* Pagamento Seguro */}
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🔒</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Pagamento Seguro</Text>
              <Text style={styles.infoDescription}>
                PIX, Cartão ou Dinheiro. Você escolhe!
              </Text>
            </View>
          </View>

          {/* Motoristas Confiáveis */}
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>⭐</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Motoristas Confiáveis</Text>
              <Text style={styles.infoDescription}>
                Todos os motoristas são verificados
              </Text>
            </View>
          </View>
        </View>

        {/* Espaçamento final */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botão Flutuante de Hotspots */}
      <HotspotsButton userType="cliente" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  
  // ===== ESTILOS MODO ONLINE (MAPA) =====
  onlineMapContainer: {
    flex: 1,
    position: 'relative',
  },
  
  // ===== ESTILOS MODO OFFLINE =====
  offlineContainer: {
    flex: 1,
  },
  bigToggleContainer: {
    backgroundColor: '#FFF',
    margin: 20,
    marginTop: 10,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bigToggleTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  bigToggleStatus: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF5252',
    marginBottom: 10,
  },
  bigToggleSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  hugeOnlineButton: {
    width: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  hugeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hugeButtonIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  hugeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  onlineMap: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  driverMarker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  onlineStatusCard: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 80,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  onlineStatusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  onlineGreenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  onlineStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  onlineStatusSubtext: {
    fontSize: 13,
    color: '#666',
  },
  goOfflineButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FF5252',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  goOfflineButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  earningsFloatingCard: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  earningsFloatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  earningsFloatingValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  earningsFloatingLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  earningsFloatingDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  header: {
    backgroundColor: '#FDB913',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FDB913',
  },
  headerInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 13,
    color: '#333',
    marginLeft: 4,
    flex: 1,
  },
  notificationBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF0000',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  onlineDrivers: {
    backgroundColor: '#FFF9E6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    borderRadius: 25,
    marginHorizontal: 20,
  },
  onlineText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 8,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  updateButton: {
    fontSize: 16,
    color: '#FDB913',
    fontWeight: '600',
  },
  servicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    borderRadius: 20,
    padding: 20,
    minHeight: 220,
  },
  rideCard: {
    backgroundColor: '#FDB913',
  },
  deliveryCard: {
    backgroundColor: '#4DD0E1',
  },
  serviceIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceIcon: {
    fontSize: 40,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 15,
    color: '#333',
    marginBottom: 16,
  },
  priceTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  priceTagDelivery: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  priceText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },
  promoCard: {
    width: 200,
    borderRadius: 16,
    padding: 20,
    marginRight: 12,
  },
  promoTurquoise: {
    backgroundColor: '#4DD0E1',
  },
  promoYellow: {
    backgroundColor: '#FDB913',
  },
  promoIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  promoDescription: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 12,
  },
  promoDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 12,
  },
  promoValidity: {
    fontSize: 13,
    color: '#FFF',
    fontWeight: '600',
  },
  favoriteCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  favoriteEmoji: {
    fontSize: 24,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  favoriteAddress: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  favoriteCount: {
    fontSize: 12,
    color: '#FDB913',
    fontWeight: '600',
  },
  favoriteArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.grayDark,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateHint: {
    fontSize: 14,
    color: COLORS.grayDark,
    marginTop: 8,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  infoDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  
  // Estilos para Motorista/Entregador
  driverHeader: {
    backgroundColor: '#FFF',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  driverStatus: {
    fontSize: 13,
    color: '#666',
  },
  
  // Toggle Online/Offline
  onlineToggleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  onlineToggleButton: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  onlineButtonActive: {
    backgroundColor: '#4CAF50',
  },
  onlineButtonInactive: {
    backgroundColor: '#9E9E9E',
  },
  onlineToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineToggleIcon: {
    fontSize: 48,
    color: '#FFF',
    marginRight: 20,
    fontWeight: 'bold',
  },
  onlineToggleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  onlineToggleSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  
  // Ganhos
  earningsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  earningsCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  earningsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  seeDetailsLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  earningsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  earningsItem: {
    alignItems: 'center',
    flex: 1,
  },
  earningsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  earningsLabel: {
    fontSize: 13,
    color: '#666',
  },
  earningsDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  
  // Solicitações
  requestsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  requestsCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  requestsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  requestsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 12,
    flex: 1,
  },
  viewRequestsButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewRequestsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginRight: 8,
  },
  
  // Mensagem Offline
  offlineMessage: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  offlineMessageIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  offlineMessageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  offlineMessageText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Estatísticas
  statsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  statsSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  
  // Dicas
  tipsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tipCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
