/**
 * Notificação de Nova Corrida para Motorista
 * Modal que aparece quando chega uma nova solicitação
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface NewRideNotificationProps {
  visible: boolean;
  rideData: {
    rideId: string;
    passengerName: string;
    passengerPhone: string;
    passengerRating: number;
    origin: {
      address: string;
      latitude: number;
      longitude: number;
    };
    destination: {
      address: string;
      latitude: number;
      longitude: number;
    };
    distance: number;
    duration: number;
    price: number;
    paymentMethod: string;
  };
  onAccept: (rideId: string) => void;
  onReject: (rideId: string) => void;
}

export function NewRideNotification({
  visible,
  rideData,
  onAccept,
  onReject,
}: NewRideNotificationProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(30); // 30 segundos para aceitar
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      // Animar entrada
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();

      // Iniciar contador regressivo
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onReject(rideData.rideId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      scaleAnim.setValue(0);
      setTimeLeft(30);
    }
  }, [visible]);

  const handleAccept = () => {
    onAccept(rideData.rideId);
  };

  const handleReject = () => {
    Alert.alert(
      'Corrida Recusada',
      'Você recusou esta corrida. Continuará recebendo novas solicitações.',
      [{ text: 'OK', onPress: () => onReject(rideData.rideId) }]
    );
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Timer */}
          <View style={styles.timerContainer}>
            <View style={[styles.timerCircle, timeLeft < 10 && styles.timerCircleUrgent]}>
              <Text style={styles.timerText}>{timeLeft}s</Text>
            </View>
            <Text style={styles.timerLabel}>para aceitar</Text>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="notifications" size={32} color={COLORS.primary} />
            <Text style={styles.title}>Nova Corrida!</Text>
          </View>

          {/* Informações do Passageiro */}
          <View style={styles.passengerSection}>
            <View style={styles.passengerAvatar}>
              <Text style={styles.passengerInitial}>
                {rideData.passengerName.charAt(0)}
              </Text>
            </View>
            <View style={styles.passengerInfo}>
              <Text style={styles.passengerName}>{rideData.passengerName}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#FFB900" />
                <Text style={styles.ratingText}>{rideData.passengerRating.toFixed(1)}</Text>
              </View>
            </View>
          </View>

          {/* Rota */}
          <View style={styles.routeSection}>
            <View style={styles.routeItem}>
              <View style={[styles.routeDot, styles.routeDotOrigin]} />
              <Text style={styles.routeLabel} numberOfLines={2}>
                {rideData.origin.address}
              </Text>
            </View>

            <View style={styles.routeLine} />

            <View style={styles.routeItem}>
              <View style={[styles.routeDot, styles.routeDotDestination]} />
              <Text style={styles.routeLabel} numberOfLines={2}>
                {rideData.destination.address}
              </Text>
            </View>
          </View>

          {/* Informações da Corrida */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="navigate" size={20} color={COLORS.primary} />
              <Text style={styles.infoValue}>{rideData.distance.toFixed(1)} km</Text>
              <Text style={styles.infoLabel}>Distância</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="time" size={20} color={COLORS.primary} />
              <Text style={styles.infoValue}>{Math.round(rideData.duration)} min</Text>
              <Text style={styles.infoLabel}>Tempo</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="cash" size={20} color="#4CAF50" />
              <Text style={styles.infoValue}>R$ {rideData.price.toFixed(2)}</Text>
              <Text style={styles.infoLabel}>{rideData.paymentMethod}</Text>
            </View>
          </View>

          {/* Botões de Ação */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
              <Ionicons name="close" size={24} color="#FFF" />
              <Text style={styles.rejectButtonText}>Recusar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
              <Ionicons name="checkmark" size={24} color="#FFF" />
              <Text style={styles.acceptButtonText}>Aceitar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: SCREEN_WIDTH - 40,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  timerContainer: {
    position: 'absolute',
    top: -40,
    right: 20,
    alignItems: 'center',
  },
  timerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  timerCircleUrgent: {
    backgroundColor: '#FF5252',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  timerLabel: {
    fontSize: 12,
    color: '#FFF',
    marginTop: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  passengerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  passengerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  passengerInitial: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
  },
  routeSection: {
    marginBottom: 20,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  routeDotOrigin: {
    backgroundColor: COLORS.primary,
  },
  routeDotDestination: {
    backgroundColor: COLORS.secondary,
  },
  routeLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E0E0E0',
    marginLeft: 5,
    marginVertical: 4,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5252',
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    marginLeft: 8,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
});

