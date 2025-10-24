/**
 * Tela: Acompanhamento - Motorista a caminho / Em curso
 * Exibe SEMPRE DriverCard + VehicleBadge
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { useOrder } from '@/contexts/OrderContext';
import { DriverCard } from '@/components/order/driver-card';
import { VehicleBadge } from '@/components/order/vehicle-badge';
import { Divider } from '@/components/ui/divider';

export default function TrackingScreen() {
  const router = useRouter();
  const { order, updateStatus, cancelOrder, completeOrder } = useOrder();
  
  const [eta, setEta] = useState(5); // Minutos até chegar
  const [status, setStatus] = useState<'coming' | 'arrived' | 'in_progress'>('coming');

  useEffect(() => {
    // Simular chegada do motorista
    const timer1 = setTimeout(() => {
      setStatus('arrived');
      Alert.alert(
        `${order?.mode === 'corrida' ? 'Motorista' : 'Entregador'} chegou!`,
        'Seu transporte está aguardando.',
        [{ text: 'OK' }]
      );
    }, 8000); // 8 segundos

    // Simular início da viagem
    const timer2 = setTimeout(() => {
      setStatus('in_progress');
      updateStatus('in_progress');
    }, 12000); // 12 segundos

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    // Simular countdown do ETA
    if (status === 'coming' && eta > 0) {
      const interval = setInterval(() => {
        setEta((prev) => Math.max(0, prev - 1));
      }, 60000); // Cada minuto

      return () => clearInterval(interval);
    }
  }, [status, eta]);

  if (!order || !order.driver || !order.vehicle) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum pedido em andamento</Text>
      </View>
    );
  }

  const handleCancel = () => {
    const fee = status === 'arrived' ? 'Pode haver cobrança de taxa de cancelamento.' : '';
    
    Alert.alert(
      'Cancelar?',
      `Deseja cancelar este pedido? ${fee}`,
      [
        { text: 'Não', style: 'cancel' },
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

  const handleSOS = () => {
    // Mock: contato de emergência
    const emergencyContact = {
      name: 'Maria Bastos',
      phone: '71999887766',
      relationship: 'Mãe',
    };

    Alert.alert(
      '🆘 SOS - Emergência',
      `Ligar para ${emergencyContact.name} (${emergencyContact.relationship})?\n\nTelefone: ${emergencyContact.phone}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ligar agora',
          style: 'destructive',
          onPress: () => {
            Linking.openURL(`tel:${emergencyContact.phone}`);
          },
        },
      ]
    );
  };

  const handleShareRide = () => {
    Alert.alert(
      'Compartilhar viagem',
      'Link de acompanhamento copiado! (Mock)\n\nhttps://xiquego.app/ride/ABC123',
      [{ text: 'OK' }]
    );
  };

  const handleComplete = () => {
    Alert.prompt(
      'Avaliar',
      `Como foi sua experiência com ${order.driver?.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: (comment) => {
            completeOrder(5, comment); // 5 estrelas mock
            router.replace('/order/completed');
          },
        },
      ],
      'plain-text',
      'Deixe um comentário (opcional)'
    );
  };

  const statusText = {
    coming: `${order.mode === 'corrida' ? 'Motorista' : 'Entregador'} a caminho`,
    arrived: `${order.mode === 'corrida' ? 'Motorista' : 'Entregador'} chegou!`,
    in_progress: order.mode === 'corrida' ? 'Viagem em andamento' : 'Entrega em andamento',
  };

  return (
    <View style={styles.container}>
      {/* Header fixo */}
      <View style={styles.header}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{statusText[status]}</Text>
        </View>
        {status === 'coming' && (
          <View style={styles.etaBadge}>
            <Ionicons name="time" size={16} color="#FFF" />
            <Text style={styles.etaText}>{eta} min</Text>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* DriverCard - SEMPRE VISÍVEL */}
        <DriverCard driver={order.driver} />

        {/* VehicleBadge - SEMPRE VISÍVEL */}
        <VehicleBadge
          vehicle={order.vehicle}
          showMudancaAnimais={order.expressoSubtype === 'mudanca_animais'}
        />

        <Divider />

        {/* Rota */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rota</Text>
          
          <View style={styles.locationRow}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText} numberOfLines={2}>
              {order.origin?.address}
            </Text>
          </View>

          <View style={styles.locationLine} />

          <View style={styles.locationRow}>
            <View style={[styles.locationDot, styles.locationDotDestination]} />
            <Text style={styles.locationText} numberOfLines={2}>
              {order.destination?.address}
            </Text>
          </View>
        </View>

        <Divider />

        {/* Segurança */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segurança</Text>

          <TouchableOpacity style={styles.securityButton} onPress={handleShareRide}>
            <Ionicons name="share-social" size={20} color={COLORS.primary} />
            <Text style={styles.securityButtonText}>Compartilhar viagem</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.securityButton, styles.sosButton]} onPress={handleSOS}>
            <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
            <Text style={[styles.securityButtonText, styles.sosButtonText]}>SOS Emergência</Text>
            <Ionicons name="chevron-forward" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        <Divider />

        {/* Informações */}
        {order.estimate && (
          <View style={styles.section}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Distância:</Text>
              <Text style={styles.infoValue}>{order.estimate.distance.toFixed(1)} km</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tempo estimado:</Text>
              <Text style={styles.infoValue}>{order.estimate.duration} min</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Valor:</Text>
              <Text style={styles.infoValue}>R$ {order.estimate.finalPrice.toFixed(2)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Pagamento:</Text>
              <Text style={styles.infoValue}>
                {order.paymentMethod === 'pix' ? 'PIX' : order.paymentMethod === 'cartao' ? 'Cartão' : 'Dinheiro'}
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 160 }} />
      </ScrollView>

      {/* Footer com ações */}
      <View style={styles.footer}>
        {status === 'in_progress' ? (
          <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Concluir viagem</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flex: 1,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  etaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 6,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    marginRight: 12,
    marginTop: 4,
  },
  locationDotDestination: {
    backgroundColor: '#4DD0E1',
  },
  locationLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E0E0E0',
    marginLeft: 5,
    marginVertical: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  securityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  securityButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
  },
  sosButton: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  sosButtonText: {
    color: '#FF6B6B',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  footer: {
    backgroundColor: '#FFF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  completeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

