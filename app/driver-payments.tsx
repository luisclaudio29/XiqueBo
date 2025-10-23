import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useState } from 'react';

interface PaymentData {
  availableBalance: number;
  totalEarnings: number;
  pendingBalance: number;
  pixKey: string;
  pixKeyType: string;
}

interface Transaction {
  id: string;
  type: 'ride' | 'withdrawal';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

export default function DriverPaymentsScreen() {
  const router = useRouter();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentData, setPaymentData] = useState<PaymentData>({
    availableBalance: 450.00,
    totalEarnings: 2340.50,
    pendingBalance: 75.00,
    pixKey: '(74) 99999-9999',
    pixKeyType: 'Telefone',
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'ride',
      amount: 25.00,
      date: '2024-10-20 15:30',
      status: 'completed',
      description: 'Corrida - Centro para Shopping',
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: -150.00,
      date: '2024-10-19 10:00',
      status: 'completed',
      description: 'Saque via PIX',
    },
    {
      id: '3',
      type: 'ride',
      amount: 18.50,
      date: '2024-10-18 18:45',
      status: 'completed',
      description: 'Corrida - Perto Velha',
    },
  ]);

  const MINIMUM_WITHDRAWAL = 127.00;
  const COMMISSION_RATE = 0.02; // 2%

  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || isNaN(amount)) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    if (amount < MINIMUM_WITHDRAWAL) {
      Alert.alert(
        'Valor Mínimo',
        `O valor mínimo para saque é R$ ${MINIMUM_WITHDRAWAL.toFixed(2)}`
      );
      return;
    }

    if (amount > paymentData.availableBalance) {
      Alert.alert('Saldo Insuficiente', 'Você não tem saldo disponível suficiente');
      return;
    }

    Alert.alert(
      'Confirmar Saque',
      `Deseja sacar R$ ${amount.toFixed(2)} via PIX?\n\nChave PIX: ${paymentData.pixKey}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            // Processar saque
            Alert.alert(
              'Saque Solicitado!',
              `Seu saque de R$ ${amount.toFixed(2)} foi solicitado e será processado em até 24 horas.`
            );
            setWithdrawAmount('');
          },
        },
      ]
    );
  };

  const getTransactionIcon = (type: string) => {
    return type === 'ride' ? '🚗' : '💸';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return COLORS.success;
      case 'pending':
        return COLORS.primary;
      case 'failed':
        return COLORS.error;
      default:
        return COLORS.grayDark;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'failed':
        return 'Falhou';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Ganhos</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Balance Cards */}
        <View style={styles.balanceSection}>
          <View style={styles.mainBalanceCard}>
            <Text style={styles.balanceLabel}>Saldo Disponível</Text>
            <Text style={styles.balanceValue}>
              R$ {paymentData.availableBalance.toFixed(2)}
            </Text>
            <Text style={styles.balanceSubtext}>
              Pronto para saque
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Ganhos Totais</Text>
              <Text style={styles.statValue}>
                R$ {paymentData.totalEarnings.toFixed(2)}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Saldo Pendente</Text>
              <Text style={styles.statValue}>
                R$ {paymentData.pendingBalance.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* PIX Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chave PIX Cadastrada</Text>
          <View style={styles.pixCard}>
            <View style={styles.pixInfo}>
              <Text style={styles.pixType}>{paymentData.pixKeyType}</Text>
              <Text style={styles.pixKey}>{paymentData.pixKey}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Alterar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Withdrawal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Solicitar Saque</Text>
          
          <View style={styles.withdrawalCard}>
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <View style={styles.infoTextBox}>
                <Text style={styles.infoText}>
                  • Valor mínimo: R$ {MINIMUM_WITHDRAWAL.toFixed(2)}
                </Text>
                <Text style={styles.infoText}>
                  • Pagamento apenas via PIX
                </Text>
                <Text style={styles.infoText}>
                  • Processamento em até 24 horas
                </Text>
                <Text style={styles.infoText}>
                  • Comissão da empresa: {(COMMISSION_RATE * 100)}% (já descontada)
                </Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Valor do Saque</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.currencySymbol}>R$</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0,00"
                  keyboardType="decimal-pad"
                  value={withdrawAmount}
                  onChangeText={setWithdrawAmount}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[
                styles.withdrawButton,
                (!withdrawAmount || parseFloat(withdrawAmount) < MINIMUM_WITHDRAWAL) && styles.withdrawButtonDisabled
              ]}
              onPress={handleWithdrawal}
            >
              <Text style={styles.withdrawButtonText}>Solicitar Saque</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico de Transações</Text>
          
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionIcon}>
                <Text style={styles.transactionIconText}>
                  {getTransactionIcon(transaction.type)}
                </Text>
              </View>
              
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>
                  {transaction.description}
                </Text>
                <View style={styles.transactionMeta}>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(transaction.status) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(transaction.status) },
                      ]}
                    >
                      {getStatusText(transaction.status)}
                    </Text>
                  </View>
                </View>
              </View>
              
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.amount > 0 ? styles.positiveAmount : styles.negativeAmount,
                ]}
              >
                {transaction.amount > 0 ? '+' : ''}R$ {Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 32,
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  balanceSection: {
    padding: 20,
  },
  mainBalanceCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: COLORS.background,
    opacity: 0.8,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.background,
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    color: COLORS.background,
    opacity: 0.7,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  pixCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pixInfo: {
    flex: 1,
  },
  pixType: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  pixKey: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  withdrawalCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 16,
    padding: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoTextBox: {
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingVertical: 16,
  },
  withdrawButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  withdrawButtonDisabled: {
    opacity: 0.5,
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  transactionCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  positiveAmount: {
    color: COLORS.success,
  },
  negativeAmount: {
    color: COLORS.error,
  },
});




