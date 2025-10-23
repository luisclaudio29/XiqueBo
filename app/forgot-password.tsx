import { useState, useEffect } from 'react';
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
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import AuthService from '@/services/auth.service';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsBiometricSupported(compatible && enrolled);
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verificação de Identidade',
        fallbackLabel: 'Usar senha do dispositivo',
        cancelLabel: 'Cancelar',
      });

      if (result.success) {
        Alert.alert(
          '✅ Verificação Bem-sucedida',
          'Identidade verificada! Você pode redefinir sua senha.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/reset-password'),
            },
          ]
        );
      } else {
        Alert.alert('Erro', 'Verificação de identidade falhou. Tente novamente.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível realizar a verificação de identidade.');
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, digite seu e-mail');
      return;
    }

    setIsLoading(true);

    // Simula envio de e-mail
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        '✅ E-mail Enviado',
        'Enviamos um link para redefinir sua senha. Verifique sua caixa de entrada.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/reset-password'),
          },
        ]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>🔐</Text>
          </View>
          <Text style={styles.title}>Esqueceu a Senha?</Text>
          <Text style={styles.subtitle}>
            Escolha uma forma de recuperação
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Biometric Auth Button */}
          {isBiometricSupported && (
            <>
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricAuth}
              >
                <Ionicons name="scan" size={32} color={COLORS.primary} />
                <Text style={styles.biometricButtonText}>
                  Verificação de Rosto/Digital
                </Text>
                <Text style={styles.biometricButtonSubtext}>
                  Use seu rosto ou digital para verificar sua identidade
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OU</Text>
                <View style={styles.dividerLine} />
              </View>
            </>
          )}

          {/* Email Reset */}
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

          <TouchableOpacity
            style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text style={styles.resetButtonText}>
              {isLoading ? 'Enviando...' : 'Enviar Link por E-mail'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Voltar ao Login</Text>
          </TouchableOpacity>
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
    marginTop: 60,
    marginBottom: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
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
    marginBottom: 24,
    color: COLORS.text,
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  resetButtonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  biometricButton: {
    backgroundColor: '#FFF9E6',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  biometricButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginTop: 12,
  },
  biometricButtonSubtext: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '600',
  },
});


