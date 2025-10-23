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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import AuthService from '@/services/auth.service';
import { Gender } from '@/types/user.types';

type UserType = 'cliente' | 'motorista' | 'entregador' | null;

export default function SignUpScreen() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('prefiro-nao-informar');
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!userType) {
      Alert.alert('Erro', 'Por favor, selecione o tipo de usuário');
      return;
    }

    if (!name || !phone || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
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

    if ((userType === 'motorista' || userType === 'entregador') && userAge < 18) {
      Alert.alert('Erro', 'Você precisa ter pelo menos 18 anos para ser motorista ou entregador');
      return;
    }

    if (gender === 'prefiro-nao-informar') {
      Alert.alert('Erro', 'Por favor, selecione seu gênero');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    try {
      await AuthService.signUp({
        name,
        email,
        phone,
        password,
        userType,
        age: userAge,
        gender,
        address: street || neighborhood ? {
          street,
          neighborhood,
          city: 'Xique-Xique',
          state: 'BA',
          zipCode: '',
        } : undefined,
      });

      Alert.alert(
        '✅ Sucesso',
        'Cadastro realizado com sucesso! Você já está logado.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao cadastrar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
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
            <Text style={styles.userTypeIcon}>🛵</Text>
            <Text
              style={[
                styles.userTypeText,
                userType === 'motorista' && styles.userTypeTextActive,
              ]}
            >
              Motorista
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === 'entregador' && styles.userTypeButtonActive,
            ]}
            onPress={() => setUserType('entregador')}
          >
            <Text style={styles.userTypeIcon}>📦</Text>
            <Text
              style={[
                styles.userTypeText,
                userType === 'entregador' && styles.userTypeTextActive,
              ]}
            >
              Entregador
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome Completo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome completo"
            placeholderTextColor={COLORS.grayDark}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Telefone *</Text>
          <TextInput
            style={styles.input}
            placeholder="(00) 00000-0000"
            placeholderTextColor={COLORS.grayDark}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
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

          <Text style={styles.label}>Senha *</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Digite sua senha"
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

          <Text style={styles.sectionTitle}>📍 Informações Pessoais</Text>
          <Text style={styles.sectionSubtitle}>Campos obrigatórios</Text>

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

          <Text style={styles.label}>Rua/Endereço (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Rua Principal"
            placeholderTextColor={COLORS.grayDark}
            value={street}
            onChangeText={setStreet}
          />

          <Text style={styles.label}>Bairro (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Centro"
            placeholderTextColor={COLORS.grayDark}
            value={neighborhood}
            onChangeText={setNeighborhood}
          />

          <TouchableOpacity 
            style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]} 
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text style={styles.signUpButtonText}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginTop: 40,
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
    marginBottom: 32,
  },
  userTypeButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  userTypeTextActive: {
    color: COLORS.secondary,
  },
  formContainer: {
    flex: 1,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 16,
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
});
