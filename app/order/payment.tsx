/**
 * Tela: Forma de Pagamento
 * Quinta etapa do fluxo
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
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { useOrder, PaymentMethod } from '@/contexts/OrderContext';

export default function PaymentMethodScreen() {
  const router = useRouter();
  const { order, setPaymentMethod, applyCoupon } = useOrder();
  
  const [selected, setSelected] = useState<PaymentMethod | null>(order?.paymentMethod || null);
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum pedido em andamento</Text>
      </View>
    );
  }

  const paymentOptions = [
    {
      id: 'pix' as PaymentMethod,
      name: 'PIX',
      icon: 'qr-code',
      description: 'Instantâneo e seguro',
    },
    {
      id: 'cartao' as PaymentMethod,
      name: 'Cartão',
      icon: 'card',
      description: 'Crédito ou débito',
    },
    {
      id: 'dinheiro' as PaymentMethod,
      name: 'Dinheiro',
      icon: 'cash',
      description: 'Pague ao motorista',
    },
  ];

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      Alert.alert('Atenção', 'Digite um código de cupom.');
      return;
    }

    setApplyingCoupon(true);

    try {
      const success = await applyCoupon(couponCode.toUpperCase());
      
      if (success) {
        setCouponApplied(true);
        Alert.alert('Cupom aplicado!', 'Desconto aplicado com sucesso.');
      } else {
        Alert.alert('Cupom inválido', 'Este cupom não existe ou já expirou.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível aplicar o cupom.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleContinue = () => {
    if (!selected) {
      Alert.alert('Atenção', 'Selecione uma forma de pagamento para continuar.');
      return;
    }

    setPaymentMethod(selected);
    router.push('/order/summary');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forma de pagamento</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <Text style={styles.sectionTitle}>Escolha como pagar:</Text>

        {paymentOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.paymentCard,
              selected === option.id && styles.paymentCardSelected,
            ]}
            onPress={() => setSelected(option.id)}
          >
            <View style={styles.paymentIcon}>
              <Ionicons
                name={option.icon as any}
                size={32}
                color={selected === option.id ? COLORS.primary : '#666'}
              />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={[
                styles.paymentName,
                selected === option.id && styles.paymentNameSelected,
              ]}>
                {option.name}
              </Text>
              <Text style={styles.paymentDescription}>{option.description}</Text>
            </View>
            {selected === option.id && (
              <Ionicons name="checkmark-circle" size={28} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        ))}

        {/* Cupom de desconto */}
        <Text style={styles.sectionTitle}>Cupom de desconto (opcional)</Text>

        <View style={styles.couponCard}>
          <View style={styles.couponInputContainer}>
            <Ionicons name="pricetag" size={20} color={COLORS.primary} />
            <TextInput
              style={styles.couponInput}
              placeholder="Digite o código do cupom"
              value={couponCode}
              onChangeText={setCouponCode}
              autoCapitalize="characters"
              editable={!couponApplied}
            />
          </View>

          {couponApplied ? (
            <View style={styles.couponAppliedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.couponAppliedText}>Aplicado</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.couponApplyButton}
              onPress={handleApplyCoupon}
              disabled={applyingCoupon}
            >
              {applyingCoupon ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={styles.couponApplyText}>Aplicar</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Dica de cupons */}
        <View style={styles.tipCard}>
          <Ionicons name="information-circle" size={24} color="#2196F3" />
          <View style={styles.tipInfo}>
            <Text style={styles.tipTitle}>Cupons disponíveis:</Text>
            <Text style={styles.tipText}>• PRIMEIRA - 12% OFF na primeira corrida</Text>
            <Text style={styles.tipText}>• BEM-VINDO - 10% OFF (máx. R$ 15)</Text>
            <Text style={styles.tipText}>• XIQUE5 - R$ 5 OFF (mín. R$ 20)</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botão Continuar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !selected && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selected}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    marginTop: 8,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF9E6',
  },
  paymentIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  paymentNameSelected: {
    color: COLORS.primary,
  },
  paymentDescription: {
    fontSize: 14,
    color: '#666',
  },
  couponCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  couponInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  couponInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    marginLeft: 8,
    fontWeight: '600',
  },
  couponApplyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  couponApplyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  couponAppliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
  },
  couponAppliedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 8,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
  },
  tipInfo: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#1976D2',
    marginBottom: 4,
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
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#CCC',
  },
  continueButtonText: {
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

