/**
 * Tela de Pagamento via PIX
 */

import { useState, useEffect } from 'react';
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
import * as Clipboard from 'expo-clipboard';
import { PaymentService } from '../services/payment.service';

export default function PaymentPixScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const amount = Number(params.amount) || 0;
  const rideId = params.rideId as string || 'ride_test';
  const userId = params.userId as string || 'user_123';
  const driverId = params.driverId as string || 'driver_456';

  const [loading, setLoading] = useState(true);
  const [pixData, setPixData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutos

  const paymentService = PaymentService.getInstance();

  useEffect(() => {
    generatePixPayment();
  }, []);

  useEffect(() => {
    // Contador de tempo
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  const generatePixPayment = async () => {
    try {
      setLoading(true);
      const pix = await paymentService.createPixPayment(
        amount,
        `Corrida ${rideId}`,
        userId,
        rideId
      );
      setPixData(pix);
    } catch (error: any) {
      Alert.alert(
        'Erro',
        'Não foi possível gerar o código PIX. Tente novamente.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = async () => {
    if (pixData?.pixKey) {
      await Clipboard.setStringAsync(pixData.pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const checkPaymentStatus = async () => {
    if (!pixData?.id) return;

    try {
      setChecking(true);
      const status = await paymentService.checkPaymentStatus(pixData.id);
      
      if (status === 'approved') {
        // Envia recibo por email (simulado)
        console.log('📧 Enviando recibo para o email do cliente...');
        
        Alert.alert(
          '✅ Pagamento Aprovado!',
          'Seu pagamento foi confirmado com sucesso.\n\n📧 Enviamos um recibo por email com os detalhes da corrida.',
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
      } else if (status === 'pending' || status === 'in_process') {
        Alert.alert(
          '⏳ Aguardando Pagamento',
          'Ainda não identificamos seu pagamento. Aguarde alguns segundos.'
        );
      } else {
        Alert.alert(
          '❌ Pagamento não Aprovado',
          'Houve um problema com seu pagamento. Tente outro método.'
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível verificar o pagamento.');
    } finally {
      setChecking(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Gerando código PIX...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pagamento via PIX</Text>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Valor a pagar</Text>
          <Text style={styles.amount}>R$ {amount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.timer}>
          <Text style={styles.timerIcon}>⏱️</Text>
          <View>
            <Text style={styles.timerLabel}>Tempo restante</Text>
            <Text style={styles.timerValue}>{formatTime(timeRemaining)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Instruções</Text>
        <View style={styles.instructions}>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>1</Text>
            <Text style={styles.instructionText}>
              Abra o app do seu banco
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>2</Text>
            <Text style={styles.instructionText}>
              Escolha pagar com PIX via QR Code ou Copia e Cola
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>3</Text>
            <Text style={styles.instructionText}>
              Escaneie o código ou cole a chave PIX
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>4</Text>
            <Text style={styles.instructionText}>
              Confirme o pagamento e clique em "Verificar Pagamento"
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>QR Code PIX</Text>
        <View style={styles.qrCodeContainer}>
          <View style={styles.qrCodePlaceholder}>
            <Text style={styles.qrCodeText}>📱</Text>
            <Text style={styles.qrCodeLabel}>QR Code</Text>
            <Text style={styles.qrCodeSubtext}>
              Escaneie no app do seu banco
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chave PIX Copia e Cola</Text>
        <View style={styles.pixKeyContainer}>
          <Text style={styles.pixKey} numberOfLines={3}>
            {pixData?.pixKey || 'Gerando...'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.copyButton, copied && styles.copyButtonSuccess]}
          onPress={copyPixCode}
        >
          <Text style={styles.copyButtonText}>
            {copied ? '✓ Copiado!' : '📋 Copiar Chave PIX'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.checkButton}
          onPress={checkPaymentStatus}
          disabled={checking}
        >
          {checking ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkButtonText}>
              🔍 Verificar Pagamento
            </Text>
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

      <View style={styles.info}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          O pagamento é processado instantaneamente após a confirmação no seu banco.
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  timerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  timerLabel: {
    fontSize: 12,
    color: '#856404',
  },
  timerValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#856404',
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
    backgroundColor: '#4CAF50',
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
  qrCodeContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  qrCodePlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCodeText: {
    fontSize: 64,
  },
  qrCodeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  qrCodeSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  pixKeyContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  pixKey: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
  },
  copyButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  copyButtonSuccess: {
    backgroundColor: '#2e7d32',
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  actions: {
    padding: 20,
    paddingTop: 0,
  },
  checkButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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
  info: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e3f2fd',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1976d2',
    lineHeight: 20,
  },
});

