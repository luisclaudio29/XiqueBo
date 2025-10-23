import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useState, useEffect } from 'react';
import AuthService from '@/services/auth.service';
import { UserData, Gender } from '@/types/user.types';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { getPovoadsNomes } from '@/constants/povoados';

type AccountType = 'cliente' | 'motorista' | 'entregador';
type VehicleType = 'moto' | 'carro' | 'mototaxi' | 'moto_normal' | 'expresso_black';
type DeliveryType = 'moto' | 'carro' | 'bicicleta' | 'expresso';

export default function ProfileScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Dados pessoais
  const [name, setName] = useState('Andreia Bastos');
  const [phone, setPhone] = useState('(71) 98263-3972');
  const [email, setEmail] = useState('bastosa549@gmail.com');
  const [cpf, setCpf] = useState('');
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [povoado, setPovoado] = useState('');
  const [complement, setComplement] = useState('');
  const [reference, setReference] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showPovoadoModal, setShowPovoadoModal] = useState(false);
  
  // Tipo de conta
  const [accountType, setAccountType] = useState<AccountType>('cliente');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryType | null>(null);

  const vehicleOptions = [
    { id: 'moto', name: 'Moto', icon: '🏍️', color: '#FF6B6B', description: 'Corridas rápidas' },
    { id: 'carro', name: 'Carro', icon: '🚗', color: '#4ECDC4', description: 'Conforto e espaço' },
    { id: 'mototaxi', name: 'Mototáxi', icon: '🛵', color: '#FFB800', description: 'Econômico' },
    { id: 'moto_normal', name: 'Moto Normal', icon: '🏍️', color: '#95E1D3', description: 'Padrão' },
    { id: 'expresso_black', name: 'Expresso Black 🖤', icon: '🚛', color: '#2C3E50', description: 'Cargas e animais' },
  ];

  const deliveryOptions = [
    { id: 'moto', name: 'Moto', icon: '🏍️', color: '#FF6B6B', description: 'Entregas médias' },
    { id: 'carro', name: 'Carro', icon: '🚙', color: '#4ECDC4', description: 'Entregas grandes' },
    { id: 'bicicleta', name: 'Bicicleta', icon: '🚴', color: '#95E1D3', description: 'Entregas pequenas' },
    { id: 'expresso', name: 'Expresso ⚡', icon: '⚡', color: '#FFB800', description: 'Urgente' },
  ];

  const handleChoosePhoto = async () => {
    Alert.alert(
      '📸 Foto de Perfil',
      'Escolha uma opção:',
      [
        {
          text: 'Câmera',
          onPress: async () => {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
              Alert.alert('Permissão negada', 'Precisamos de acesso à câmera');
              return;
            }
            
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            
            if (!result.canceled) {
              setProfileImage(result.assets[0].uri);
              Alert.alert('✅ Sucesso', 'Foto atualizada!');
            }
          },
        },
        {
          text: 'Galeria',
          onPress: async () => {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
              Alert.alert('Permissão negada', 'Precisamos de acesso à galeria');
        return;
      }
      
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            
            if (!result.canceled) {
              setProfileImage(result.assets[0].uri);
              Alert.alert('✅ Sucesso', 'Foto atualizada!');
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleBecomeDriver = () => {
    Alert.alert(
      '🚗 Quero ser Motorista',
      'Você deseja ativar o modo Motorista e cadastrar seu veículo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, quero!',
          onPress: () => {
            setAccountType('motorista');
            Alert.alert('✅ Ótimo!', 'Agora selecione o tipo de veículo abaixo');
          },
        },
      ]
    );
  };

  const handleBecomeDelivery = () => {
    Alert.alert(
      '📦 Quero ser Entregador',
      'Você deseja ativar o modo Entregador e cadastrar seu veículo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, quero!',
          onPress: () => {
            setAccountType('entregador');
            Alert.alert('✅ Ótimo!', 'Agora selecione o tipo de entrega abaixo');
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!name || !phone || !email) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.updateCurrentUser({
        name,
        phone,
        email,
        cpf,
        address: {
          street,
          neighborhood,
          povoado,
          complement,
          reference,
          city: 'Xique-Xique',
          state: 'BA',
          zipCode: '',
        },
      });
      setIsLoading(false);
      setIsEditing(false);
      Alert.alert('✅ Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      '🚪 Sair da Conta',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, sair',
          style: 'destructive',
          onPress: async () => {
            await AuthService.logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com Foto */}
      <View style={styles.header}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handleChoosePhoto}>
        <View style={styles.avatarCircle}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
          <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
              )}
            </View>
            <View style={styles.cameraButton}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.headerName}>{name}</Text>
          <View style={styles.accountTypeBadge}>
            <Text style={styles.accountTypeText}>
              {accountType === 'cliente' ? '👤 Cliente' : 
               accountType === 'motorista' ? '🚗 Motorista' : '📦 Entregador'}
              </Text>
            </View>
          </View>

        {/* Informações Pessoais */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 Informações Pessoais</Text>
            {!isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={styles.editButton}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo *</Text>
              <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
                value={name}
                onChangeText={setName}
              placeholder="Seu nome completo"
              editable={isEditing}
              />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone *</Text>
              <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
                value={phone}
                onChangeText={setPhone}
              placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
              editable={isEditing}
              />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail *</Text>
              <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
                value={email}
                onChangeText={setEmail}
              placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              editable={isEditing}
              />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CPF</Text>
              <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={cpf}
              onChangeText={setCpf}
              placeholder="000.000.000-00"
                keyboardType="numeric"
              editable={isEditing}
            />
          </View>
        </View>

        {/* Endereço */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Endereço</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rua</Text>
              <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
                value={street}
                onChangeText={setStreet}
              placeholder="Nome da rua"
              editable={isEditing}
              />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bairro</Text>
              <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
                value={neighborhood}
                onChangeText={setNeighborhood}
              placeholder="Seu bairro"
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Povoado (opcional)</Text>
            {isEditing ? (
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowPovoadoModal(true)}
              >
                <Text style={povoado ? styles.selectButtonTextSelected : styles.selectButtonText}>
                  {povoado || 'Selecione seu povoado'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.grayDark} />
              </TouchableOpacity>
            ) : (
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={povoado || 'Sede (Centro)'}
                editable={false}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Complemento</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={complement}
              onChangeText={setComplement}
              placeholder="Número, bloco, andar..."
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Referência</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={reference}
              onChangeText={setReference}
              placeholder="Ex: Perto da escola, atrás do posto..."
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cidade</Text>
            <Text style={styles.staticText}>Xique-Xique, BA</Text>
          </View>
        </View>

        {/* Botões de Salvar/Cancelar quando editando */}
        {isEditing && (
          <View style={styles.section}>
            <View style={styles.actionButtons}>
            <TouchableOpacity
                style={styles.cancelButton} 
                onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.saveButton} 
              onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Seção: Mudar Tipo de Conta */}
        {accountType === 'cliente' && !isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💼 Quer trabalhar com a gente?</Text>
            <Text style={styles.sectionSubtitle}>
              Torne-se um parceiro do XiquêGo e comece a ganhar dinheiro!
            </Text>

            <TouchableOpacity 
              style={[styles.becomeButton, { backgroundColor: '#4ECDC4' }]}
              onPress={handleBecomeDriver}
            >
              <Text style={styles.becomeButtonIcon}>🚗</Text>
              <View style={styles.becomeButtonContent}>
                <Text style={styles.becomeButtonTitle}>Quero ser Motorista</Text>
                <Text style={styles.becomeButtonSubtitle}>
                  Transporte passageiros e ganhe por corrida
                </Text>
              </View>
              <Text style={styles.becomeButtonArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.becomeButton, { backgroundColor: '#FFB800' }]}
              onPress={handleBecomeDelivery}
            >
              <Text style={styles.becomeButtonIcon}>📦</Text>
              <View style={styles.becomeButtonContent}>
                <Text style={styles.becomeButtonTitle}>Quero ser Entregador</Text>
                <Text style={styles.becomeButtonSubtitle}>
                  Faça entregas e ganhe por cada entrega
                </Text>
              </View>
              <Text style={styles.becomeButtonArrow}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Seleção de Veículo (Motorista) */}
        {accountType === 'motorista' && !isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚗 Selecione seu Tipo de Veículo</Text>
            <Text style={styles.sectionSubtitle}>
              Escolha o(s) tipo(s) de serviço que você deseja oferecer
            </Text>

            <View style={styles.vehicleGrid}>
              {vehicleOptions.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.id}
                  style={[
                    styles.vehicleCard,
                    selectedVehicle === vehicle.id && styles.vehicleCardSelected,
                    { borderColor: vehicle.color },
                  ]}
                  onPress={() => {
                    setSelectedVehicle(vehicle.id as VehicleType);
                    Alert.alert('✅ Veículo selecionado!', `Você escolheu: ${vehicle.name}`);
                  }}
                >
                  <Text style={styles.vehicleIcon}>{vehicle.icon}</Text>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehicleDescription}>{vehicle.description}</Text>
                  {selectedVehicle === vehicle.id && (
                    <View style={[styles.selectedBadge, { backgroundColor: vehicle.color }]}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: 'bold' }}>Expresso Black</Text> é exclusivo para transporte 
                de cargas, móveis e animais entre povoados e Xique-Xique.
              </Text>
            </View>
          </View>
        )}

        {/* Seleção de Entrega (Entregador) */}
        {accountType === 'entregador' && !isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📦 Selecione seu Tipo de Entrega</Text>
            <Text style={styles.sectionSubtitle}>
              Escolha o(s) tipo(s) de entrega que você deseja fazer
            </Text>

            <View style={styles.vehicleGrid}>
              {deliveryOptions.map((delivery) => (
                <TouchableOpacity
                  key={delivery.id}
                  style={[
                    styles.vehicleCard,
                    selectedDelivery === delivery.id && styles.vehicleCardSelected,
                    { borderColor: delivery.color },
                  ]}
                  onPress={() => {
                    setSelectedDelivery(delivery.id as DeliveryType);
                    Alert.alert('✅ Tipo selecionado!', `Você escolheu: ${delivery.name}`);
                  }}
                >
                  <Text style={styles.vehicleIcon}>{delivery.icon}</Text>
                  <Text style={styles.vehicleName}>{delivery.name}</Text>
                  <Text style={styles.vehicleDescription}>{delivery.description}</Text>
                  {selectedDelivery === delivery.id && (
                    <View style={[styles.selectedBadge, { backgroundColor: delivery.color }]}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>⚡</Text>
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: 'bold' }}>Expresso</Text> é para entregas urgentes 
                dentro da cidade, com prioridade máxima!
              </Text>
            </View>
          </View>
        )}

        {/* Botão de Sair */}
        <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Sair da Conta</Text>
        </TouchableOpacity>
        </View>

        {/* Espaçamento final */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modal de Seleção de Povoado */}
      <Modal
        visible={showPovoadoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPovoadoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o Povoado</Text>
              <TouchableOpacity onPress={() => setShowPovoadoModal(false)}>
                <Ionicons name="close" size={28} color={COLORS.grayDark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalList}>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setPovoado('');
                  setShowPovoadoModal(false);
                }}
              >
                <Text style={styles.modalItemText}>Xique-Xique (Sede)</Text>
                {!povoado && (
                  <Ionicons name="checkmark" size={24} color={COLORS.primary} />
                )}
              </TouchableOpacity>
              
              {getPovoadsNomes().map((nome) => (
                <TouchableOpacity
                  key={nome}
                  style={styles.modalItem}
                  onPress={() => {
                    setPovoado(nome);
                    setShowPovoadoModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{nome}</Text>
                  {povoado === nome && (
                    <Ionicons name="checkmark" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
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
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondary,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 18,
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  accountTypeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  accountTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  editButton: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#333',
  },
  inputDisabled: {
    backgroundColor: '#FAFAFA',
    color: '#666',
  },
  staticText: {
    fontSize: 15,
    color: '#333',
    padding: 14,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  becomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  becomeButtonIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  becomeButtonContent: {
    flex: 1,
  },
  becomeButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  becomeButtonSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  becomeButtonArrow: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  vehicleCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  vehicleCardSelected: {
    backgroundColor: '#F0F9FF',
  },
  vehicleIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  vehicleName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  vehicleDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  selectButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    color: COLORS.grayDark,
  },
  selectButtonTextSelected: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalList: {
    paddingHorizontal: 20,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  modalItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
});
