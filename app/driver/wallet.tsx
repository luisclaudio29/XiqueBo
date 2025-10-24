/**
 * Tela: Carteira do Motorista
 * Saldo, histórico e saques
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { COMPANY_FEE_PERCENTAGE, MINIMUM_WITHDRAWAL } from '@/constants/payment';

export default function DriverWalletScreen() {
  const router = useRouter();
  
  // Mock: dados do motorista
  const [balance, setBalance] = useState(245.50); // Saldo disponível (já com taxa 2% descontada)
  const [totalEarned, setTotalEarned] = useState(1250.00);
  const [pixKey, setPixKey] = useState('71982633972');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const transactions = [
    { id: '1', type: 'corrida', amount: 25.50, date: '2025-10-24', status: 'completed' },
    { id: '2', type: 'corrida', amount: 18.00, date: '2025-10-24', status: 'completed' },
    { id: '3', type: 'entrega', amount: 32.00, date: '2025-10-23', status: 'completed' },
    { id: '4', type: 'saque', amount: -150.00, date: '2025-10-22', status: 'completed' },
    { id: '5', type: 'corrida', amount: 22.00, date: '2025-10-22', status: 'completed' },
  ];

  const handleRequestWithdrawal = () => {
    const amount = parseFloat(withdrawAmount);

    if (!amount || amount < MINIMUM_WITHDRAWAL) {
      Alert.alert(
        'Valor inválido',
        `O valor mínimo para saque é R$ ${MINIMUM_WITHDRAWAL.toFixed(2)}`
      );
      return;
    }

    if (amount > balance) {
      Alert.alert('Saldo insuficiente', 'Você não possui saldo suficiente para este saque.');
      return;
    }

    Alert.alert(
      'Confirmar saque',
      `Sacar R$ ${amount.toFixed(2)} via PIX?\n\nChave PIX: ${pixKey}\n\nProcessamento em até 24 horas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            // Mock: processar saque
            setBalance(balance - amount);
            setShowWithdrawModal(false);
            setWithdrawAmount('');
            Alert.alert('Saque solicitado!', 'Seu saque será processado em até 24 horas.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minha Carteira</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Card de Saldo */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo disponível</Text>
          <Text style={styles.balanceValue}>R$ {balance.toFixed(2)}</Text>
          <Text style={styles.balanceInfo}>
            Taxa XiqueGo ({(COMPANY_FEE_PERCENTAGE * 100).toFixed(0)}%) já descontada
          </Text>

          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => setShowWithdrawModal(true)}
          >
            <Ionicons name="cash" size={20} color="#FFF" />
            <Text style={styles.withdrawButtonText}>Solicitar Saque (PIX)</Text>
          </TouchableOpacity>

          <Text style={styles.withdrawInfo}>
            Valor mínimo: R$ {MINIMUM_WITHDRAWAL.toFixed(2)}
          </Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="cash-outline" size={32} color={COLORS.primary} />
            <Text style={styles.statValue}>R$ {totalEarned.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total recebido</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Ionicons name="card-outline" size={32} color="#4DD0E1" />
            <Text style={styles.statValue}>{pixKey}</Text>
            <Text style={styles.statLabel}>Chave PIX</Text>
          </View>
        </View>

        {/* Histórico de transações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico de transações</Text>

          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons
                  name={
                    transaction.type === 'saque'
                      ? 'arrow-down-circle'
                      : transaction.type === 'corrida'
                      ? 'car'
                      : 'cube'
                  }
                  size={24}
                  color={transaction.type === 'saque' ? '#FF6B6B' : '#4CAF50'}
                />
              </View>

              <View style={styles.transactionInfo}>
                <Text style={styles.transactionType}>
                  {transaction.type === 'saque'
                    ? 'Saque PIX'
                    : transaction.type === 'corrida'
                    ? 'Corrida'
                    : 'Entrega'}
                </Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>

              <Text
                style={[
                  styles.transactionAmount,
                  transaction.amount < 0 && styles.transactionAmountNegative,
                ]}
              >
                {transaction.amount > 0 ? '+' : ''}R$ {Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {showWithdrawModal && (
          <View style={styles.withdrawModal}>
            <View style={styles.withdrawModalContent}>
              <Text style={styles.withdrawModalTitle}>Solicitar Saque</Text>

              <Text style={styles.withdrawModalLabel}>Valor (R$):</Text>
              <TextInput
                style={styles.withdrawModalInput}
                placeholder="0,00"
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                keyboardType="decimal-pad"
              />

              <Text style={styles.withdrawModalInfo}>
                Saldo disponível: R$ {balance.toFixed(2)}{'\n'}
                Mínimo: R$ {MINIMUM_WITHDRAWAL.toFixed(2)}{'\n'}
                Chave PIX: {pixKey}
              </Text>

              <View style={styles.withdrawModalButtons}>
                <TouchableOpacity
                  style={styles.withdrawModalButtonCancel}
                  onPress={() => {
                    setShowWithdrawModal(false);
                    setWithdrawAmount('');
                  }}
                >
                  <Text style={styles.withdrawModalButtonCancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.withdrawModalButtonConfirm}
                  onPress={handleRequestWithdrawal}
                >
                  <Text style={styles.withdrawModalButtonConfirmText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  balanceCard: {
    backgroundColor: COLORS.primary,
    margin: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  balanceInfo: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 20,
  },
  withdrawButton: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 8,
  },
  withdrawInfo: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  transactionItem: {
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
  transactionIcon: {
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  transactionAmountNegative: {
    color: '#FF6B6B',
  },
  withdrawModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  withdrawModalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  withdrawModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  withdrawModalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  withdrawModalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  withdrawModalInfo: {
    fontSize: 13,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  withdrawModalButtons: {
    flexDirection: 'row',
  },
  withdrawModalButtonCancel: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginRight: 8,
  },
  withdrawModalButtonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  withdrawModalButtonConfirm: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    marginLeft: 8,
  },
  withdrawModalButtonConfirmText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

