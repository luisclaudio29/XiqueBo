import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import AuthService from '@/services/auth.service';
import OfflineIndicator from '@/components/offline-indicator';
import HotspotsButton from '@/components/hotspots-button';

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('Cliente');
  const [userAddress, setUserAddress] = useState('Carregando localização...');
  const [notificationCount, setNotificationCount] = useState(3);
  const [onlineDrivers, setOnlineDrivers] = useState(23);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        setUserName(user.nome || 'Cliente');
        if (user.endereco) {
          const addr = user.endereco;
          setUserAddress(`${addr.rua || ''}, ${addr.cidade || 'Xique-Xique'} - ${addr.estado || 'BA'}`);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleRideRequest = () => {
    router.push({ pathname: '/order/category', params: { mode: 'corrida' } });
  };

  const handleDeliveryRequest = () => {
    router.push({ pathname: '/order/category', params: { mode: 'entrega' } });
  };

  const favoriteAddresses = [
    {
      id: '1',
      icon: '🏠',
      name: 'Casa',
      address: 'Av. JJ Seabra, 123',
      count: 15,
    },
    {
      id: '2',
      icon: '💼',
      name: 'Trabalho',
      address: 'Rua Coronel Durval, 456',
      count: 12,
    },
    {
      id: '3',
      icon: '🛒',
      name: 'Feira Municipal',
      address: 'Centro de Xique-Xique',
      count: 8,
    },
    {
      id: '4',
      icon: '🏥',
      name: 'Hospital',
      address: 'Hospital Municipal',
      count: 5,
    },
  ];

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

        {/* Seus endereços favoritos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Seus endereços favoritos</Text>
            <TouchableOpacity>
              <Text style={styles.updateButton}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {favoriteAddresses.map((place) => (
            <TouchableOpacity key={place.id} style={styles.favoriteCard}>
              <View style={styles.favoriteIcon}>
                <Text style={styles.favoriteEmoji}>{place.icon}</Text>
              </View>
              <View style={styles.favoriteInfo}>
                <Text style={styles.favoriteName}>{place.name}</Text>
                <Text style={styles.favoriteAddress}>{place.address}</Text>
                <Text style={styles.favoriteCount}>Pedido {place.count}x</Text>
              </View>
              <View style={styles.favoriteArrow}>
                <Ionicons name="arrow-forward" size={24} color={COLORS.primary} />
              </View>
            </TouchableOpacity>
          ))}
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

      {/* Botão Flutuante de Hotspots - Só para Motoristas */}
      <HotspotsButton userType="cliente" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
});
