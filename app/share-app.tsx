import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useState } from 'react';

interface ReferralStats {
  totalReferred: number;
  activeReferred: number;
  completedRides: number;
  discountEarned: number;
  referralCode: string;
}

export default function ShareAppScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<ReferralStats>({
    totalReferred: 3,
    activeReferred: 2,
    completedRides: 2,
    discountEarned: 0,
    referralCode: 'XIQUE2024ABC',
  });

  const shareApp = async () => {
    try {
      const message = `🚗 Baixe o XiquêGo e ganhe 12% de desconto na primeira corrida!\n\nUse meu código: ${stats.referralCode}\n\n📱 Baixe agora: https://xiquego.app/download?ref=${stats.referralCode}\n\nO app que move Xique-Xique! 🌟`;
      
      await Share.share({
        message,
        title: 'Convide para o XiquêGo',
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar');
    }
  };

  const copyCode = () => {
    Alert.alert('Código Copiado!', `Código ${stats.referralCode} copiado para área de transferência`);
  };

  const progressPercentage = (stats.completedRides / 5) * 100;
  const ridesRemaining = 5 - stats.completedRides;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compartilhar App</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Referral Code Card */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Seu Código de Indicação</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.code}>{stats.referralCode}</Text>
            <TouchableOpacity onPress={copyCode} style={styles.copyButton}>
              <Text style={styles.copyButtonText}>Copiar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How it Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como Funciona?</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🎁</Text>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Seus amigos ganham</Text>
                <Text style={styles.infoDescription}>
                  12% de desconto na primeira corrida ou entrega
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🎉</Text>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Você ganha</Text>
                <Text style={styles.infoDescription}>
                  5% de desconto a cada 5 pessoas que completarem uma corrida
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>✅</Text>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Regras</Text>
                <Text style={styles.infoDescription}>
                  As 5 pessoas precisam fazer login E completar pelo menos 1 corrida
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seu Progresso</Text>
          
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>
                Próximo Desconto: 5%
              </Text>
              <Text style={styles.progressSubtitle}>
                {stats.completedRides}/5 corridas completadas
              </Text>
            </View>

            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercentage}%` }
                ]} 
              />
            </View>

            <Text style={styles.progressText}>
              {ridesRemaining > 0 
                ? `Faltam ${ridesRemaining} ${ridesRemaining === 1 ? 'corrida' : 'corridas'} para ganhar 5% de desconto!`
                : 'Parabéns! Você ganhou 5% de desconto na próxima viagem!'
              }
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suas Estatísticas</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalReferred}</Text>
              <Text style={styles.statLabel}>Total de Indicações</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.activeReferred}</Text>
              <Text style={styles.statLabel}>Indicações Ativas</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.completedRides}</Text>
              <Text style={styles.statLabel}>Corridas Completadas</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.discountEarned}%</Text>
              <Text style={styles.statLabel}>Desconto Acumulado</Text>
            </View>
          </View>
        </View>

        {/* Share Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.shareButton} onPress={shareApp}>
            <Text style={styles.shareButtonIcon}>📤</Text>
            <Text style={styles.shareButtonText}>Compartilhar Agora</Text>
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
  codeCard: {
    margin: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 14,
    color: COLORS.secondary,
    opacity: 0.9,
    marginBottom: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  code: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary,
    letterSpacing: 2,
  },
  copyButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 16,
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  progressCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 16,
    padding: 20,
  },
  progressHeader: {
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  progressBar: {
    height: 12,
    backgroundColor: COLORS.gray,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  shareButtonIcon: {
    fontSize: 24,
  },
  shareButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
});




