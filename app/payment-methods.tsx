import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'pix';
  name: string;
  details: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const router = useRouter();
  
  // Lista de métodos salvos
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'credit',
      name: 'Cartão de Crédito',
      details: '**** **** **** 1234',
      isDefault: true,
    },
  ]);

  // Estados dos modais
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showPixForm, setShowPixForm] = useState(false);
  const [cardType, setCardType] = useState<'credit' | 'debit'>('credit');

  // Estados do formulário de cartão
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  // Estado do formulário PIX
  const [pixKey, setPixKey] = useState('');
  const [pixType, setPixType] = useState<'cpf' | 'phone' | 'email' | 'random'>('phone');

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return '💳';
      case 'debit':
        return '💳';
      case 'pix':
        return '📱';
      default:
        return '💰';
    }
  };

  const formatCardNumber = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    const formatted = numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19);
  };

  const formatExpiry = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
    }
    return numbers;
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleSelectCardType = (type: 'credit' | 'debit') => {
    setCardType(type);
    setShowAddModal(false);
    setShowCardForm(true);
  };

  const handleSelectPix = () => {
    setShowAddModal(false);
    setShowPixForm(true);
  };

  const handleAddCard = () => {
    if (!cardNumber || !cardName || !cardExpiry || !cardCVV) {
      Alert.alert('Atenção', 'Preencha todos os campos do cartão');
      return;
    }

    const last4 = cardNumber.replace(/\s/g, '').slice(-4);
    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: cardType,
      name: cardType === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito',
      details: `**** **** **** ${last4}`,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods([...paymentMethods, newCard]);
    
    // Limpa formulário
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCVV('');
    setShowCardForm(false);

    Alert.alert('✅ Sucesso', 'Cartão adicionado com sucesso!');
  };

  const handleAddPix = () => {
    if (!pixKey) {
      Alert.alert('Atenção', 'Digite sua chave PIX');
      return;
    }

    const newPix: PaymentMethod = {
      id: Date.now().toString(),
      type: 'pix',
      name: 'PIX',
      details: pixKey,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods([...paymentMethods, newPix]);
    
    // Limpa formulário
    setPixKey('');
    setShowPixForm(false);

    Alert.alert('✅ Sucesso', 'PIX adicionado com sucesso!');
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    Alert.alert('✅ Sucesso', 'Forma de pagamento padrão atualizada!');
  };

  const handleRemovePaymentMethod = (id: string, name: string) => {
    Alert.alert(
      'Remover Forma de Pagamento',
      `Deseja realmente remover ${name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
            Alert.alert('✅ Removido', 'Forma de pagamento removida com sucesso!');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Formas de Pagamento</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerIcon}>💡</Text>
          <View style={styles.infoBannerText}>
            <Text style={styles.infoBannerTitle}>Como você paga suas corridas</Text>
            <Text style={styles.infoBannerDescription}>
              Configure seus métodos de pagamento para pagar suas corridas e entregas
            </Text>
          </View>
        </View>

        {/* Payment Methods List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métodos Salvos</Text>

          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentCard}>
              <View style={styles.paymentIcon}>
                <Text style={styles.paymentIconText}>{getCardIcon(method.type)}</Text>
              </View>

              <View style={styles.paymentInfo}>
                <View style={styles.paymentHeader}>
                  <Text style={styles.paymentName}>{method.name}</Text>
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Padrão</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.paymentDetails}>{method.details}</Text>
              </View>

              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => {
                  Alert.alert(
                    method.name,
                    'Escolha uma ação:',
                    [
                      !method.isDefault && {
                        text: 'Definir como Padrão',
                        onPress: () => handleSetDefault(method.id),
                      },
                      {
                        text: 'Remover',
                        style: 'destructive',
                        onPress: () => handleRemovePaymentMethod(method.id, method.name),
                      },
                      {
                        text: 'Cancelar',
                        style: 'cancel',
                      },
                    ].filter(Boolean) as any
                  );
                }}
              >
                <Text style={styles.moreButtonText}>⋮</Text>
              </TouchableOpacity>
            </View>
          ))}

          {paymentMethods.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💳</Text>
              <Text style={styles.emptyText}>
                Nenhuma forma de pagamento cadastrada
              </Text>
              <Text style={styles.emptySubtext}>
                Adicione um cartão ou PIX para pagar suas corridas
              </Text>
            </View>
          )}
        </View>

        {/* Add Payment Method Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleOpenAddModal}
          >
            <Text style={styles.addButtonIcon}>+</Text>
            <Text style={styles.addButtonText}>Adicionar Forma de Pagamento</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre Pagamentos</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoItemIcon}>🔒</Text>
              <Text style={styles.infoItemText}>
                Seus dados estão seguros e criptografados
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoItemIcon}>⚡</Text>
              <Text style={styles.infoItemText}>
                Pagamento automático após cada corrida
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoItemIcon}>📱</Text>
              <Text style={styles.infoItemText}>
                PIX: pagamento instantâneo e sem taxas
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoItemIcon}>💳</Text>
              <Text style={styles.infoItemText}>
                Cartões: débito ou crédito aceitos
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoItemIcon}>🧾</Text>
              <Text style={styles.infoItemText}>
                Recibo digital enviado por e-mail
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal: Escolher Tipo */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Pagamento</Text>
              <TouchableOpacity 
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleSelectCardType('credit')}
            >
              <Text style={styles.optionIcon}>💳</Text>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Cartão de Crédito</Text>
                <Text style={styles.optionDescription}>Débito automático após corrida</Text>
              </View>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleSelectCardType('debit')}
            >
              <Text style={styles.optionIcon}>💳</Text>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Cartão de Débito</Text>
                <Text style={styles.optionDescription}>Débito automático após corrida</Text>
              </View>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleSelectPix}
            >
              <Text style={styles.optionIcon}>📱</Text>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>PIX</Text>
                <Text style={styles.optionDescription}>Pagamento instantâneo</Text>
              </View>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal: Adicionar Cartão */}
      <Modal
        visible={showCardForm}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCardForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {cardType === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito'}
              </Text>
              <TouchableOpacity 
                onPress={() => setShowCardForm(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Número do Cartão</Text>
                <TextInput
                  style={styles.input}
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  placeholder="0000 0000 0000 0000"
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Nome no Cartão</Text>
                <TextInput
                  style={styles.input}
                  value={cardName}
                  onChangeText={(text) => setCardName(text.toUpperCase())}
                  placeholder="NOME COMPLETO"
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Validade</Text>
                  <TextInput
                    style={styles.input}
                    value={cardExpiry}
                    onChangeText={(text) => setCardExpiry(formatExpiry(text))}
                    placeholder="MM/AA"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    value={cardCVV}
                    onChangeText={(text) => setCardCVV(text.replace(/\D/g, ''))}
                    placeholder="123"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddCard}
              >
                <Text style={styles.submitButtonText}>Adicionar Cartão</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: Adicionar PIX */}
      <Modal
        visible={showPixForm}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPixForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar PIX</Text>
              <TouchableOpacity 
                onPress={() => setShowPixForm(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tipo de Chave</Text>
                <View style={styles.pixTypeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.pixTypeButton,
                      pixType === 'phone' && styles.pixTypeButtonActive,
                    ]}
                    onPress={() => setPixType('phone')}
                  >
                    <Text style={styles.pixTypeText}>Telefone</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pixTypeButton,
                      pixType === 'cpf' && styles.pixTypeButtonActive,
                    ]}
                    onPress={() => setPixType('cpf')}
                  >
                    <Text style={styles.pixTypeText}>CPF</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pixTypeButton,
                      pixType === 'email' && styles.pixTypeButtonActive,
                    ]}
                    onPress={() => setPixType('email')}
                  >
                    <Text style={styles.pixTypeText}>E-mail</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pixTypeButton,
                      pixType === 'random' && styles.pixTypeButtonActive,
                    ]}
                    onPress={() => setPixType('random')}
                  >
                    <Text style={styles.pixTypeText}>Aleatória</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Chave PIX</Text>
                <TextInput
                  style={styles.input}
                  value={pixKey}
                  onChangeText={setPixKey}
                  placeholder={
                    pixType === 'phone'
                      ? '(00) 00000-0000'
                      : pixType === 'cpf'
                      ? '000.000.000-00'
                      : pixType === 'email'
                      ? 'email@exemplo.com'
                      : 'Chave aleatória'
                  }
                  keyboardType={
                    pixType === 'phone' || pixType === 'cpf' ? 'numeric' : 'default'
                  }
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddPix}
              >
                <Text style={styles.submitButtonText}>Adicionar PIX</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    marginBottom: 10,
  },
  infoBannerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  infoBannerText: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  infoBannerDescription: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
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
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentIconText: {
    fontSize: 24,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  paymentDetails: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  moreButton: {
    padding: 8,
  },
  moreButtonText: {
    fontSize: 20,
    color: COLORS.grayDark,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
  },
  addButtonIcon: {
    fontSize: 24,
    color: COLORS.secondary,
    marginRight: 8,
    fontWeight: 'bold',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  infoCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoItemText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '80%',
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
    color: COLORS.text,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: COLORS.grayDark,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  optionArrow: {
    fontSize: 24,
    color: COLORS.grayDark,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.grayDark,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  row: {
    flexDirection: 'row',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  pixTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pixTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pixTypeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pixTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
});
