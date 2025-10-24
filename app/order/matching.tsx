/**
 * Tela: Buscando Motorista/Entregador
 * Modal de matching com tentativas e fallback
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { useOrder } from '@/contexts/OrderContext';

export default function MatchingScreen() {
  const router = useRouter();
  const { order, searchDriver, cancelOrder } = useOrder();
  
  const [attempt, setAttempt] = useState(1);
  const [maxAttempts] = useState(3);
  const [searching, setSearching] = useState(true);

  useEffect(() => {
    attemptMatch();
  }, []);

  const attemptMatch = async () => {
    if (!order) return;

    setSearching(true);

    const found = await searchDriver();

    if (found) {
      // Motorista encontrado! Navegar para tracking
      router.replace('/order/tracking');
    } else {
      // Não encontrou
      if (attempt < maxAttempts) {
        // Tentar novamente
        Alert.alert(
          'Tentando novamente...',
          `Tentativa ${attempt} de ${maxAttempts}. Buscando outro ${order.mode === 'corrida' ? 'motorista' : 'entregador'}.`,
          [
            {
              text: 'OK',
              onPress: () => {
                setAttempt(attempt + 1);
                attemptMatch();
              },
            },
            {
              text: 'Cancelar',
              style: 'cancel',
              onPress: handleCancel,
            },
          ]
        );
      } else {
        // Esgotou tentativas
        Alert.alert(
          'Sem disponibilidade',
          `Não encontramos ${order.mode === 'corrida' ? 'motoristas' : 'entregadores'} disponíveis no momento.`,
          [
            {
              text: 'Tentar novamente',
              onPress: () => {
                setAttempt(1);
                attemptMatch();
              },
            },
            {
              text: 'Cancelar pedido',
              style: 'destructive',
              onPress: handleCancel,
            },
          ]
        );
        setSearching(false);
      }
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar pedido?',
      'Tem certeza que deseja cancelar este pedido?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: () => {
            cancelOrder('Cancelado pelo usuário');
            router.replace('/(tabs)');
          },
        },
      ]
    );
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
      {/* Animação de busca */}
      <View style={styles.searchAnimation}>
        {searching ? (
          <>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <View style={styles.pulse1} />
            <View style={styles.pulse2} />
            <View style={styles.pulse3} />
          </>
        ) : (
          <Ionicons name="alert-circle" size={80} color="#FF6B6B" />
        )}
      </View>

      {/* Texto */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {searching
            ? `Procurando ${order.mode === 'corrida' ? 'motorista' : 'entregador'}...`
            : 'Sem disponibilidade'}
        </Text>
        
        <Text style={styles.subtitle}>
          {searching
            ? `Tentativa ${attempt} de ${maxAttempts}`
            : 'Não encontramos ninguém disponível no momento'}
        </Text>

        {searching && (
          <Text style={styles.info}>
            Estamos conectando você com os melhores {order.mode === 'corrida' ? 'motoristas' : 'entregadores'} da região!
          </Text>
        )}
      </View>

      {/* Detalhes do pedido */}
      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={20} color={COLORS.primary} />
          <Text style={styles.detailText} numberOfLines={1}>
            {order.origin?.address}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="navigate" size={20} color="#4DD0E1" />
          <Text style={styles.detailText} numberOfLines={1}>
            {order.destination?.address}
          </Text>
        </View>

        {order.estimate && (
          <View style={styles.detailRow}>
            <Ionicons name="cash" size={20} color="#4CAF50" />
            <Text style={styles.detailText}>
              R$ {order.estimate.finalPrice.toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      {/* Botão Cancelar */}
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelButtonText}>Cancelar pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchAnimation: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  pulse1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(253, 185, 19, 0.2)',
  },
  pulse2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(253, 185, 19, 0.15)',
  },
  pulse3: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(253, 185, 19, 0.1)',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  orderDetails: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});

