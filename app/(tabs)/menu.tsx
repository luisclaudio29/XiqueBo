import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';

export default function MenuScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => router.replace('/login'),
        },
      ]
    );
  };

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
        <Text style={styles.headerSubtitle}>Configurações e mais</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* User Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minha Conta</Text>

          <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/(tabs)/profile')}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>👤</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Meu Perfil</Text>
              <Text style={styles.menuSubtitle}>Dados pessoais e documentos</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/(tabs)/activities')}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>🕐</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Histórico</Text>
              <Text style={styles.menuSubtitle}>Todas as corridas e entregas</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuCard} 
            onPress={() => router.push('/driver/wallet')}
          >
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>💰</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Carteira do Motorista</Text>
              <Text style={styles.menuSubtitle}>Ganhos, saques e pagamentos</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <TouchableOpacity style={styles.menuCard} onPress={() => Alert.alert('Notificações', 'Configurações de notificações em breve!')}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>🔔</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Notificações</Text>
              <Text style={styles.menuSubtitle}>Gerencie suas notificações</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => handleNavigation('/language')}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>🌐</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Idioma</Text>
              <Text style={styles.menuSubtitle}>Português (Brasil)</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => Alert.alert('Privacidade', 'Configurações de privacidade em breve!')}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>🔒</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Privacidade e Segurança</Text>
              <Text style={styles.menuSubtitle}>Gerencie suas preferências</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>

          <TouchableOpacity style={styles.menuCard} onPress={() => handleNavigation('/help-center')}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>❓</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Central de Ajuda</Text>
              <Text style={styles.menuSubtitle}>FAQ e dúvidas frequentes</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => handleNavigation('/help-center')}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>💬</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Fale Conosco</Text>
              <Text style={styles.menuSubtitle}>Chat com suporte</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => Alert.alert('Relatar Problema', 'Descreva o problema que você encontrou. Em breve você poderá enviar relatórios detalhados.')}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>⚠️</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Relatar Problema</Text>
              <Text style={styles.menuSubtitle}>Nos ajude a melhorar</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>

          <TouchableOpacity style={styles.menuCard} onPress={() => Alert.alert('Diretrizes', 'Nossos compromissos:\n\n• Transparência nos pagamentos\n• 2% de comissão justa\n• Suporte dedicado\n• Segurança em primeiro lugar')}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>📄</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Diretrizes da Empresa</Text>
              <Text style={styles.menuSubtitle}>Políticas e compromissos</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => handleNavigation('/share-app')}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>📤</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Compartilhar App</Text>
              <Text style={styles.menuSubtitle}>Convide amigos e ganhe descontos</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => Alert.alert('XiquêGo', 'O app que move Xique-Xique!\n\nVersão: 1.0.0\nDesenvolvido com ❤️ para nossa comunidade')}>
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>ℹ️</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Sobre o XiquêGo</Text>
              <Text style={styles.menuSubtitle}>Versão 1.0.0</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
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
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.secondary,
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIconText: {
    fontSize: 24,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.grayDark,
  },
  logoutButton: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.error,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.error,
  },
});


