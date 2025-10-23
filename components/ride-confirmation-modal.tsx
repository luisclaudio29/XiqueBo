import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { RideExtras } from '@/utils/pricing';

interface RideConfirmationModalProps {
  visible: boolean;
  origin: string;
  destination: string;
  serviceType: string;
  price: number;
  distance: number;
  duration: number;
  extras?: RideExtras;
  onConfirm: (paymentMethod: string) => void;
  onCancel: () => void;
}

export function RideConfirmationModal({
  visible,
  origin,
  destination,
  serviceType,
  price,
  distance,
  duration,
  extras,
  onConfirm,
  onCancel,
}: RideConfirmationModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<'cartao' | 'pix' | 'saldo'>('cartao');

  const paymentMethods = [
    { id: 'cartao', name: 'Cartão de Crédito', icon: '💳' },
    { id: 'pix', name: 'Pix', icon: '📱' },
    { id: 'saldo', name: 'Saldo XiquêGo', icon: '💰' },
  ];

  const handleConfirm = () => {
    onConfirm(selectedPayment);
  };

  const getServiceName = (type: string) => {
    const types: { [key: string]: string } = {
      comum: 'Carro - Comum',
      moto: 'Moto',
      mototaxi: 'Mototáxi',
      expressa: 'Expressa - Prioridade',
      bagagem: 'Com Bagagem',
      pets: 'Com Pets',
      entrega_carro: 'Entrega - Carro',
      entrega_moto: 'Entrega - Moto',
      entrega_bicicleta: 'Entrega - Bicicleta',
    };
    return types[type] || 'Comum';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Confirmar Corrida</Text>
              <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Route Info */}
            <View style={styles.section}>
              <View style={styles.routeContainer}>
                <View style={styles.routePoints}>
                  <View style={styles.originDot} />
                  <View style={styles.routeLine} />
                  <View style={styles.destinationDot} />
                </View>
                <View style={styles.routeInfo}>
                  <View style={styles.routeItem}>
                    <Text style={styles.routeLabel}>Origem</Text>
                    <Text style={styles.routeText}>{origin}</Text>
                  </View>
                  <View style={styles.routeItem}>
                    <Text style={styles.routeLabel}>Destino</Text>
                    <Text style={styles.routeText}>{destination}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Trip Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detalhes da Viagem</Text>
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tipo de Serviço</Text>
                  <Text style={styles.detailValue}>{getServiceName(serviceType)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Distância</Text>
                  <Text style={styles.detailValue}>{distance.toFixed(1)} km</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tempo Estimado</Text>
                  <Text style={styles.detailValue}>{duration} min</Text>
                </View>
              </View>
            </View>

            {/* Extras */}
            {extras && Object.values(extras).some(v => v) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Extras Selecionados</Text>
                <View style={styles.extrasContainer}>
                  {extras.bagagem && (
                    <View style={styles.extraChip}>
                      <Text style={styles.extraText}>🧳 Bagagem</Text>
                    </View>
                  )}
                  {extras.pets && (
                    <View style={styles.extraChip}>
                      <Text style={styles.extraText}>🐕 Pets</Text>
                    </View>
                  )}
                  {extras.prioridade && (
                    <View style={styles.extraChip}>
                      <Text style={styles.extraText}>⚡ Prioridade</Text>
                    </View>
                  )}
                  {extras.assistenciaIdoso && (
                    <View style={styles.extraChip}>
                      <Text style={styles.extraText}>👴 Assistência Idoso</Text>
                    </View>
                  )}
                  {extras.volumoso && (
                    <View style={styles.extraChip}>
                      <Text style={styles.extraText}>📦 Volumoso</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Payment Method */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentOption,
                    selectedPayment === method.id && styles.paymentOptionSelected,
                  ]}
                  onPress={() => setSelectedPayment(method.id as any)}
                >
                  <Text style={styles.paymentIcon}>{method.icon}</Text>
                  <Text style={styles.paymentName}>{method.name}</Text>
                  <View style={styles.radioOuter}>
                    {selectedPayment === method.id && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Price */}
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Valor Total</Text>
              <Text style={styles.priceValue}>R$ {price.toFixed(2)}</Text>
            </View>

            {/* Cancellation Policy */}
            <View style={styles.policyContainer}>
              <Text style={styles.policyText}>
                Taxa de cancelamento: 1% (R$ {(price * 0.01).toFixed(2)})
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onCancel}
              >
                <Text style={styles.cancelButtonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.text,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  routeContainer: {
    flexDirection: 'row',
  },
  routePoints: {
    alignItems: 'center',
    marginRight: 12,
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  routeLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.gray,
    marginVertical: 4,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.secondary,
  },
  routeInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  routeItem: {
    marginBottom: 12,
  },
  routeLabel: {
    fontSize: 12,
    color: COLORS.grayDark,
    marginBottom: 2,
  },
  routeText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  extrasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  extraChip: {
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  extraText: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF9E6',
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF9E6',
  },
  priceLabel: {
    fontSize: 16,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  policyContainer: {
    padding: 20,
    paddingTop: 8,
  },
  policyText: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
});

