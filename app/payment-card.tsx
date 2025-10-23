/**
 * Tela de Pagamento com Cartão
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { PaymentService } from '../services/payment.service';
import type { CardData } from '../types/payment.types';

export default function PaymentCardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const amount = Number(params.amount) || 0;
  const rideId = params.rideId as string || 'ride_test';
  const userId = params.userId as string || 'user_123';
  const driverId = params.driverId as string || 'driver_456';

  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState<CardData>({
    number: '',
    holderName: '',
    expirationMonth: '',
    expirationYear: '',
    cvv: '',
    cpf: '',
  });
  const [installments, setInstallments] = useState(1);

  const paymentService = PaymentService.getInstance();

  const formatCardNumber = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    const formatted = numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19);
  };

  const formatCPF = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .substring(0, 14);
  };

  const formatExpiry = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
    }
    return numbers;
  };

  const validateCard = (): boolean => {
    const cardNumberClean = cardData.number.replace(/\s/g, '');

    // Valida número do cartão
    if (cardNumberClean.length < 13 || cardNumberClean.length > 19) {
      Alert.alert('Erro', 'Número do cartão inválido');
      return false;
    }

    // Verifica se é cartão bloqueado
    if (paymentService.isBlockedCardType(cardNumberClean)) {
      Alert.alert(
        '⚠️ Cartão não Aceito',
        'Não aceitamos vale-refeição ou vale-alimentação. Por favor, use outro cartão.'
      );
      return false;
    }

    // Valida nome
    if (cardData.holderName.length < 3) {
      Alert.alert('Erro', 'Nome do titular inválido');
      return false;
    }

    // Valida validade
    const month = parseInt(cardData.expirationMonth);
    const year = parseInt(cardData.expirationYear);
    if (month < 1 || month > 12 || year < new Date().getFullYear() % 100) {
      Alert.alert('Erro', 'Data de validade inválida');
      return false;
    }

    // Valida CVV
    if (cardData.cvv.length < 3 || cardData.cvv.length > 4) {
      Alert.alert('Erro', 'CVV inválido');
      return false;
    }

    // Valida CPF
    const cpfClean = cardData.cpf.replace(/\D/g, '');
    if (cpfClean.length !== 11) {
      Alert.alert('Erro', 'CPF inválido');
      return false;
    }

    return true;
  };

  const processPayment = async () => {
    if (!validateCard()) return;

    try {
      setLoading(true);

      // 1. Cria token do cartão
      const cardToken = await paymentService.createCardToken(cardData);

      // 2. Processa pagamento
      const payment = await paymentService.processCardPayment(
        cardToken,
        amount,
        `Corrida ${rideId}`,
        userId,
        rideId,
        installments
      );

      if (payment.status === 'approved') {
        // Envia recibo por email (simulado)
        console.log('📧 Enviando recibo para o email do cliente...');
        
        Alert.alert(
          '✅ Pagamento Aprovado!',
          `Seu pagamento foi aprovado com sucesso.\n\nCartão: **** ${payment.last4}\n\n📧 Enviamos um recibo por email com os detalhes da corrida.`,
          [
            {
              text: 'Avaliar Corrida',
              onPress: () => router.push(`/feedback?ride=${rideId}`),
            },
            {
              text: 'Ir para Início',
              onPress: () => router.push('/(tabs)/'),
              style: 'cancel',
            },
          ]
        );
      } else if (payment.status === 'pending' || payment.status === 'in_process') {
        Alert.alert(
          '⏳ Pagamento em Análise',
          'Seu pagamento está sendo processado. Você receberá uma notificação em breve.'
        );
      } else {
        Alert.alert(
          '❌ Pagamento Recusado',
          'Seu pagamento foi recusado. Verifique os dados do cartão ou tente outro método.'
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Erro',
        'Não foi possível processar o pagamento. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const installmentOptions = [];
  for (let i = 1; i <= 12; i++) {
    const installmentAmount = amount / i;
    installmentOptions.push({ value: i, label: `${i}x R$ ${installmentAmount.toFixed(2)}` });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pagamento com Cartão</Text>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Valor a pagar</Text>
          <Text style={styles.amount}>R$ {amount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados do Cartão</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número do Cartão</Text>
          <TextInput
            style={styles.input}
            value={cardData.number}
            onChangeText={(text) => setCardData({ ...cardData, number: formatCardNumber(text) })}
            placeholder="0000 0000 0000 0000"
            keyboardType="numeric"
            maxLength={19}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome no Cartão</Text>
          <TextInput
            style={styles.input}
            value={cardData.holderName}
            onChangeText={(text) => setCardData({ ...cardData, holderName: text.toUpperCase() })}
            placeholder="NOME COMPLETO"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Validade</Text>
            <TextInput
              style={styles.input}
              value={`${cardData.expirationMonth}${cardData.expirationMonth.length === 2 ? '/' : ''}${cardData.expirationYear}`}
              onChangeText={(text) => {
                const numbers = text.replace(/\D/g, '');
                setCardData({
                  ...cardData,
                  expirationMonth: numbers.substring(0, 2),
                  expirationYear: numbers.substring(2, 4),
                });
              }}
              placeholder="MM/AA"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              value={cardData.cvv}
              onChangeText={(text) => setCardData({ ...cardData, cvv: text.replace(/\D/g, '') })}
              placeholder="123"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>CPF do Titular</Text>
          <TextInput
            style={styles.input}
            value={cardData.cpf}
            onChangeText={(text) => setCardData({ ...cardData, cpf: formatCPF(text) })}
            placeholder="000.000.000-00"
            keyboardType="numeric"
            maxLength={14}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parcelamento</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.installmentsContainer}>
            {installmentOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.installmentButton,
                  installments === option.value && styles.installmentButtonActive,
                ]}
                onPress={() => setInstallments(option.value)}
              >
                <Text
                  style={[
                    styles.installmentText,
                    installments === option.value && styles.installmentTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={processPayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.payButtonText}>Pagar R$ {amount.toFixed(2)}</Text>
              {installments > 1 && (
                <Text style={styles.payButtonSubtext}>
                  em {installments}x de R$ {(amount / installments).toFixed(2)}
                </Text>
              )}
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
      </View>

      <View style={styles.security}>
        <Text style={styles.securityIcon}>🔒</Text>
        <View style={styles.securityInfo}>
          <Text style={styles.securityTitle}>Transação Segura</Text>
          <Text style={styles.securityText}>
            Seus dados são criptografados e não são armazenados em nossos servidores
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
    backgroundColor: '#2196F3',
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
  },
  installmentsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  installmentButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  installmentButtonActive: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  installmentText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  installmentTextActive: {
    color: '#2196F3',
  },
  actions: {
    padding: 20,
    paddingTop: 0,
  },
  payButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  payButtonSubtext: {
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
    marginBottom: 40,
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

