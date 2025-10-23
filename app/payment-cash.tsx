/**
 * Tela de Pagamento em Dinheiro
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { PaymentService } from '../services/payment.service';

export default function PaymentCashScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const amount = Number(params.amount) || 0;
  const rideId = params.rideId as string || 'ride_test';
  const userId = params.userId as string || 'user_123';
  const driverId = params.driverId as string || 'driver_456';

  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const paymentService = PaymentService.getInstance();
  const commission = paymentService.calculateCommission(amount);

  const confirmPayment = async () => {
    Alert.alert(
      'Confirmar Pagamento',
      `O cliente pagou R$ ${amount.toFixed(2)} em dinheiro?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              setConfirming(true);
              
              await paymentService.confirmCashPayment(
                amount,
                userId,
                driverId,
                rideId
              );

              setConfirmed(true);
              
              // Envia recibo por email (simulado)
              console.log('📧 Enviando recibo para o email do cliente...');
              
              Alert.alert(
                '✅ Pagamento Confirmado!',
                `Você receberá R$ ${commission.driverAmount.toFixed(2)}\n\n` +
                `Taxa do app (${commission.commissionPercentage}%): R$ ${commission.commissionAmount.toFixed(2)}\n\n` +
                `📧 Recibo enviado por email para o cliente.`,
                [
                  {
                    text: 'OK',
                    onPress: () => router.push('/(tabs)/'),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível confirmar o pagamento.');
            } finally {
              setConfirming(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pagamento em Dinheiro</Text>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Valor a pagar</Text>
          <Text style={styles.amount}>R$ {amount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>💵</Text>
        </View>

        <Text style={styles.sectionTitle}>Como funciona</Text>
        <View style={styles.instructions}>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>1</Text>
            <Text style={styles.instructionText}>
              Ao final da corrida, o cliente pagará diretamente ao motorista
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>2</Text>
            <Text style={styles.instructionText}>
              Motorista recebe o dinheiro e confirma no app
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>3</Text>
            <Text style={styles.instructionText}>
              A taxa de {commission.commissionPercentage}% será descontada automaticamente no próximo saque
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalhamento</Text>
        <View style={styles.breakdown}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Valor total da corrida:</Text>
            <Text style={styles.breakdownValue}>R$ {amount.toFixed(2)}</Text>
          </View>
          <View style={styles.breakdownSeparator} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Motorista recebe:</Text>
            <Text style={[styles.breakdownValue, styles.breakdownHighlight]}>
              R$ {commission.driverAmount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>
              Taxa XiqueGO ({commission.commissionPercentage}%):
            </Text>
            <Text style={styles.breakdownValue}>
              R$ {commission.commissionAmount.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {!confirmed && (
        <View style={styles.section}>
          <View style={styles.alert}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Atenção Motorista</Text>
              <Text style={styles.alertText}>
                Confirme o pagamento SOMENTE após receber o dinheiro do cliente.
                A taxa XiqueGO de {commission.commissionPercentage}% será descontada automaticamente.
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        {confirmed ? (
          <View style={styles.successCard}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Pagamento Confirmado!</Text>
            <Text style={styles.successText}>
              O motorista recebeu R$ {commission.driverAmount.toFixed(2)}
            </Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={confirmPayment}
              disabled={confirming}
            >
              {confirming ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.confirmButtonText}>
                    ✓ Confirmar Recebimento
                  </Text>
                  <Text style={styles.confirmButtonSubtext}>
                    (Somente após receber o dinheiro)
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>
                Escolher Outra Forma de Pagamento
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Importante</Text>
          <Text style={styles.infoText}>
            • O cliente deve ter dinheiro em mãos{'\n'}
            • Confirme o valor antes de iniciar a corrida{'\n'}
            • Tenha troco disponível se necessário{'\n'}
            • A taxa será descontada no próximo saque
          </Text>
        </View>
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
    backgroundColor: '#FF9800',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
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
    marginTop: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  icon: {
    fontSize: 80,
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
  instructions: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF9800',
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 28,
  },
  breakdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  breakdownSeparator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  breakdownHighlight: {
    fontSize: 16,
    color: '#4CAF50',
  },
  alert: {
    flexDirection: 'row',
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 13,
    color: '#856404',
    lineHeight: 20,
  },
  actions: {
    padding: 20,
    paddingTop: 0,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  confirmButtonSubtext: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#666',
  },
  successCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: '#388e3c',
    textAlign: 'center',
  },
  info: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    margin: 20,
    marginTop: 0,
    marginBottom: 40,
    padding: 16,
    borderRadius: 12,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#1976d2',
    lineHeight: 20,
  },
});

