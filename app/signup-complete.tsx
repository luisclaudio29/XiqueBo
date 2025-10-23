import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/constants/colors';
import { Gender } from '@/types/user.types';
import { VehicleType, ServiceType } from '@/types/ride.types';
import { 
  VEHICLE_BRANDS, 
  MOTORCYCLE_BRANDS, 
  VEHICLE_YEARS, 
  VEHICLE_COLORS,
  VEHICLE_AGE_RULES,
  getModelsByBrand,
  getAllBrands,
  validateVehicleYear,
  getMinimumVehicleYear,
} from '@/constants/vehicles';

type UserType = 'cliente' | 'motorista' | null;

export default function SignUpCompleteScreen() {
  const router = useRouter();
  
  // Tipo de usuário
  const [userType, setUserType] = useState<UserType>(null);
  
  // Dados pessoais
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Informações adicionais
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('prefiro-nao-informar');
  
  // Endereço
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  
  // Dados de motorista/entregador
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [deliveryType, setDeliveryType] = useState<'urbana' | 'rural' | null>(null); // Tipo de entrega
  const [vehiclePhoto, setVehiclePhoto] = useState<string | null>(null);
  const [driverPhoto, setDriverPhoto] = useState<string | null>(null);
  
  // Confirmações para veículos antigos
  const [vehicleGoodCondition, setVehicleGoodCondition] = useState(false);
  const [vehicleHasStructure, setVehicleHasStructure] = useState(false);
  
  // Modais de seleção
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Obter lista de marcas baseada no tipo de veículo
  const brands = vehicleType === 'moto' 
    ? MOTORCYCLE_BRANDS.map(b => b.name).sort()
    : getAllBrands(false);
  
  // Obter modelos da marca selecionada
  const models = vehicleBrand 
    ? getModelsByBrand(vehicleBrand, vehicleType === 'moto')
    : [];
  
  // Calcular ano mínimo aceito
  const minimumYear = serviceType 
    ? getMinimumVehicleYear(
        serviceType, 
        serviceType === 'entrega' && deliveryType === 'rural' ? 'entrega_rural' : undefined
      )
    : null;
  
  // Função para validar e selecionar o ano
  const handleYearSelection = (year: string) => {
    if (!serviceType) {
      Alert.alert('Atenção', 'Por favor, selecione primeiro o tipo de serviço (Corrida ou Entrega)');
      return;
    }
    
    const validation = validateVehicleYear(
      year,
      serviceType,
      serviceType === 'entrega' && deliveryType === 'rural' ? 'entrega_rural' : undefined
    );
    
    if (!validation.valid) {
      Alert.alert('Veículo não aceito', validation.message || 'Este veículo não atende aos critérios.');
      return;
    }
    
    setVehicleYear(year);
    setShowYearModal(false);
    
    // Se for veículo antigo para entrega, mostrar confirmações
    const yearNum = year === 'Anterior a 1990' ? 1989 : parseInt(year);
    const currentYear = new Date().getFullYear();
    if (currentYear - yearNum > 10 && serviceType === 'entrega') {
      Alert.alert(
        'Confirmação necessária',
        'Para veículos com mais de 10 anos, você precisará confirmar que o veículo está em bom estado.',
        [{ text: 'Entendi', style: 'default' }]
      );
    }
  };

  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const pickImage = async (type: 'vehicle' | 'driver') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Erro', 'Precisamos de permissão para acessar suas fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'vehicle') {
        setVehiclePhoto(result.assets[0].uri);
      } else {
        setDriverPhoto(result.assets[0].uri);
      }
    }
  };

  const handleSignUp = async () => {
    // Validações básicas
    if (!userType) {
      Alert.alert('Erro', 'Por favor, selecione o tipo de usuário');
      return;
    }

    if (!name || !phone || !email || !cpf || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (cpf.replace(/\D/g, '').length !== 11) {
      Alert.alert('Erro', 'CPF inválido');
      return;
    }

    if (!age) {
      Alert.alert('Erro', 'Por favor, informe sua idade');
      return;
    }

    const userAge = parseInt(age);
    
    if (userType === 'cliente' && userAge < 16) {
      Alert.alert('Erro', 'Você precisa ter pelo menos 16 anos para ser cliente');
      return;
    }

    if (userType === 'motorista' && userAge < 18) {
      Alert.alert('Erro', 'Você precisa ter pelo menos 18 anos para ser motorista/entregador');
      return;
    }

    if (gender === 'prefiro-nao-informar') {
      Alert.alert('Erro', 'Por favor, selecione seu gênero');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    // Validações específicas para motorista/entregador
    if (userType === 'motorista') {
      if (!vehicleType || !vehicleBrand || !vehicleModel || !vehicleYear || !vehicleColor || !vehiclePlate || !serviceType) {
        Alert.alert('Erro', 'Preencha todos os dados do veículo (tipo, marca, modelo, ano, cor, placa e tipo de serviço)');
        return;
      }
      
      // Validar tipo de entrega se for serviço de entrega
      if (serviceType === 'entrega' && !deliveryType) {
        Alert.alert('Erro', 'Por favor, selecione o tipo de entrega (Urbana ou Rural)');
        return;
      }
      
      // Validar ano do veículo
      const yearValidation = validateVehicleYear(
        vehicleYear,
        serviceType,
        serviceType === 'entrega' && deliveryType === 'rural' ? 'entrega_rural' : undefined
      );
      
      if (!yearValidation.valid) {
        Alert.alert('Veículo não aceito', yearValidation.message || 'Este veículo não atende aos critérios do XiquêGo.');
        return;
      }
      
      // Confirmar bom estado para veículos antigos em entregas
      const yearNum = vehicleYear === 'Anterior a 1990' ? 1989 : parseInt(vehicleYear);
      const currentYear = new Date().getFullYear();
      
      if (serviceType === 'entrega' && currentYear - yearNum > 10) {
        if (!vehicleGoodCondition) {
          Alert.alert('Confirmação necessária', 'Você precisa confirmar que o veículo está em bom estado, sem ferrugem e com manutenção em dia.');
          return;
        }
        
        if (deliveryType === 'rural' && !vehicleHasStructure) {
          Alert.alert('Confirmação necessária', 'Você precisa confirmar que o veículo possui estrutura adequada para transporte de carga.');
          return;
        }
      }

      if (!vehiclePhoto || !driverPhoto) {
        Alert.alert('Erro', 'Adicione as fotos do veículo e do motorista');
        return;
      }
    }

    setIsLoading(true);

    try {
      // Simular cadastro
      const userData = {
        name,
        email,
        phone,
        cpf: cpf.replace(/\D/g, ''),
        password,
        userType,
        age: userAge,
        gender,
        address: {
          street,
          number,
          neighborhood,
          complement,
          city: 'Xique-Xique',
          state: 'BA',
        },
        ...(userType === 'motorista' && {
          driverData: {
            vehicleType,
            vehicleBrand,
            vehicleModel,
            vehicleYear,
            vehicleColor,
            vehiclePlate,
            serviceType,
            ...(serviceType === 'entrega' && { deliveryType }),
            vehicleGoodCondition,
            vehicleHasStructure: deliveryType === 'rural' ? vehicleHasStructure : null,
            vehiclePhoto,
            driverPhoto,
          },
        }),
      };

      console.log('Dados do cadastro:', userData);

      setTimeout(() => {
        setIsLoading(false);
        Alert.alert(
          '✅ Sucesso',
          'Cadastro realizado com sucesso!',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      }, 1500);
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Erro', error.message || 'Erro ao cadastrar');
    }
  };

  const isMotorista = userType === 'motorista';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Escolha o tipo de usuário</Text>

        {/* User Type Selection */}
        <View style={styles.userTypeContainer}>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === 'cliente' && styles.userTypeButtonActive,
            ]}
            onPress={() => setUserType('cliente')}
          >
            <Text style={styles.userTypeIcon}>👤</Text>
            <Text
              style={[
                styles.userTypeText,
                userType === 'cliente' && styles.userTypeTextActive,
              ]}
            >
              Cliente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === 'motorista' && styles.userTypeButtonActive,
            ]}
            onPress={() => setUserType('motorista')}
          >
            <Text style={styles.userTypeIcon}>🚗</Text>
            <Text
              style={[
                styles.userTypeText,
                userType === 'motorista' && styles.userTypeTextActive,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Motorista/
              Entregador
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dados Pessoais */}
        <Text style={styles.sectionTitle}>📝 Dados Pessoais</Text>

        <Text style={styles.label}>Nome Completo *</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome completo"
          placeholderTextColor={COLORS.grayDark}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>CPF *</Text>
        <TextInput
          style={styles.input}
          placeholder="000.000.000-00"
          placeholderTextColor={COLORS.grayDark}
          value={cpf}
          onChangeText={(text) => setCpf(maskCPF(text))}
          keyboardType="numeric"
          maxLength={14}
        />

        <Text style={styles.label}>Telefone *</Text>
        <TextInput
          style={styles.input}
          placeholder="(00) 00000-0000"
          placeholderTextColor={COLORS.grayDark}
          value={phone}
          onChangeText={(text) => setPhone(maskPhone(text))}
          keyboardType="phone-pad"
          maxLength={15}
        />

        <Text style={styles.label}>E-mail *</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor={COLORS.grayDark}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Idade *</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua idade"
          placeholderTextColor={COLORS.grayDark}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          maxLength={3}
        />

        <Text style={styles.label}>Gênero *</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === 'masculino' && styles.genderButtonActive,
            ]}
            onPress={() => setGender('masculino')}
          >
            <Text style={[
              styles.genderText,
              gender === 'masculino' && styles.genderTextActive,
            ]}>
              Masculino
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === 'feminino' && styles.genderButtonActive,
            ]}
            onPress={() => setGender('feminino')}
          >
            <Text style={[
              styles.genderText,
              gender === 'feminino' && styles.genderTextActive,
            ]}>
              Feminino
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === 'outro' && styles.genderButtonActive,
            ]}
            onPress={() => setGender('outro')}
          >
            <Text style={[
              styles.genderText,
              gender === 'outro' && styles.genderTextActive,
            ]}>
              Outro
            </Text>
          </TouchableOpacity>
        </View>

        {/* Endereço */}
        <Text style={styles.sectionTitle}>📍 Endereço</Text>

        <Text style={styles.label}>Rua</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome da rua"
          placeholderTextColor={COLORS.grayDark}
          value={street}
          onChangeText={setStreet}
        />

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Número</Text>
            <TextInput
              style={styles.input}
              placeholder="N°"
              placeholderTextColor={COLORS.grayDark}
              value={number}
              onChangeText={setNumber}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.halfInput}>
            <Text style={styles.label}>Bairro</Text>
            <TextInput
              style={styles.input}
              placeholder="Bairro"
              placeholderTextColor={COLORS.grayDark}
              value={neighborhood}
              onChangeText={setNeighborhood}
            />
          </View>
        </View>

        <Text style={styles.label}>Complemento</Text>
        <TextInput
          style={styles.input}
          placeholder="Apto, casa, etc (opcional)"
          placeholderTextColor={COLORS.grayDark}
          value={complement}
          onChangeText={setComplement}
        />

        {/* Senha */}
        <Text style={styles.sectionTitle}>🔒 Senha</Text>

        <Text style={styles.label}>Senha *</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={COLORS.grayDark}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color={COLORS.grayDark}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirmar Senha *</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirme sua senha"
            placeholderTextColor={COLORS.grayDark}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={24}
              color={COLORS.grayDark}
            />
          </TouchableOpacity>
        </View>

        {/* Dados do Motorista/Entregador */}
        {isMotorista && (
          <>
            <Text style={styles.sectionTitle}>🚗 Dados do Veículo</Text>

            <Text style={styles.label}>Tipo de Serviço *</Text>
            <View style={styles.serviceTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.serviceButton,
                  serviceType === 'corrida' && styles.serviceButtonActive,
                ]}
                onPress={() => setServiceType('corrida')}
              >
                <Ionicons name="car" size={24} color={serviceType === 'corrida' ? COLORS.secondary : COLORS.textLight} />
                <Text style={[
                  styles.serviceButtonText,
                  serviceType === 'corrida' && styles.serviceButtonTextActive,
                ]}>
                  Corrida
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.serviceButton,
                  serviceType === 'entrega' && styles.serviceButtonActive,
                ]}
                onPress={() => setServiceType('entrega')}
              >
                <Ionicons name="cube" size={24} color={serviceType === 'entrega' ? COLORS.secondary : COLORS.textLight} />
                <Text style={[
                  styles.serviceButtonText,
                  serviceType === 'entrega' && styles.serviceButtonTextActive,
                ]}>
                  Entrega
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tipo de Entrega (apenas se for entrega) */}
            {serviceType === 'entrega' && (
              <>
                <Text style={styles.label}>Tipo de Entrega *</Text>
                <View style={styles.serviceTypeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.serviceButton,
                      deliveryType === 'urbana' && styles.serviceButtonActive,
                    ]}
                    onPress={() => setDeliveryType('urbana')}
                  >
                    <Ionicons name="business" size={24} color={deliveryType === 'urbana' ? COLORS.secondary : COLORS.textLight} />
                    <Text style={[
                      styles.serviceButtonText,
                      deliveryType === 'urbana' && styles.serviceButtonTextActive,
                    ]}>
                      Urbana
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.serviceButton,
                      deliveryType === 'rural' && styles.serviceButtonActive,
                    ]}
                    onPress={() => setDeliveryType('rural')}
                  >
                    <Ionicons name="leaf" size={24} color={deliveryType === 'rural' ? COLORS.secondary : COLORS.textLight} />
                    <Text style={[
                      styles.serviceButtonText,
                      deliveryType === 'rural' && styles.serviceButtonTextActive,
                    ]}>
                      Rural
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Informações sobre requisitos de veículo */}
                <View style={styles.infoBox}>
                  <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                  <Text style={styles.infoText}>
                    {deliveryType === 'rural' 
                      ? '🚜 Entregas rurais: aceita veículos de qualquer ano, desde que em bom estado e com estrutura adequada para carga.'
                      : '🏙️ Entregas urbanas: veículos com até 15 anos de uso.'}
                  </Text>
                </View>
              </>
            )}

            {/* Informação sobre requisitos de veículo para corridas */}
            {serviceType === 'corrida' && (
              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>
                  🚗 Corridas: veículos com até 10 anos de uso para garantir conforto e segurança.
                </Text>
              </View>
            )}

            <Text style={styles.label}>Tipo de Veículo *</Text>
            <View style={styles.vehicleTypeContainer}>
              {(['moto', 'carro', 'bicicleta', 'caminhao', 'outro'] as VehicleType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.vehicleTypeButton,
                    vehicleType === type && styles.vehicleTypeButtonActive,
                  ]}
                  onPress={() => setVehicleType(type)}
                >
                  <Text style={[
                    styles.vehicleTypeText,
                    vehicleType === type && styles.vehicleTypeTextActive,
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Marca *</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowBrandModal(true)}
              disabled={!vehicleType}
            >
              <Text style={vehicleBrand ? styles.selectButtonTextSelected : styles.selectButtonText}>
                {vehicleBrand || (vehicleType ? 'Selecionar marca' : 'Selecione o tipo de veículo primeiro')}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
            </TouchableOpacity>

            <Text style={styles.label}>Modelo *</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowModelModal(true)}
              disabled={!vehicleBrand}
            >
              <Text style={vehicleModel ? styles.selectButtonTextSelected : styles.selectButtonText}>
                {vehicleModel || (vehicleBrand ? 'Selecionar modelo' : 'Selecione a marca primeiro')}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
            </TouchableOpacity>

            <Text style={styles.label}>Ano *</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowYearModal(true)}
            >
              <Text style={vehicleYear ? styles.selectButtonTextSelected : styles.selectButtonText}>
                {vehicleYear || 'Selecionar ano (2015-2025)'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
            </TouchableOpacity>

            <Text style={styles.label}>Cor *</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowColorModal(true)}
            >
              <Text style={vehicleColor ? styles.selectButtonTextSelected : styles.selectButtonText}>
                {vehicleColor || 'Selecionar cor'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
            </TouchableOpacity>

            <Text style={styles.label}>Placa *</Text>
            <TextInput
              style={styles.input}
              placeholder="ABC-1234"
              placeholderTextColor={COLORS.grayDark}
              value={vehiclePlate}
              onChangeText={(text) => setVehiclePlate(text.toUpperCase())}
              autoCapitalize="characters"
              maxLength={8}
            />

            {/* Confirmações para veículos antigos */}
            {vehicleYear && serviceType === 'entrega' && (() => {
              const yearNum = vehicleYear === 'Anterior a 1990' ? 1989 : parseInt(vehicleYear);
              const currentYear = new Date().getFullYear();
              return currentYear - yearNum > 10;
            })() && (
              <>
                <Text style={styles.sectionTitle}>✅ Confirmações Necessárias</Text>
                
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setVehicleGoodCondition(!vehicleGoodCondition)}
                >
                  <View style={[styles.checkbox, vehicleGoodCondition && styles.checkboxChecked]}>
                    {vehicleGoodCondition && (
                      <Ionicons name="checkmark" size={18} color={COLORS.secondary} />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    Confirmo que o veículo está em bom estado, sem ferrugem e com manutenção em dia
                  </Text>
                </TouchableOpacity>

                {deliveryType === 'rural' && (
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setVehicleHasStructure(!vehicleHasStructure)}
                  >
                    <View style={[styles.checkbox, vehicleHasStructure && styles.checkboxChecked]}>
                      {vehicleHasStructure && (
                        <Ionicons name="checkmark" size={18} color={COLORS.secondary} />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>
                      Confirmo que o veículo possui estrutura adequada para transporte de carga (animais, sacas, etc)
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            <Text style={styles.sectionTitle}>📸 Fotos</Text>

            <Text style={styles.label}>Foto do Veículo *</Text>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={() => pickImage('vehicle')}
            >
              {vehiclePhoto ? (
                <Image source={{ uri: vehiclePhoto }} style={styles.photoPreview} />
              ) : (
                <>
                  <Ionicons name="camera" size={32} color={COLORS.primary} />
                  <Text style={styles.photoButtonText}>Adicionar Foto do Veículo</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.label}>Sua Foto *</Text>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={() => pickImage('driver')}
            >
              {driverPhoto ? (
                <Image source={{ uri: driverPhoto }} style={styles.photoPreview} />
              ) : (
                <>
                  <Ionicons name="person" size={32} color={COLORS.primary} />
                  <Text style={styles.photoButtonText}>Adicionar Sua Foto</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* Botão de Cadastro */}
        <TouchableOpacity 
          style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]} 
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text style={styles.signUpButtonText}>
            {isLoading ? 'Cadastrando...' : 'Criar Conta'}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginLink}>Entrar</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal de Seleção de Marca */}
      <Modal
        visible={showBrandModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBrandModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Marca</Text>
              <TouchableOpacity onPress={() => setShowBrandModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {brands.map((brand) => (
                <TouchableOpacity
                  key={brand}
                  style={styles.modalItem}
                  onPress={() => {
                    setVehicleBrand(brand);
                    setVehicleModel(''); // Resetar modelo ao mudar marca
                    setShowBrandModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{brand}</Text>
                  {vehicleBrand === brand && (
                    <Ionicons name="checkmark" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Seleção de Modelo */}
      <Modal
        visible={showModelModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Modelo</Text>
              <TouchableOpacity onPress={() => setShowModelModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {models.map((model: any) => (
                <TouchableOpacity
                  key={model}
                  style={styles.modalItem}
                  onPress={() => {
                    setVehicleModel(model);
                    setShowModelModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{model}</Text>
                  {vehicleModel === model && (
                    <Ionicons name="checkmark" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Seleção de Ano */}
      <Modal
        visible={showYearModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowYearModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Ano</Text>
              <TouchableOpacity onPress={() => setShowYearModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {VEHICLE_YEARS.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={styles.modalItem}
                  onPress={() => handleYearSelection(year)}
                >
                  <Text style={styles.modalItemText}>{year}</Text>
                  {vehicleYear === year && (
                    <Ionicons name="checkmark" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Seleção de Cor */}
      <Modal
        visible={showColorModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowColorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Cor</Text>
              <TouchableOpacity onPress={() => setShowColorModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {VEHICLE_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={styles.modalItem}
                  onPress={() => {
                    setVehicleColor(color);
                    setShowColorModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{color}</Text>
                  {vehicleColor === color && (
                    <Ionicons name="checkmark" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  userTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  userTypeButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  userTypeButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF9E6',
  },
  userTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    textAlign: 'center',
  },
  userTypeTextActive: {
    color: COLORS.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: COLORS.text,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  eyeButton: {
    padding: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  genderButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF9E6',
  },
  genderText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  genderTextActive: {
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  serviceTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  serviceButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  serviceButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF9E6',
  },
  serviceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  serviceButtonTextActive: {
    color: COLORS.secondary,
  },
  vehicleTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  vehicleTypeButton: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  vehicleTypeButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF9E6',
  },
  vehicleTypeText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  vehicleTypeTextActive: {
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  photoButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 150,
  },
  photoButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  photoPreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  signUpButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
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
    marginBottom: 16,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    padding: 0,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  modalItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});

