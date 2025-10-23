/**
 * Tela de Seleção de Método de Pagamento
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { PaymentService } from '../services/payment.service';

export default function PaymentSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Dados da corrida vindos da navegação
  const rideAmount = Number(params.amount) || 0;
  const rideId = params.rideId as string || 'ride_test';
  const userId = params.userId as string || 'user_123';
  const driverId = params.driverId as string || 'driver_456';

  const paymentService = PaymentService.getInstance();
  const commission = paymentService.calculateCommission(rideAmount);

  const handlePaymentMethod = (method: string) => {
    switch (method) {
      case 'pix':
        router.push({
          pathname: '/payment-pix',
          params: {
            amount: rideAmount,
            rideId,
            userId,
            driverId,
          },
        });
        break;
      
      case 'card':
        router.push({
          pathname: '/payment-card',
          params: {
            amount: rideAmount,
            rideId,
            userId,
            driverId,
          },
        });
        break;
      
      case 'cash':
        router.push({
          pathname: '/payment-cash',
          params: {
            amount: rideAmount,
            rideId,
            userId,
            driverId,
          },
        });
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>XiqueGO Pagamentos</Text>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Valor total</Text>
          <Text style={styles.amount}>R$ {rideAmount.toFixed(2)}</Text>
          
          <View style={styles.breakdown}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Motorista recebe:</Text>
              <Text style={styles.breakdownValue}>
                R$ {commission.driverAmount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Taxa ({commission.commissionPercentage}%):</Text>
              <Text style={styles.breakdownValue}>
                R$ {commission.commissionAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Escolha a forma de pagamento</Text>

        {/* PIX */}
        <TouchableOpacity
          style={styles.methodCard}
          onPress={() => handlePaymentMethod('pix')}
        >
          <View style={styles.methodIcon}>
            <Text style={styles.methodEmoji}>📱</Text>
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodName}>PIX</Text>
            <Text style={styles.methodDescription}>
              Aprovação instantânea • QR Code
            </Text>
          </View>
          <Text style={styles.methodArrow}>›</Text>
        </TouchableOpacity>

        {/* Cartão de Crédito */}
        <TouchableOpacity
          style={styles.methodCard}
          onPress={() => handlePaymentMethod('card')}
        >
          <View style={styles.methodIcon}>
            <Text style={styles.methodEmoji}>💳</Text>
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodName}>Cartão de Crédito/Débito</Text>
            <Text style={styles.methodDescription}>
              Todas as bandeiras • Até 12x
            </Text>
          </View>
          <Text style={styles.methodArrow}>›</Text>
        </TouchableOpacity>

        {/* Dinheiro */}
        <TouchableOpacity
          style={styles.methodCard}
          onPress={() => handlePaymentMethod('cash')}
        >
          <View style={styles.methodIcon}>
            <Text style={styles.methodEmoji}>💵</Text>
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodName}>Dinheiro</Text>
            <Text style={styles.methodDescription}>
              Pague diretamente ao motorista
            </Text>
          </View>
          <Text style={styles.methodArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.security}>
        <Text style={styles.securityIcon}>🔒</Text>
        <View style={styles.securityInfo}>
          <Text style={styles.securityTitle}>Pagamento Seguro</Text>
          <Text style={styles.securityText}>
            Suas informações são protegidas com criptografia de ponta a ponta
          </Text>
        </View>
      </View>

      <View style={styles.blocked}>
        <Text style={styles.blockedTitle}>⚠️ Importante</Text>
        <Text style={styles.blockedText}>
          Não aceitamos vale-refeição ou vale-alimentação
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  amountCard: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 20,
  },
  amountLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  breakdown: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodEmoji: {
    fontSize: 24,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 13,
    color: '#666',
  },
  methodArrow: {
    fontSize: 28,
    color: '#ccc',
  },
  security: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  securityIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 4,
  },
  securityText: {
    fontSize: 12,
    color: '#388e3c',
  },
  blocked: {
    backgroundColor: '#fff3e0',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffb74d',
  },
  blockedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 4,
  },
  blockedText: {
    fontSize: 13,
    color: '#ef6c00',
  },
});

