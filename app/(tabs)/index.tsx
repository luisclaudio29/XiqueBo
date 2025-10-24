import { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import AuthService from '@/services/auth.service';
import { RideConfirmationModal } from '@/components/ride-confirmation-modal';
import { PaymentMethodSelector, PaymentMethodOption } from '@/components/payment-method-selector';
import { VoucherInput } from '@/components/voucher-input';
import type { AppliedVoucher } from '@/types/voucher.types';
import { 
  calculateRidePrice, 
  estimateDistance, 
  estimateDuration,
  RideExtras 
} from '@/utils/pricing';
import { useLocation } from '@/hooks/use-location';
import { getCombinedSuggestions, getFavorites } from '@/services/location.service';
import OfflineIndicator from '@/components/offline-indicator';
import OfflineService from '@/services/offline.service';
import HotspotsButton from '@/components/hotspots-button';

type ServiceType = 'comum' | 'expressa' | 'bagagem' | 'pets' | 'moto' | 'mototaxi' | 
                   'entrega_carro' | 'entrega_moto' | 'entrega_bicicleta';

type UserType = 'cliente' | 'motorista';

// Dados do mapa inteligente
const mapData = {
  motorista: [
    { id: '1', type: 'hot', name: 'Centro', icon: '🔥', demand: 'Alta', rides: '45/dia' },
    { id: '2', type: 'hot', name: 'Av. Getúlio Vargas', icon: '🔥', demand: 'Alta', rides: '38/dia' },
    { id: '3', type: 'medium', name: 'Perto Velha', icon: '📍', demand: 'Média', rides: '22/dia' },
    { id: '4', type: 'low', name: 'Vicente', icon: '📌', demand: 'Baixa', rides: '8/dia' },
    { id: '5', type: 'danger', name: 'Zona Industrial (noite)', icon: '⚠️', demand: 'Alerta', rides: '3/dia' },
    { id: '6', type: 'danger', name: 'Bairro Sul (21h+)', icon: '⚠️', demand: 'Alerta', rides: '5/dia' },
  ],
  cliente: [
    { id: '1', type: 'event', name: 'Festa no Clube', icon: '🎉', info: 'Hoje 20h', status: 'Aberto' },
    { id: '2', type: 'restaurant', name: 'Churrascaria Boi na Brasa', icon: '⭐', info: '5 estrelas', rating: '4.9' },
    { id: '3', type: 'restaurant', name: 'Pizzaria La Bella', icon: '⭐', info: '5 estrelas', rating: '4.8' },
    { id: '4', type: 'food', name: 'Barraca do Seu João', icon: '🍔', info: 'Famosa', specialty: 'Tapioca' },
    { id: '5', type: 'food', name: 'Pastelaria da Praça', icon: '🍔', info: 'Famosa', specialty: 'Pastel' },
    { id: '6', type: 'leisure', name: 'Parque Aquático Xique-Xique', icon: '🏊', info: 'Aberto', hours: '9h-18h' },
    { id: '7', type: 'health', name: 'Hospital Municipal', icon: '🏥', info: 'Alta demanda', wait: '~45min' },
    { id: '8', type: 'health', name: 'Clínica São Lucas', icon: '🏥', info: 'Baixa demanda', wait: '~15min' },
    { id: '9', type: 'school', name: 'Colégio Estadual', icon: '🏫', info: 'Alta frequência', students: '850' },
    { id: '10', type: 'school', name: 'Escola Municipal', icon: '🏫', info: 'Média frequência', students: '420' },
  ],
  peakHours: [
    { location: 'Av. Principal', morning: '7h-9h', evening: '17h-19h', status: 'Intenso' },
    { location: 'Feira Municipal', days: 'Seg, Qua, Sex', hours: '6h-12h', peak: '8h-10h' },
  ],
};

interface UserRegistrations {
  hasClienteRegistration: boolean;
  hasMotoristaRegistration: boolean;
}

export default function HomeScreen() {
  const router = useRouter();
  
  // Nome do usuário logado
  const [userName, setUserName] = useState('Cliente');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // GPS em tempo real
  const { address: gpsAddress, loading: gpsLoading, refreshLocation } = useLocation();
  
  // Controla se usuário tem cadastro como cliente e/ou motorista
  const [registrations, setRegistrations] = useState<UserRegistrations>({
    hasClienteRegistration: true,  // Exemplo: tem cadastro de cliente
    hasMotoristaRegistration: false, // Não tem cadastro de motorista
  });
  
  // Define tipo inicial baseado no que tem cadastro
  const [userType, setUserType] = useState<UserType>(
    registrations.hasClienteRegistration ? 'cliente' : 'motorista'
  );
  
  // Carregar dados do usuário
  useEffect(() => {
    loadUserData();
  }, []);
  
  const loadUserData = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        setUserName(user.name.split(' ')[0]); // Pega primeiro nome
        setRegistrations({
          hasClienteRegistration: user.hasClienteRegistration || false,
          hasMotoristaRegistration: user.hasMotoristaRegistration || false,
        });
      }
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    }
  };
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceType>('comum');
  const [showModal, setShowModal] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const [serviceCategory, setServiceCategory] = useState<'corrida' | 'entrega'>('corrida');
  const [showMapInfo, setShowMapInfo] = useState(true);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  
  // Extras
  const [extras, setExtras] = useState<RideExtras>({
    bagagem: false,
    pets: false,
    prioridade: false,
    assistenciaIdoso: false,
    volumoso: false,
  });

  // Método de pagamento e voucher
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodOption | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);

  const rideServices = [
    { id: 'comum', name: 'Carro', icon: '🚗', description: 'Corrida padrão' },
    { id: 'moto', name: 'Moto', icon: '🏍️', description: 'Rápido e ágil' },
    { id: 'mototaxi', name: 'Mototáxi', icon: '🛵', description: 'Econômico' },
    { id: 'expressa', name: 'Expressa', icon: '⚡', description: 'Prioritário' },
  ];

  const deliveryServices = [
    { id: 'entrega_carro', name: 'Carro', icon: '🚙', description: 'Entrega grande' },
    { id: 'entrega_moto', name: 'Moto', icon: '🏍️', description: 'Entrega média' },
    { id: 'entrega_bicicleta', name: 'Bicicleta', icon: '🚴', description: 'Entrega pequena' },
  ];

  const services = serviceCategory === 'corrida' ? rideServices : deliveryServices;

  const handleRequestRide = () => {
    if (!origin || !destination) {
      Alert.alert('Atenção', 'Por favor, informe origem e destino');
      return;
    }

    if (!paymentMethod) {
      Alert.alert('Atenção', 'Por favor, selecione uma forma de pagamento');
      return;
    }

    setShowModal(true);
  };

  const handleConfirmRide = async (paymentMethod: string) => {
    setShowModal(false);
    
    const distance = estimateDistance(origin, destination);
    const duration = estimateDuration(distance);
    const price = calculateRidePrice({
      distanceKm: distance,
      serviceType: selectedService as any,
      extras,
    });

    // Verifica conexão de internet
    const isOnline = await OfflineService.checkConnection();

    // Se offline, salva localmente
    if (!isOnline) {
      try {
        await OfflineService.saveOfflineRequest({
          type: serviceCategory === 'entrega' ? 'delivery' : 'ride',
          origin: {
            latitude: -10.8236,  // TODO: Usar coordenadas GPS reais
            longitude: -42.7273,
            address: origin,
          },
          destination: {
            latitude: -10.8236,  // TODO: Usar coordenadas GPS reais
            longitude: -42.7273,
            address: destination,
          },
          serviceType: selectedService,
          paymentMethod,
          estimatedValue: price,
        });

        Alert.alert(
          '📵 Modo Offline',
          `Sua solicitação foi salva!\n\nValor estimado: R$ ${price.toFixed(2)}\n\nEla será enviada automaticamente quando você tiver conexão de internet.`,
          [{ text: 'Entendi', style: 'default' }]
        );
        return;
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar a solicitação. Tente novamente.');
        return;
      }
    }

    // Se online, processa normalmente
    const isDelivery = serviceCategory === 'entrega';
    const title = isDelivery ? 'Entrega Solicitada! 📦' : 'Corrida Solicitada! 🎉';
    const message = isDelivery 
      ? `Procurando entregador próximo...\n\nPagamento: ${paymentMethod}\nValor: R$ ${price.toFixed(2)}\n\nVocê receberá uma notificação quando o entregador aceitar.`
      : `Procurando motorista próximo...\n\nPagamento: ${paymentMethod}\nValor: R$ ${price.toFixed(2)}\n\nVocê receberá uma notificação quando o motorista aceitar.`;

    Alert.alert(title, message, [{ text: 'OK' }]);

    setOrigin('');
    setDestination('');
    setExtras({
      bagagem: false,
      pets: false,
      prioridade: false,
      assistenciaIdoso: false,
      volumoso: false,
    });
  };

  const toggleExtra = (extraKey: keyof RideExtras) => {
    setExtras(prev => ({
      ...prev,
      [extraKey]: !prev[extraKey],
    }));
  };

  const getEstimatedPrice = () => {
    if (!origin || !destination) return null;
    
    const distance = estimateDistance(origin, destination);
    const price = calculateRidePrice({
      distanceKm: distance,
      serviceType: selectedService as any,
      extras,
    });
    
    return { price, distance, duration: estimateDuration(distance) };
  };

  const estimate = getEstimatedPrice();

  const getDemandColor = (type: string) => {
    switch (type) {
      case 'hot': return '#FF6B6B';
      case 'medium': return '#FFB800';
      case 'low': return '#4ECDC4';
      case 'danger': return '#FF0000';
      default: return COLORS.gray;
    }
  };

  // Sugestões dinâmicas baseadas no GPS e texto digitado
  const originSuggestions = useMemo(() => {
    const currentAddress = gpsAddress || 'Xique-Xique, BA';
    return getCombinedSuggestions(currentAddress, origin);
  }, [origin, gpsAddress]);

  const destinationSuggestions = useMemo(() => {
    const currentAddress = gpsAddress || 'Xique-Xique, BA';
    return getCombinedSuggestions(currentAddress, destination);
  }, [destination, gpsAddress]);

  const handleSelectSuggestion = (suggestion: any, field: 'origin' | 'destination') => {
    if (field === 'origin') {
      // Se for GPS, atualiza localização
      if (suggestion.category === 'gps') {
        setOrigin(gpsAddress || 'Localização Atual');
      } else {
        setOrigin(suggestion.name);
      }
      setShowOriginSuggestions(false);
    } else {
      if (suggestion.category === 'gps') {
        setDestination(gpsAddress || 'Localização Atual');
      } else {
        setDestination(suggestion.name);
      }
      setShowDestinationSuggestions(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Indicador de Conexão Offline/Online */}
      <OfflineIndicator />
      
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              Olá, {userName}! 👋
            </Text>
            <Text style={styles.subtitle}>Bem-vindo ao XiquêGo</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={styles.avatarCircle}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Type Selector - Só mostra se tiver AMBOS os cadastros */}
      {registrations.hasClienteRegistration && registrations.hasMotoristaRegistration && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Você é:</Text>
          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'cliente' && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType('cliente')}
            >
              <Text style={styles.userTypeIcon}>👤</Text>
              <Text
                style={[
                  styles.userTypeText,
                  userType === 'cliente' && styles.userTypeTextActive,
                ]}
              >
                Cliente
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'motorista' && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType('motorista')}
            >
              <Text style={styles.userTypeIcon}>🚗</Text>
              <Text
                style={[
                  styles.userTypeText,
                  userType === 'motorista' && styles.userTypeTextActive,
                ]}
              >
                Motorista
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Mapa Inteligente - Mostra conforme tipo de cadastro */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.mapHeader}
          onPress={() => setShowMapInfo(!showMapInfo)}
        >
          <Text style={styles.sectionTitle}>
            {(() => {
              // Se tem ambos, mostra conforme seleção
              if (registrations.hasClienteRegistration && registrations.hasMotoristaRegistration) {
                return userType === 'motorista' 
                  ? '🗺️ Mapa de Demanda - Xique-Xique' 
                  : '🗺️ Pontos de Interesse - Xique-Xique';
              }
              // Se tem só motorista
              if (registrations.hasMotoristaRegistration) {
                return '🗺️ Mapa de Demanda - Xique-Xique';
              }
              // Se tem só cliente
              return '🗺️ Pontos de Interesse - Xique-Xique';
            })()}
          </Text>
          <Text style={styles.mapToggle}>{showMapInfo ? '▼' : '▶'}</Text>
        </TouchableOpacity>

        {showMapInfo && (
          <View style={styles.mapContainer}>
            {(() => {
              // Determina qual tipo mostrar
              const showMotoristaMap = registrations.hasClienteRegistration && registrations.hasMotoristaRegistration
                ? userType === 'motorista'
                : registrations.hasMotoristaRegistration;
              
              return showMotoristaMap ? (
              <>
                {/* Informações para Motoristas */}
                <View style={styles.mapInfoBanner}>
                  <Text style={styles.mapInfoIcon}>💡</Text>
                  <Text style={styles.mapInfoText}>
                    Lugares mais pedidos e alertas de segurança em tempo real
                  </Text>
                </View>

                <Text style={styles.mapSubtitle}>Demanda de Corridas</Text>
                {mapData.motorista.filter(item => item.type !== 'danger').map((item) => (
                  <View key={item.id} style={styles.mapItem}>
                    <View style={[styles.mapIcon, { backgroundColor: getDemandColor(item.type) + '20' }]}>
                      <Text style={styles.mapIconText}>{item.icon}</Text>
                    </View>
                    <View style={styles.mapInfo}>
                      <Text style={styles.mapName}>{item.name}</Text>
                      <Text style={styles.mapDetails}>
                        Demanda: {item.demand} • {item.rides}
                      </Text>
                    </View>
                    <View style={[styles.demandBadge, { backgroundColor: getDemandColor(item.type) }]}>
                      <Text style={styles.demandText}>{item.demand}</Text>
                    </View>
                  </View>
                ))}

                <Text style={styles.mapSubtitle}>⚠️ Alertas de Segurança</Text>
                {mapData.motorista.filter(item => item.type === 'danger').map((item) => (
                  <View key={item.id} style={[styles.mapItem, styles.dangerItem]}>
                    <View style={[styles.mapIcon, { backgroundColor: '#FF000020' }]}>
                      <Text style={styles.mapIconText}>{item.icon}</Text>
                    </View>
                    <View style={styles.mapInfo}>
                      <Text style={styles.mapName}>{item.name}</Text>
                      <Text style={styles.mapDanger}>
                        Relatos de incidentes • Cuidado extra
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <>
                {/* Informações para Clientes */}
                <View style={styles.mapInfoBanner}>
                  <Text style={styles.mapInfoIcon}>🎯</Text>
                  <Text style={styles.mapInfoText}>
                    Descubra os melhores lugares de Xique-Xique
                  </Text>
                </View>

                <Text style={styles.mapSubtitle}>🎉 Eventos e Festas</Text>
                {mapData.cliente.filter(item => item.type === 'event').map((item) => (
                  <View key={item.id} style={styles.mapItem}>
                    <View style={styles.mapIcon}>
                      <Text style={styles.mapIconText}>{item.icon}</Text>
                    </View>
                    <View style={styles.mapInfo}>
                      <Text style={styles.mapName}>{item.name}</Text>
                      <Text style={styles.mapDetails}>{item.info} • {item.status}</Text>
                    </View>
                  </View>
                ))}

                <Text style={styles.mapSubtitle}>⭐ Restaurantes 5 Estrelas</Text>
                {mapData.cliente.filter(item => item.type === 'restaurant').map((item) => (
                  <View key={item.id} style={styles.mapItem}>
                    <View style={styles.mapIcon}>
                      <Text style={styles.mapIconText}>{item.icon}</Text>
                    </View>
                    <View style={styles.mapInfo}>
                      <Text style={styles.mapName}>{item.name}</Text>
                      <Text style={styles.mapDetails}>
                        {item.info} • Avaliação: {item.rating}
                      </Text>
                    </View>
                  </View>
                ))}

                <Text style={styles.mapSubtitle}>🍔 Lanchonetes e Barracas Famosas</Text>
                {mapData.cliente.filter(item => item.type === 'food').map((item) => (
                  <View key={item.id} style={styles.mapItem}>
                    <View style={styles.mapIcon}>
                      <Text style={styles.mapIconText}>{item.icon}</Text>
                    </View>
                    <View style={styles.mapInfo}>
                      <Text style={styles.mapName}>{item.name}</Text>
                      <Text style={styles.mapDetails}>
                        {item.info} • Especialidade: {item.specialty}
                      </Text>
                    </View>
                  </View>
                ))}

                <Text style={styles.mapSubtitle}>🏊 Lazer</Text>
                {mapData.cliente.filter(item => item.type === 'leisure').map((item) => (
                  <View key={item.id} style={styles.mapItem}>
                    <View style={styles.mapIcon}>
                      <Text style={styles.mapIconText}>{item.icon}</Text>
                    </View>
                    <View style={styles.mapInfo}>
                      <Text style={styles.mapName}>{item.name}</Text>
                      <Text style={styles.mapDetails}>
                        Status: {item.info} • Horário: {item.hours}
                      </Text>
                    </View>
                  </View>
                ))}

                <Text style={styles.mapSubtitle}>🏥 Hospitais e Clínicas</Text>
                {mapData.cliente.filter(item => item.type === 'health').map((item) => (
                  <View key={item.id} style={styles.mapItem}>
                    <View style={styles.mapIcon}>
                      <Text style={styles.mapIconText}>{item.icon}</Text>
                    </View>
                    <View style={styles.mapInfo}>
                      <Text style={styles.mapName}>{item.name}</Text>
                      <Text style={styles.mapDetails}>
                        {item.info} • Espera: {item.wait}
                      </Text>
                    </View>
                  </View>
                ))}

                <Text style={styles.mapSubtitle}>🏫 Escolas</Text>
                {mapData.cliente.filter(item => item.type === 'school').map((item) => (
                  <View key={item.id} style={styles.mapItem}>
                    <View style={styles.mapIcon}>
                      <Text style={styles.mapIconText}>{item.icon}</Text>
                    </View>
                    <View style={styles.mapInfo}>
                      <Text style={styles.mapName}>{item.name}</Text>
                      <Text style={styles.mapDetails}>
                        {item.info} • Alunos: {item.students}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            );
            })()}

            {/* Horários de Pico */}
            <Text style={styles.mapSubtitle}>⏰ Horários de Pico</Text>
            {mapData.peakHours.map((peak, index) => (
              <View key={index} style={styles.peakCard}>
                <Text style={styles.peakLocation}>📍 {peak.location}</Text>
                {peak.morning && (
                  <Text style={styles.peakTime}>
                    Manhã: {peak.morning} | Tarde: {peak.evening}
                  </Text>
                )}
                {peak.days && (
                  <Text style={styles.peakTime}>
                    {peak.days} • {peak.hours} • Pico: {peak.peak}
                  </Text>
                )}
                <View style={styles.peakStatus}>
                  <Text style={styles.peakStatusText}>🔴 {peak.status || 'Movimento Intenso'}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Service Category Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>O que você precisa?</Text>
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              serviceCategory === 'corrida' && styles.categoryButtonActive,
            ]}
            onPress={() => {
              setServiceCategory('corrida');
              setSelectedService('comum');
            }}
          >
            <Text style={styles.categoryIcon}>🚗</Text>
            <Text
              style={[
                styles.categoryText,
                serviceCategory === 'corrida' && styles.categoryTextActive,
              ]}
            >
              Corrida
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryButton,
              serviceCategory === 'entrega' && styles.categoryButtonActive,
            ]}
            onPress={() => {
              setServiceCategory('entrega');
              setSelectedService('entrega_moto');
            }}
          >
            <Text style={styles.categoryIcon}>📦</Text>
            <Text
              style={[
                styles.categoryText,
                serviceCategory === 'entrega' && styles.categoryTextActive,
              ]}
            >
              Entrega
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {serviceCategory === 'corrida' ? 'Para onde vamos?' : 'De onde para onde?'}
        </Text>
        
        <View style={styles.inputContainer}>
          <View>
            <TouchableOpacity 
              style={styles.inputWrapper}
              onPress={() => {
                setShowOriginSuggestions(true);
                setShowDestinationSuggestions(false);
              }}
            >
              <Text style={styles.inputIcon}>📍</Text>
              <TextInput
                style={styles.input}
                placeholder={serviceCategory === 'corrida' ? 'Origem' : 'Retirar de'}
                placeholderTextColor={COLORS.grayDark}
                value={origin}
                onChangeText={setOrigin}
                onFocus={() => {
                  setShowOriginSuggestions(true);
                  setShowDestinationSuggestions(false);
                }}
              />
            </TouchableOpacity>

            {/* Sugestões de Origem */}
            {showOriginSuggestions && (
              <View style={styles.suggestionsContainer}>
                <View style={styles.suggestionsHeader}>
                  <Text style={styles.suggestionsTitle}>Sugestões</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                    {gpsLoading && <ActivityIndicator size="small" color={COLORS.primary} />}
                    <TouchableOpacity onPress={() => setShowOriginSuggestions(false)}>
                      <Text style={styles.suggestionsClose}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView style={{maxHeight: 250}} nestedScrollEnabled>
                  {originSuggestions.map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion.id}
                      style={styles.suggestionItem}
                      onPress={() => handleSelectSuggestion(suggestion, 'origin')}
                    >
                      <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
                      <View style={styles.suggestionInfo}>
                        <Text style={styles.suggestionName}>{suggestion.name}</Text>
                        <Text style={styles.suggestionAddress}>{suggestion.address}</Text>
                      </View>
                      {suggestion.category === 'gps' && (
                        <TouchableOpacity 
                          onPress={() => refreshLocation()}
                          style={{padding: 4}}
                        >
                          <Text style={{fontSize: 16}}>🔄</Text>
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View>
            <TouchableOpacity 
              style={styles.inputWrapper}
              onPress={() => {
                setShowDestinationSuggestions(true);
                setShowOriginSuggestions(false);
              }}
            >
              <Text style={styles.inputIcon}>🎯</Text>
              <TextInput
                style={styles.input}
                placeholder={serviceCategory === 'corrida' ? 'Destino' : 'Entregar em'}
                placeholderTextColor={COLORS.grayDark}
                value={destination}
                onChangeText={setDestination}
                onFocus={() => {
                  setShowDestinationSuggestions(true);
                  setShowOriginSuggestions(false);
                }}
              />
            </TouchableOpacity>

            {/* Sugestões de Destino */}
            {showDestinationSuggestions && (
              <View style={styles.suggestionsContainer}>
                <View style={styles.suggestionsHeader}>
                  <Text style={styles.suggestionsTitle}>Sugestões</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                    {gpsLoading && <ActivityIndicator size="small" color={COLORS.primary} />}
                    <TouchableOpacity onPress={() => setShowDestinationSuggestions(false)}>
                      <Text style={styles.suggestionsClose}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView style={{maxHeight: 250}} nestedScrollEnabled>
                  {destinationSuggestions.map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion.id}
                      style={styles.suggestionItem}
                      onPress={() => handleSelectSuggestion(suggestion, 'destination')}
                    >
                      <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
                      <View style={styles.suggestionInfo}>
                        <Text style={styles.suggestionName}>{suggestion.name}</Text>
                        <Text style={styles.suggestionAddress}>{suggestion.address}</Text>
                      </View>
                      {suggestion.category === 'gps' && (
                        <TouchableOpacity 
                          onPress={() => refreshLocation()}
                          style={{padding: 4}}
                        >
                          <Text style={{fontSize: 16}}>🔄</Text>
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Service Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {serviceCategory === 'corrida' ? 'Tipo de Veículo' : 'Tipo de Entrega'}
        </Text>
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceCard,
                selectedService === service.id && styles.serviceCardActive,
              ]}
              onPress={() => setSelectedService(service.id as any)}
            >
              <Text style={styles.serviceIcon}>{service.icon}</Text>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Extras Section */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.extrasHeader}
          onPress={() => setShowExtras(!showExtras)}
        >
          <Text style={styles.sectionTitle}>Extras e Opções</Text>
          <Text style={styles.extrasToggle}>{showExtras ? '▼' : '▶'}</Text>
        </TouchableOpacity>

        {showExtras && (
          <View style={styles.extrasContainer}>
            <View style={styles.extraItem}>
              <View style={styles.extraInfo}>
                <Text style={styles.extraName}>🧳 Bagagem Extra</Text>
                <Text style={styles.extraPrice}>+ R$ 3,00</Text>
              </View>
              <Switch
                value={extras.bagagem}
                onValueChange={() => toggleExtra('bagagem')}
                trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                thumbColor={COLORS.background}
              />
            </View>

            <View style={styles.extraItem}>
              <View style={styles.extraInfo}>
                <Text style={styles.extraName}>🐕 Pets</Text>
                <Text style={styles.extraPrice}>+ R$ 2,00</Text>
              </View>
              <Switch
                value={extras.pets}
                onValueChange={() => toggleExtra('pets')}
                trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                thumbColor={COLORS.background}
              />
            </View>

            <View style={styles.extraItem}>
              <View style={styles.extraInfo}>
                <Text style={styles.extraName}>⚡ Prioridade</Text>
                <Text style={styles.extraPrice}>+ R$ 5,00</Text>
              </View>
              <Switch
                value={extras.prioridade}
                onValueChange={() => toggleExtra('prioridade')}
                trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                thumbColor={COLORS.background}
              />
            </View>

            <View style={styles.extraItem}>
              <View style={styles.extraInfo}>
                <Text style={styles.extraName}>👴 Assistência Idoso</Text>
                <Text style={styles.extraPrice}>+ R$ 4,00</Text>
              </View>
              <Switch
                value={extras.assistenciaIdoso}
                onValueChange={() => toggleExtra('assistenciaIdoso')}
                trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                thumbColor={COLORS.background}
              />
            </View>

            <View style={styles.extraItem}>
              <View style={styles.extraInfo}>
                <Text style={styles.extraName}>📦 Compra Volumosa</Text>
                <Text style={styles.extraPrice}>+ R$ 4,00</Text>
              </View>
              <Switch
                value={extras.volumoso}
                onValueChange={() => toggleExtra('volumoso')}
                trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                thumbColor={COLORS.background}
              />
            </View>
          </View>
        )}
      </View>

      {/* Price Estimate */}
      {estimate && (
        <View style={styles.section}>
          <View style={styles.estimateCard}>
            <View style={styles.estimateRow}>
              <Text style={styles.estimateLabel}>Distância Estimada</Text>
              <Text style={styles.estimateValue}>{estimate.distance.toFixed(1)} km</Text>
            </View>
            <View style={styles.estimateRow}>
              <Text style={styles.estimateLabel}>Tempo Estimado</Text>
              <Text style={styles.estimateValue}>{estimate.duration} min</Text>
            </View>
            <View style={[styles.estimateRow, styles.estimatePriceRow]}>
              <Text style={styles.estimatePriceLabel}>Valor Estimado</Text>
              <Text style={styles.estimatePriceValue}>R$ {estimate.price.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Payment Method Selection */}
      {origin && destination && (
        <View style={styles.section}>
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onSelect={setPaymentMethod}
          />
        </View>
      )}

      {/* Voucher Input */}
      {origin && destination && paymentMethod && (
        <View style={styles.section}>
          <VoucherInput
            amount={estimate.price}
            userId="user_123" // Em produção, vem do contexto/auth
            isFirstRide={false} // Em produção, vem do backend
            onVoucherApplied={setAppliedVoucher}
          />
        </View>
      )}

      {/* Request Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.requestButton} onPress={handleRequestRide}>
          <Text style={styles.requestButtonText}>
            {serviceCategory === 'corrida' ? 'Solicitar Corrida' : 'Solicitar Entrega'}
          </Text>
          {appliedVoucher && (
            <Text style={styles.requestButtonSubtext}>
              Economize R$ {appliedVoucher.discountAmount.toFixed(2)} • 
              Total: R$ {appliedVoucher.finalAmount.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      {estimate && (
        <RideConfirmationModal
          visible={showModal}
          origin={origin}
          destination={destination}
          serviceType={selectedService}
          price={estimate.price}
          distance={estimate.distance}
          duration={estimate.duration}
          extras={extras}
          onConfirm={handleConfirmRide}
          onCancel={() => setShowModal(false)}
        />
      )}
      </ScrollView>

      {/* Botão Flutuante de Hotspots - Só para Motoristas */}
      <HotspotsButton userType={userType} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.secondary,
    opacity: 0.9,
  },
  profileButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  userTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  userTypeButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF9E6',
  },
  userTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  userTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  userTypeTextActive: {
    color: COLORS.secondary,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapToggle: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  mapContainer: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
  },
  mapInfoBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  mapInfoIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  mapInfoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  mapSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 12,
  },
  mapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  dangerItem: {
    borderColor: '#FF0000',
    backgroundColor: '#FF000005',
  },
  mapIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mapIconText: {
    fontSize: 20,
  },
  mapInfo: {
    flex: 1,
  },
  mapName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  mapDetails: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  mapDanger: {
    fontSize: 12,
    color: '#FF0000',
    fontWeight: '600',
  },
  demandBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  demandText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  peakCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  peakLocation: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  peakTime: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  peakStatus: {
    marginTop: 4,
  },
  peakStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF0000',
  },
  inputContainer: {
    gap: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  suggestionsContainer: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  suggestionsClose: {
    fontSize: 18,
    color: COLORS.grayDark,
    fontWeight: 'bold',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray + '40',
  },
  suggestionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  suggestionAddress: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  serviceCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF9E6',
  },
  serviceIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  requestButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  requestButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  requestButtonSubtext: {
    fontSize: 12,
    color: COLORS.secondary,
    opacity: 0.9,
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  categoryButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF9E6',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  categoryTextActive: {
    color: COLORS.secondary,
  },
  extrasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  extrasToggle: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  extrasContainer: {
    marginTop: 12,
    gap: 12,
  },
  extraItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
  },
  extraInfo: {
    flex: 1,
  },
  extraName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  extraPrice: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  estimateCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  estimateLabel: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  estimateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  estimatePriceRow: {
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.primary,
    marginBottom: 0,
  },
  estimatePriceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  estimatePriceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
});
