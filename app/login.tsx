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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular login (remover isso quando tiver backend real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Login de demonstração aceita qualquer email/senha
      const user = {
        id: '1',
        name: email.split('@')[0],
        email: email,
      };
      
      Alert.alert(
        '✅ Bem-vindo!',
        `Olá, ${user.name}!\n\n(Login de demonstração ativo)`,
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Email ou senha incorretos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGmailLogin = async () => {
    setIsLoading(true);
    
    // Simular autenticação com Gmail
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        '✅ Login com Gmail',
        'Você será redirecionado para fazer login com sua conta Google.\n\n(Funcionalidade em desenvolvimento)',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Demo: Entrar', 
            onPress: () => {
              Alert.alert(
                '✅ Bem-vindo!',
                'Login com Gmail simulado com sucesso!',
                [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
              );
            }
          }
        ]
      );
    }, 500);
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/signup');
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🛵</Text>
          </View>
          <Text style={styles.appName}>XIQUÊGO</Text>
          <Text style={styles.slogan}>O app que move Xique-Xique</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor={COLORS.grayDark}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
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

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          {/* Gmail Login Button */}
          <TouchableOpacity
            style={[styles.gmailButton, isLoading && styles.gmailButtonDisabled]}
            onPress={handleGmailLogin}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={styles.gmailButtonText}>Entrar com Gmail</Text>
          </TouchableOpacity>

          {/* Sign Up */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signupLink}>Cadastre-se</Text>
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
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  slogan: {
    fontSize: 14,
    color: COLORS.textLight,
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
  forgotPassword: {
    fontSize: 14,
    color: COLORS.primary,
    textAlign: 'right',
    marginBottom: 24,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  gmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DB4437',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 8,
  },
  gmailButtonDisabled: {
    opacity: 0.6,
  },
  gmailButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DB4437',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  signupLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
