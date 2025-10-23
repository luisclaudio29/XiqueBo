/**
 * Tela de Configurações Offline
 * Mostra estatísticas e permite sincronização manual
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import OfflineService, { OfflineRequest } from '@/services/offline.service';

export default function OfflineSettingsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    synced: 0,
    lastSync: null as Date | null,
  });
  const [pendingRequests, setPendingRequests] = useState<OfflineRequest[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const online = await OfflineService.checkConnection();
      setIsOnline(online);

      const statsData = await OfflineService.getSyncStats();
      setStats(statsData);

      const pending = await OfflineService.getPendingRequests();
      setPendingRequests(pending);
    } catch (error) {
      console.error('Erro ao carregar dados offline:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!isOnline) {
      Alert.alert(
        '📵 Sem Conexão',
        'Você precisa estar conectado à internet para sincronizar.'
      );
      return;
    }

    if (stats.pending === 0) {
      Alert.alert(
        'Tudo Sincronizado! ✅',
        'Não há solicitações pendentes para sincronizar.'
      );
      return;
    }

    setSyncing(true);
    try {
      const result = await OfflineService.syncPendingRequests();

      Alert.alert(
        '✅ Sincronização Concluída',
        `${result.success} solicitações sincronizadas com sucesso!\n${
          result.failed > 0 ? `\n${result.failed} falharam.` : ''
        }`
      );

      loadData();
    } catch (error) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro durante a sincronização. Tente novamente.'
      );
    } finally {
      setSyncing(false);
    }
  };

  const handleCleanup = async () => {
    Alert.alert(
      'Limpar Dados Antigos',
      'Deseja remover solicitações já sincronizadas com mais de 7 dias?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            const removed = await OfflineService.cleanupOldRequests();
            Alert.alert('Concluído', `${removed} solicitações antigas foram removidas.`);
            loadData();
          },
        },
      ]
    );
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Nunca';
    return date.toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadData} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Modo Offline</Text>
      </View>

      {/* Status da Conexão */}
      <View style={[styles.card, isOnline ? styles.cardOnline : styles.cardOffline]}>
        <Text style={styles.cardIcon}>{isOnline ? '✅' : '📵'}</Text>
        <Text style={styles.cardTitle}>
          {isOnline ? 'Você está Online' : 'Você está Offline'}
        </Text>
        <Text style={styles.cardSubtitle}>
          {isOnline
            ? 'Suas solicitações serão enviadas imediatamente'
            : 'Suas solicitações serão salvas e enviadas quando a internet voltar'}
        </Text>
      </View>

      {/* Estatísticas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Estatísticas</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>

          <View style={[styles.statCard, styles.statCardPending]}>
            <Text style={[styles.statValue, styles.statValuePending]}>
              {stats.pending}
            </Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>

          <View style={[styles.statCard, styles.statCardSynced]}>
            <Text style={[styles.statValue, styles.statValueSynced]}>
              {stats.synced}
            </Text>
            <Text style={styles.statLabel}>Sincronizadas</Text>
          </View>
        </View>

        <View style={styles.lastSyncContainer}>
          <Text style={styles.lastSyncLabel}>Última sincronização:</Text>
          <Text style={styles.lastSyncValue}>{formatDate(stats.lastSync)}</Text>
        </View>
      </View>

      {/* Solicitações Pendentes */}
      {pendingRequests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏳ Aguardando Sincronização</Text>

          {pendingRequests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <Text style={styles.requestIcon}>
                  {request.type === 'ride' ? '🚗' : '📦'}
                </Text>
                <Text style={styles.requestType}>
                  {request.type === 'ride' ? 'Corrida' : 'Entrega'}
                </Text>
                <Text style={styles.requestDate}>
                  {new Date(request.timestamp).toLocaleDateString('pt-BR')}
                </Text>
              </View>

              <View style={styles.requestDetails}>
                <Text style={styles.requestLabel}>De:</Text>
                <Text style={styles.requestValue}>{request.origin.address}</Text>
              </View>

              <View style={styles.requestDetails}>
                <Text style={styles.requestLabel}>Para:</Text>
                <Text style={styles.requestValue}>{request.destination.address}</Text>
              </View>

              <View style={styles.requestDetails}>
                <Text style={styles.requestLabel}>Valor estimado:</Text>
                <Text style={[styles.requestValue, styles.requestPrice]}>
                  R$ {request.estimatedValue.toFixed(2)}
                </Text>
              </View>

              <View style={styles.requestDetails}>
                <Text style={styles.requestLabel}>Pagamento:</Text>
                <Text style={styles.requestValue}>{request.paymentMethod}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Ações */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.buttonPrimary,
            (!isOnline || syncing || stats.pending === 0) && styles.buttonDisabled,
          ]}
          onPress={handleSync}
          disabled={!isOnline || syncing || stats.pending === 0}
        >
          {syncing ? (
            <>
              <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Sincronizando...</Text>
            </>
          ) : (
            <>
              <Text style={styles.buttonIcon}>🔄</Text>
              <Text style={styles.buttonText}>Sincronizar Agora</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleCleanup}
          disabled={syncing}
        >
          <Text style={styles.buttonIcon}>🗑️</Text>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            Limpar Dados Antigos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Informações */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>ℹ️ Como Funciona</Text>
        <Text style={styles.infoText}>
          • Quando você está sem internet, suas solicitações são salvas localmente
        </Text>
        <Text style={styles.infoText}>
          • Assim que a internet voltar, elas são enviadas automaticamente
        </Text>
        <Text style={styles.infoText}>
          • Você pode sincronizar manualmente a qualquer momento
        </Text>
        <Text style={styles.infoText}>
          • GPS funciona mesmo sem internet (apenas coordenadas)
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  header: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  cardOnline: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  cardOffline: {
    backgroundColor: '#FFEBEE',
    borderWidth: 2,
    borderColor: '#FF5252',
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.gray,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statCardPending: {
    backgroundColor: '#FFF3E0',
  },
  statCardSynced: {
    backgroundColor: '#E8F5E9',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  statValuePending: {
    color: '#F57C00',
  },
  statValueSynced: {
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  lastSyncContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  lastSyncLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  lastSyncValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  requestCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  requestIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  requestType: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  requestDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  requestDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  requestLabel: {
    fontSize: 14,
    color: COLORS.gray,
    width: 120,
  },
  requestValue: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  requestPrice: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.5,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  buttonTextSecondary: {
    color: COLORS.primary,
  },
  infoSection: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.text,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
    lineHeight: 20,
  },
});

