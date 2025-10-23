/**
 * Sistema de Logs e Auditoria de Pagamentos
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PaymentLog } from '../types/payment.types';

export class PaymentLogger {
  private static instance: PaymentLogger;
  private readonly STORAGE_KEY = '@xiquego_payment_logs';

  private constructor() {}

  static getInstance(): PaymentLogger {
    if (!PaymentLogger.instance) {
      PaymentLogger.instance = new PaymentLogger();
    }
    return PaymentLogger.instance;
  }

  /**
   * Registra log de ação
   */
  async log(
    action: string,
    userId: string,
    details: any
  ): Promise<void> {
    try {
      const logEntry: PaymentLog = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        action,
        userId,
        details,
      };

      await this.savelog(logEntry);
      console.log(`[PAYMENT LOG] ${action}:`, details);
    } catch (error) {
      console.error('Erro ao salvar log:', error);
    }
  }

  /**
   * Registra erro
   */
  async error(
    action: string,
    userId: string,
    error: any
  ): Promise<void> {
    try {
      const logEntry: PaymentLog = {
        id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        action: `ERROR_${action}`,
        userId,
        details: {
          message: error.message,
          stack: error.stack,
          data: error.response?.data,
        },
      };

      await this.savelog(logEntry);
      console.error(`[PAYMENT ERROR] ${action}:`, error);
    } catch (err) {
      console.error('Erro ao salvar log de erro:', err);
    }
  }

  /**
   * Salva log no AsyncStorage
   */
  private async savelog(logEntry: PaymentLog): Promise<void> {
    try {
      const existingLogs = await this.getLogs();
      const updatedLogs = [logEntry, ...existingLogs].slice(0, 1000); // Mantém últimos 1000 logs

      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(updatedLogs)
      );
    } catch (error) {
      console.error('Erro ao salvar log:', error);
    }
  }

  /**
   * Obtém todos os logs
   */
  async getLogs(): Promise<PaymentLog[]> {
    try {
      const logsJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      return logsJson ? JSON.parse(logsJson) : [];
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      return [];
    }
  }

  /**
   * Limpa logs antigos (> 30 dias)
   */
  async clearOldLogs(): Promise<void> {
    try {
      const logs = await this.getLogs();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentLogs = logs.filter(
        log => new Date(log.timestamp) > thirtyDaysAgo
      );

      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(recentLogs)
      );

      console.log(`Logs limpos. Removidos: ${logs.length - recentLogs.length}`);
    } catch (error) {
      console.error('Erro ao limpar logs:', error);
    }
  }

  /**
   * Exporta logs para auditoria
   */
  async exportLogs(): Promise<string> {
    try {
      const logs = await this.getLogs();
      return JSON.stringify(logs, null, 2);
    } catch (error) {
      console.error('Erro ao exportar logs:', error);
      return '[]';
    }
  }
}




