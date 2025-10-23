import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { PRICING } from '@/types/ride.types';

type PaymentMethod = 'pix' | 'card' | 'cash';

export default function ConfirmServiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const {
    serviceType,
    rideType,
    deliveryType,
    originAddress,
    destinationAddress,
    distance,
    duration,
    price,
  } = params;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    if (!paymentMethod) {
      Alert.alert('Erro', 'Selecione uma forma de pagamento');
      return;
    }

    setIsConfirming(true);

    // Simular processamento
    setTimeout(() => {
      setIsConfirming(false);
      
      Alert.alert(
        '🎉 Pedido Confirmado!',
        'Procurando motorista próximo...',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    }, 2000);
  };

  const serviceTypeLabel =
    serviceType === 'corrida'
      ? rideType === 'moto'
        ? '🏍️ Corrida de Moto'
        : rideType === 'taxi'
        ? '🚗 Corrida de Táxi/Carro'
        : '⚡ Corrida Expressa'
      : deliveryType === 'bicicleta'
      ? '🚴 Entrega de Bicicleta'
      : deliveryType === 'moto'
      ? '🏍️ Entrega de Moto'
      : deliveryType === 'carro'
      ? '🚗 Entrega de Carro'
      : '🚜 Entrega Rural';

  const priceValue = parseFloat(price as string);
  const companyFee = priceValue * PRICING.companyCommission;
  const driverEarnings = priceValue - companyFee;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Confirmar Pedido</Text>
          <Text style={styles.serviceType}>{serviceTypeLabel}</Text>
        </View>

        {/* Detalhes da Rota */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 Detalhes da Rota</Text>
          
          <View style={styles.routeItem}>
            <View style={styles.routeMarker} style={{ backgroundColor: COLORS.primary }} />
            <View style={styles.routeContent}>
              <Text style={styles.routeLabel}>Origem</Text>
              <Text style={styles.routeAddress}>{originAddress}</Text>
            </View>
          </View>

          <View style={styles.routeLine} />

          <View style={styles.routeItem}>
            <View style={[styles.routeMarker, { backgroundColor: COLORS.secondary }]} />
            <View style={styles.routeContent}>
              <Text style={styles.routeLabel}>Destino</Text>
              <Text style={styles.routeAddress}>{destinationAddress}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="speedometer" size={20} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Distância</Text>
              <Text style={styles.infoValue}>{distance} km</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="time" size={20} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Tempo</Text>
              <Text style={styles.infoValue}>{duration} min</Text>
            </View>
          </View>
        </View>

        {/* Forma de Pagamento */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💳 Forma de Pagamento</Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'pix' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('pix')}
          >
            <View style={styles.paymentLeft}>
              <Ionicons
                name="qr-code"
                size={32}
                color={paymentMethod === 'pix' ? COLORS.primary : COLORS.textLight}
              />
              <View>
                <Text style={styles.paymentTitle}>PIX</Text>
                <Text style={styles.paymentDescription}>Pagamento instantâneo</Text>
              </View>
            </View>
            {paymentMethod === 'pix' && (
              <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <View style={styles.paymentLeft}>
              <Ionicons
                name="card"
                size={32}
                color={paymentMethod === 'card' ? COLORS.primary : COLORS.textLight}
              />
              <View>
                <Text style={styles.paymentTitle}>Cartão</Text>
                <Text style={styles.paymentDescription}>Crédito ou Débito</Text>
              </View>
            </View>
            {paymentMethod === 'card' && (
              <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'cash' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('cash')}
          >
            <View style={styles.paymentLeft}>
              <Ionicons
                name="cash"
                size={32}
                color={paymentMethod === 'cash' ? COLORS.primary : COLORS.textLight}
              />
              <View>
                <Text style={styles.paymentTitle}>Dinheiro</Text>
                <Text style={styles.paymentDescription}>Pague ao motorista</Text>
              </View>
            </View>
            {paymentMethod === 'cash' && (
              <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Resumo de Valores */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💰 Resumo de Valores</Text>

          <View style={styles.valueRow}>
            <Text style={styles.valueLabel}>Valor da corrida</Text>
            <Text style={styles.valueAmount}>R$ {priceValue.toFixed(2)}</Text>
          </View>

          <View style={styles.valueRow}>
            <Text style={styles.valueSmall}>Taxa da plataforma (2%)</Text>
            <Text style={styles.valueSmall}>- R$ {companyFee.toFixed(2)}</Text>
          </View>

          <View style={styles.valueRow}>
            <Text style={styles.valueSmall}>Ganho do motorista</Text>
            <Text style={styles.valueSmall}>R$ {driverEarnings.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total a Pagar</Text>
            <Text style={styles.totalValue}>R$ {priceValue.toFixed(2)}</Text>
          </View>
        </View>

        {/* Informações Adicionais */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            {serviceType === 'corrida'
              ? 'Seu motorista será notificado imediatamente. Acompanhe em tempo real na tela principal.'
              : 'Seu entregador será notificado imediatamente. Você pode acompanhar a entrega em tempo real.'}
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Botão Fixo */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, (!paymentMethod || isConfirming) && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={!paymentMethod || isConfirming}
        >
          {isConfirming ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.confirmButtonText}>Confirmar e Solicitar</Text>
              <Text style={styles.confirmButtonPrice}>R$ {priceValue.toFixed(2)}</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={isConfirming}
        >
          <Text style={styles.cancelButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  serviceType: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  routeMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  routeContent: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  routeAddress: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: COLORS.gray,
    marginLeft: 5,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray,
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF9E6',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  paymentDescription: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  valueLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  valueAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  valueSmall: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  confirmButtonPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
  },
});

