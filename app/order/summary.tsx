/**
 * Tela: Resumo e Confirmação do Pedido
 * Última etapa antes do matching
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { useOrder } from '@/contexts/OrderContext';
import { Divider } from '@/components/ui/divider';

export default function OrderSummaryScreen() {
  const router = useRouter();
  const { order, confirmOrder, canProceed, getValidationErrors } = useOrder();
  
  const [loading, setLoading] = useState(false);

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum pedido em andamento</Text>
      </View>
    );
  }

  const handleConfirm = async () => {
    // Validar antes de confirmar
    if (!canProceed()) {
      const errors = getValidationErrors();
      Alert.alert('Atenção', errors.join('\n'));
      return;
    }

    setLoading(true);

    try {
      await confirmOrder();
      // Navegar para tela de busca
      router.push('/order/matching');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível confirmar o pedido');
    } finally {
      setLoading(false);
    }
  };

  // Calcular preço final com desconto
  const finalPrice = order.estimate?.finalPrice || 0;
  const discount = order.discount || 0;
  const discountAmount = discount < 1 ? finalPrice * discount : discount;
  const totalPrice = finalPrice - discountAmount;

  // Taxa XiqueGo (2%)
  const xiqueboFee = totalPrice * 0.02;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Revisar pedido</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Categoria */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name={order.mode === 'corrida' ? 'car' : 'cube'}
              size={24}
              color={COLORS.primary}
            />
            <Text style={styles.sectionTitle}>
              {order.mode === 'corrida' ? 'Corrida' : 'Entrega'}
            </Text>
          </View>
          <Text style={styles.categoryText}>
            {order.category.charAt(0).toUpperCase() + order.category.slice(1)}
            {order.expressoSubtype && ` - ${order.expressoSubtype === 'urbano' ? 'Expresso Urbano' : 'Mudança/Animais'}`}
          </Text>
        </View>

        <Divider />

        {/* Origem/Destino */}
        <View style={styles.section}>
          <View style={styles.locationRow}>
            <View style={styles.locationDot} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Origem</Text>
              <Text style={styles.locationAddress}>
                {order.origin?.address || 'Não definido'}
              </Text>
            </View>
          </View>

          <View style={styles.locationLine} />

          <View style={styles.locationRow}>
            <View style={[styles.locationDot, styles.locationDotDestination]} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Destino</Text>
              <Text style={styles.locationAddress}>
                {order.destination?.address || 'Não definido'}
              </Text>
            </View>
          </View>
        </View>

        <Divider />

        {/* Estimativa */}
        {order.estimate && (
          <>
            <View style={styles.section}>
              <View style={styles.estimateRow}>
                <Text style={styles.estimateLabel}>Distância:</Text>
                <Text style={styles.estimateValue}>{order.estimate.distance.toFixed(1)} km</Text>
              </View>
              <View style={styles.estimateRow}>
                <Text style={styles.estimateLabel}>Tempo estimado:</Text>
                <Text style={styles.estimateValue}>{order.estimate.duration} min</Text>
              </View>
            </View>

            <Divider />
          </>
        )}

        {/* Extras/Detalhes */}
        {order.mode === 'corrida' && order.rideExtras && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Extras</Text>
              {order.rideExtras.hasPet && <Text style={styles.extraText}>• Pet</Text>}
              {order.rideExtras.hasLuggage && <Text style={styles.extraText}>• Mala grande</Text>}
              {order.rideExtras.hasShopping && <Text style={styles.extraText}>• Compras grandes</Text>}
              {order.rideExtras.needsPIN && (
                <Text style={styles.extraText}>• Código PIN: {order.rideExtras.pin}</Text>
              )}
            </View>
            <Divider />
          </>
        )}

        {order.mode === 'entrega' && order.deliveryDetails && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detalhes da entrega</Text>
              <Text style={styles.detailText}>{order.deliveryDetails.description}</Text>
              {order.deliveryDetails.weight && (
                <Text style={styles.detailText}>Peso: {order.deliveryDetails.weight} kg</Text>
              )}
            </View>
            <Divider />
          </>
        )}

        {/* Observações */}
        {order.observations && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Observações</Text>
              <Text style={styles.observationsText}>{order.observations}</Text>
            </View>
            <Divider />
          </>
        )}

        {/* Pagamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pagamento</Text>
          <View style={styles.paymentRow}>
            <Ionicons
              name={order.paymentMethod === 'pix' ? 'qr-code' : order.paymentMethod === 'cartao' ? 'card' : 'cash'}
              size={24}
              color={COLORS.primary}
            />
            <Text style={styles.paymentText}>
              {order.paymentMethod === 'pix' ? 'PIX' : order.paymentMethod === 'cartao' ? 'Cartão' : 'Dinheiro'}
            </Text>
          </View>
        </View>

        <Divider />

        {/* Preço */}
        <View style={styles.section}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Valor estimado:</Text>
            <Text style={styles.priceValue}>R$ {finalPrice.toFixed(2)}</Text>
          </View>

          {discountAmount > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Desconto ({order.couponCode}):</Text>
              <Text style={styles.discountValue}>- R$ {discountAmount.toFixed(2)}</Text>
            </View>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.priceLabelSmall}>Inclui taxa XiqueGo (2%):</Text>
            <Text style={styles.priceLabelSmall}>R$ {xiqueboFee.toFixed(2)}</Text>
          </View>

          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>R$ {totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Botão Confirmar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, (loading || !canProceed()) && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={loading || !canProceed()}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.confirmButtonText}>
                Confirmar {order.mode === 'corrida' ? 'corrida' : 'entrega'}
              </Text>
              <Text style={styles.confirmButtonPrice}>R$ {totalPrice.toFixed(2)}</Text>
            </>
          )}
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
  header: {
    backgroundColor: '#FFF',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 16,
    color: '#666',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
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
    height: 20,
    backgroundColor: '#E0E0E0',
    marginLeft: 5,
    marginBottom: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  estimateLabel: {
    fontSize: 15,
    color: '#666',
  },
  estimateValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  extraText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 6,
  },
  observationsText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 15,
    color: '#666',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  priceLabelSmall: {
    fontSize: 13,
    color: '#999',
  },
  discountValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4CAF50',
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
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
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#CCC',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  confirmButtonPrice: {
    fontSize: 20,
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

