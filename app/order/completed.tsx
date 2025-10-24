/**
 * Tela: Pedido Concluído
 * Última etapa - Recibo e avaliação
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { useOrder } from '@/contexts/OrderContext';
import { DriverCard } from '@/components/order/driver-card';
import { VehicleBadge } from '@/components/order/vehicle-badge';
import { Divider } from '@/components/ui/divider';

export default function OrderCompletedScreen() {
  const router = useRouter();
  const { order, completeOrder } = useOrder();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!order || !order.driver || !order.vehicle) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Pedido não encontrado</Text>
      </View>
    );
  }

  const handleSubmitRating = () => {
    if (rating === 0) {
      Alert.alert('Atenção', 'Por favor, avalie o motorista.');
      return;
    }

    completeOrder(rating, comment);
    setSubmitted(true);

    setTimeout(() => {
      router.replace('/(tabs)');
    }, 2000);
  };

  const handleDownloadReceipt = () => {
    Alert.alert('Recibo', 'Recibo baixado! (Mock)\n\nVocê receberá um e-mail com os detalhes da viagem.');
  };

  // Calcular valores
  const finalPrice = order.estimate?.finalPrice || 0;
  const discount = order.discount || 0;
  const discountAmount = discount < 1 ? finalPrice * discount : discount;
  const totalPrice = finalPrice - discountAmount;

  return (
    <View style={styles.container}>
      {submitted ? (
        /* Feedback de sucesso */
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          </View>
          <Text style={styles.successTitle}>Avaliação enviada!</Text>
          <Text style={styles.successSubtitle}>Obrigado pelo seu feedback</Text>
        </View>
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
            <Text style={styles.headerTitle}>Viagem concluída!</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* DriverCard e VehicleBadge */}
            <DriverCard driver={order.driver} />
            <VehicleBadge
              vehicle={order.vehicle}
              showMudancaAnimais={order.expressoSubtype === 'mudanca_animais'}
            />

            <Divider />

            {/* Recibo */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resumo da viagem</Text>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Distância:</Text>
                <Text style={styles.receiptValue}>
                  {order.estimate?.distance.toFixed(1)} km
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Tempo:</Text>
                <Text style={styles.receiptValue}>
                  {order.estimate?.duration} min
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Valor base:</Text>
                <Text style={styles.receiptValue}>R$ {finalPrice.toFixed(2)}</Text>
              </View>

              {discountAmount > 0 && (
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Desconto:</Text>
                  <Text style={styles.discountValue}>- R$ {discountAmount.toFixed(2)}</Text>
                </View>
              )}

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabelSmall}>Taxa XiqueGo (2%):</Text>
                <Text style={styles.receiptLabelSmall}>
                  R$ {(totalPrice * 0.02).toFixed(2)}
                </Text>
              </View>

              <Divider marginVertical={16} />

              <View style={styles.receiptRow}>
                <Text style={styles.totalLabel}>Total pago:</Text>
                <Text style={styles.totalValue}>R$ {totalPrice.toFixed(2)}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Pagamento:</Text>
                <Text style={styles.receiptValue}>
                  {order.paymentMethod === 'pix' ? 'PIX' : 
                   order.paymentMethod === 'cartao' ? 'Cartão' : 'Dinheiro'}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadReceipt}>
              <Ionicons name="download" size={20} color={COLORS.primary} />
              <Text style={styles.downloadButtonText}>Baixar recibo</Text>
            </TouchableOpacity>

            <Divider />

            {/* Avaliação */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Como foi sua experiência?</Text>
              
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    style={styles.starButton}
                  >
                    <Ionicons
                      name={rating >= star ? 'star' : 'star-outline'}
                      size={48}
                      color={rating >= star ? '#FDB913' : '#CCC'}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.commentInput}
                placeholder="Deixe um comentário (opcional)"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={{ height: 120 }} />
          </ScrollView>

          {/* Botão Enviar Avaliação */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
              onPress={handleSubmitRating}
              disabled={rating === 0}
            >
              <Text style={styles.submitButtonText}>Enviar avaliação</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.skipButtonText}>Pular</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#E8F5E9',
    paddingTop: 50,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 12,
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
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  receiptLabel: {
    fontSize: 15,
    color: '#666',
  },
  receiptValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  receiptLabelSmall: {
    fontSize: 13,
    color: '#999',
  },
  discountValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4CAF50',
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
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 20,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  starButton: {
    marginHorizontal: 4,
  },
  commentInput: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  skipButton: {
    padding: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

