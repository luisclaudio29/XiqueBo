/**
 * Serviço de Funcionalidades Offline
 * Permite usar o app SEM INTERNET nos povoados
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export interface OfflineRequest {
  id: string;
  type: 'ride' | 'delivery';
  origin: {
    latitude: number;
    longitude: number;
    address: string;
  };
  destination: {
    latitude: number;
    longitude: number;
    address: string;
  };
  serviceType: string;
  paymentMethod: string;
  estimatedValue: number;
  timestamp: number;
  synced: boolean;
}

export interface OfflineData {
  requests: OfflineRequest[];
  lastSync: number;
}

class OfflineService {
  private static OFFLINE_REQUESTS_KEY = '@xiquego:offline_requests';
  private static OFFLINE_MODE_KEY = '@xiquego:offline_mode';
  private static MAP_CACHE_KEY = '@xiquego:map_cache';
  
  private isOnline: boolean = true;
  private syncQueue: OfflineRequest[] = [];

  constructor() {
    this.initNetworkListener();
  }

  /**
   * Monitora conexão de internet
   */
  private initNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;

      // Se voltou online, sincroniza automaticamente
      if (wasOffline && this.isOnline) {
        console.log('📡 Internet voltou! Sincronizando...');
        this.syncPendingRequests();
      }
    });
  }

  /**
   * Verifica se está online
   */
  async checkConnection(): Promise<boolean> {
    const state = await NetInfo.fetch();
    this.isOnline = state.isConnected ?? false;
    return this.isOnline;
  }

  /**
   * Retorna status da conexão
   */
  getConnectionStatus(): boolean {
    return this.isOnline;
  }

  /**
   * Salva solicitação de corrida OFFLINE
   */
  async saveOfflineRequest(request: Omit<OfflineRequest, 'id' | 'timestamp' | 'synced'>): Promise<string> {
    const offlineRequest: OfflineRequest = {
      ...request,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      synced: false,
    };

    const existingRequests = await this.getOfflineRequests();
    existingRequests.push(offlineRequest);

    await AsyncStorage.setItem(
      OfflineService.OFFLINE_REQUESTS_KEY,
      JSON.stringify(existingRequests)
    );

    console.log(`💾 Corrida salva OFFLINE: ${offlineRequest.id}`);
    return offlineRequest.id;
  }

  /**
   * Recupera todas as solicitações offline
   */
  async getOfflineRequests(): Promise<OfflineRequest[]> {
    try {
      const data = await AsyncStorage.getItem(OfflineService.OFFLINE_REQUESTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao recuperar solicitações offline:', error);
      return [];
    }
  }

  /**
   * Recupera solicitações não sincronizadas
   */
  async getPendingRequests(): Promise<OfflineRequest[]> {
    const requests = await this.getOfflineRequests();
    return requests.filter(req => !req.synced);
  }

  /**
   * Sincroniza solicitações pendentes com servidor
   */
  async syncPendingRequests(): Promise<{ success: number; failed: number }> {
    const pending = await this.getPendingRequests();
    
    if (pending.length === 0) {
      console.log('✅ Nenhuma solicitação pendente para sincronizar');
      return { success: 0, failed: 0 };
    }

    console.log(`🔄 Sincronizando ${pending.length} solicitações...`);
    
    let success = 0;
    let failed = 0;

    for (const request of pending) {
      try {
        // Simulação de envio ao servidor
        // TODO: Substituir por chamada real à API
        await this.sendToServer(request);
        
        // Marca como sincronizada
        await this.markAsSynced(request.id);
        success++;
        
        console.log(`✅ Sincronizado: ${request.id}`);
      } catch (error) {
        console.error(`❌ Falha ao sincronizar ${request.id}:`, error);
        failed++;
      }
    }

    console.log(`📊 Sincronização concluída: ${success} sucesso, ${failed} falhas`);
    return { success, failed };
  }

  /**
   * Envia solicitação ao servidor (simulação)
   */
  private async sendToServer(request: OfflineRequest): Promise<void> {
    // Simulação de envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Implementar chamada real à API
    console.log('📤 Enviando ao servidor:', request.id);
  }

  /**
   * Marca solicitação como sincronizada
   */
  private async markAsSynced(requestId: string): Promise<void> {
    const requests = await this.getOfflineRequests();
    const updated = requests.map(req => 
      req.id === requestId ? { ...req, synced: true } : req
    );
    
    await AsyncStorage.setItem(
      OfflineService.OFFLINE_REQUESTS_KEY,
      JSON.stringify(updated)
    );
  }

  /**
   * Remove solicitações já sincronizadas antigas (> 7 dias)
   */
  async cleanupOldRequests(): Promise<number> {
    const requests = await this.getOfflineRequests();
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    const filtered = requests.filter(req => 
      !req.synced || req.timestamp > sevenDaysAgo
    );
    
    const removed = requests.length - filtered.length;
    
    if (removed > 0) {
      await AsyncStorage.setItem(
        OfflineService.OFFLINE_REQUESTS_KEY,
        JSON.stringify(filtered)
      );
      console.log(`🗑️ Removidas ${removed} solicitações antigas`);
    }
    
    return removed;
  }

  /**
   * Cache de dados do mapa para uso offline
   */
  async cacheMapData(data: any): Promise<void> {
    await AsyncStorage.setItem(
      OfflineService.MAP_CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
    console.log('💾 Dados do mapa salvos em cache');
  }

  /**
   * Recupera cache do mapa
   */
  async getCachedMapData(): Promise<any> {
    try {
      const cached = await AsyncStorage.getItem(OfflineService.MAP_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        
        // Cache válido por 30 dias
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        if (timestamp > thirtyDaysAgo) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Erro ao recuperar cache do mapa:', error);
      return null;
    }
  }

  /**
   * Estatísticas de sincronização
   */
  async getSyncStats(): Promise<{
    total: number;
    pending: number;
    synced: number;
    lastSync: Date | null;
  }> {
    const requests = await this.getOfflineRequests();
    const pending = requests.filter(req => !req.synced);
    const synced = requests.filter(req => req.synced);
    
    const lastSyncedRequest = synced.sort((a, b) => b.timestamp - a.timestamp)[0];
    
    return {
      total: requests.length,
      pending: pending.length,
      synced: synced.length,
      lastSync: lastSyncedRequest ? new Date(lastSyncedRequest.timestamp) : null,
    };
  }

  /**
   * Força sincronização manual
   */
  async forceSyncNow(): Promise<boolean> {
    const isOnline = await this.checkConnection();
    
    if (!isOnline) {
      console.log('❌ Sem conexão. Sincronização adiada.');
      return false;
    }

    await this.syncPendingRequests();
    return true;
  }

  /**
   * Limpa todos os dados offline (usar com cuidado!)
   */
  async clearAllOfflineData(): Promise<void> {
    await AsyncStorage.multiRemove([
      OfflineService.OFFLINE_REQUESTS_KEY,
      OfflineService.MAP_CACHE_KEY,
      OfflineService.OFFLINE_MODE_KEY,
    ]);
    console.log('🗑️ Todos os dados offline foram removidos');
  }
}

export default new OfflineService();

