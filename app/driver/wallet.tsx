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
  const [todayEarnings, setTodayEarnings] = useState(85.50); // Ganhos de hoje
  const [weekEarnings, setWeekEarnings] = useState(450.00); // Ganhos da semana
  const [monthEarnings, setMonthEarnings] = useState(1250.00); // Ganhos do mês
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showBankAccountsModal, setShowBankAccountsModal] = useState(false);
  const [showPayPlatformModal, setShowPayPlatformModal] = useState(false);

  // Contas bancárias cadastradas
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: '1',
      type: 'pix',
      key: '71982633972',
      label: 'PIX - Celular',
      default: true,
    },
    {
      id: '2',
      type: 'bank',
      bank: 'Banco do Brasil',
      agency: '1234-5',
      account: '67890-1',
      label: 'Banco do Brasil',
      default: false,
    },
  ]);

  // Taxas pendentes
  const [pendingFees, setPendingFees] = useState(12.50);

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

        {/* Ganhos em tempo real */}
        <View style={styles.earningsContainer}>
          <Text style={styles.earningsTitle}>Ganhos em tempo real</Text>
          
          <View style={styles.earningsGrid}>
            <View style={styles.earningItem}>
              <Ionicons name="today" size={24} color={COLORS.primary} />
              <Text style={styles.earningValue}>R$ {todayEarnings.toFixed(2)}</Text>
              <Text style={styles.earningLabel}>Hoje</Text>
            </View>

            <View style={styles.earningItem}>
              <Ionicons name="calendar" size={24} color="#4DD0E1" />
              <Text style={styles.earningValue}>R$ {weekEarnings.toFixed(2)}</Text>
              <Text style={styles.earningLabel}>Esta semana</Text>
            </View>

            <View style={styles.earningItem}>
              <Ionicons name="stats-chart" size={24} color="#4CAF50" />
              <Text style={styles.earningValue}>R$ {monthEarnings.toFixed(2)}</Text>
              <Text style={styles.earningLabel}>Este mês</Text>
            </View>
          </View>
        </View>

        {/* Ações rápidas */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => setShowBankAccountsModal(true)}
          >
            <Ionicons name="card" size={24} color={COLORS.primary} />
            <Text style={styles.quickActionText}>Gerenciar Contas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => setShowPayPlatformModal(true)}
          >
            <Ionicons name="wallet" size={24} color="#FF9800" />
            <Text style={styles.quickActionText}>Pagar Taxas</Text>
            {pendingFees > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>R$ {pendingFees.toFixed(2)}</Text>
              </View>
            )}
          </TouchableOpacity>
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

        {/* Modal: Solicitar Saque */}
        {showWithdrawModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Solicitar Saque</Text>

              <Text style={styles.modalLabel}>Valor (R$):</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="0,00"
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                keyboardType="decimal-pad"
              />

              <Text style={styles.modalInfo}>
                Saldo disponível: R$ {balance.toFixed(2)}{'\n'}
                Mínimo: R$ {MINIMUM_WITHDRAWAL.toFixed(2)}{'\n'}
                Conta padrão: {bankAccounts.find(a => a.default)?.label}
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={() => {
                    setShowWithdrawModal(false);
                    setWithdrawAmount('');
                  }}
                >
                  <Text style={styles.modalButtonCancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalButtonConfirm}
                  onPress={handleRequestWithdrawal}
                >
                  <Text style={styles.modalButtonConfirmText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Modal: Gerenciar Contas Bancárias */}
        {showBankAccountsModal && (
          <View style={styles.modalOverlay}>
            <ScrollView style={styles.modalContentFull}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Gerenciar Contas</Text>
                <TouchableOpacity onPress={() => setShowBankAccountsModal(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              {bankAccounts.map((account) => (
                <View key={account.id} style={styles.bankAccountItem}>
                  <View style={styles.bankAccountIcon}>
                    <Ionicons
                      name={account.type === 'pix' ? 'qr-code' : 'business'}
                      size={24}
                      color={account.default ? COLORS.primary : '#666'}
                    />
                  </View>

                  <View style={styles.bankAccountInfo}>
                    <Text style={styles.bankAccountLabel}>{account.label}</Text>
                    {account.type === 'pix' && (
                      <Text style={styles.bankAccountDetail}>{account.key}</Text>
                    )}
                    {account.type === 'bank' && (
                      <Text style={styles.bankAccountDetail}>
                        Ag: {account.agency} - Conta: {account.account}
                      </Text>
                    )}
                    {account.default && (
                      <Text style={styles.bankAccountDefault}>✓ Padrão</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Remover conta?',
                        `Deseja remover ${account.label}?`,
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          {
                            text: 'Remover',
                            style: 'destructive',
                            onPress: () => {
                              if (account.default) {
                                Alert.alert('Erro', 'Não é possível remover a conta padrão.');
                              } else {
                                setBankAccounts(bankAccounts.filter(a => a.id !== account.id));
                                Alert.alert('Sucesso', 'Conta removida!');
                              }
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <Ionicons name="trash" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addAccountButton}
                onPress={() => {
                  Alert.alert(
                    'Adicionar Conta',
                    'Funcionalidade em desenvolvimento.\n\nEm breve você poderá adicionar novas contas bancárias e chaves PIX!'
                  );
                }}
              >
                <Ionicons name="add-circle" size={24} color={COLORS.primary} />
                <Text style={styles.addAccountText}>Adicionar Nova Conta</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Modal: Pagar Taxas à Plataforma */}
        {showPayPlatformModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Pagar Taxas XiqueGo</Text>

              <View style={styles.feeCard}>
                <Ionicons name="alert-circle" size={48} color="#FF9800" />
                <Text style={styles.feeAmount}>R$ {pendingFees.toFixed(2)}</Text>
                <Text style={styles.feeLabel}>Taxa pendente</Text>
              </View>

              <Text style={styles.modalInfo}>
                {pendingFees > 0
                  ? 'Você tem taxas pendentes de pagamento.\n\nQuer pagar agora?'
                  : 'Você não tem taxas pendentes no momento.'}
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={() => setShowPayPlatformModal(false)}
                >
                  <Text style={styles.modalButtonCancelText}>Cancelar</Text>
                </TouchableOpacity>

                {pendingFees > 0 && (
                  <TouchableOpacity
                    style={styles.modalButtonConfirm}
                    onPress={() => {
                      if (balance >= pendingFees) {
                        setBalance(balance - pendingFees);
                        setPendingFees(0);
                        setShowPayPlatformModal(false);
                        Alert.alert('Pagamento realizado!', 'Suas taxas foram pagas com sucesso.');
                      } else {
                        Alert.alert('Saldo insuficiente', 'Você não possui saldo suficiente para pagar as taxas.');
                      }
                    }}
                  >
                    <Text style={styles.modalButtonConfirmText}>Pagar Agora</Text>
                  </TouchableOpacity>
                )}
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
  earningsContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  earningsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  earningsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earningItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  earningValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
    marginBottom: 4,
  },
  earningLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginTop: 8,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
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
  modalOverlay: {
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
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalContentFull: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
    marginHorizontal: '5%',
    marginVertical: '10%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalInfo: {
    fontSize: 13,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
  },
  modalButtonCancel: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginRight: 8,
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalButtonConfirm: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    marginLeft: 8,
  },
  modalButtonConfirmText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  bankAccountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  bankAccountIcon: {
    marginRight: 12,
  },
  bankAccountInfo: {
    flex: 1,
  },
  bankAccountLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  bankAccountDetail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  bankAccountDefault: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addAccountText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  feeCard: {
    alignItems: 'center',
    marginVertical: 20,
  },
  feeAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF9800',
    marginTop: 12,
    marginBottom: 4,
  },
  feeLabel: {
    fontSize: 14,
    color: '#666',
  },
});

