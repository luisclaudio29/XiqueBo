/**
 * Serviço de Vouchers/Cupons - XiqueGO
 */

import type { Voucher, VoucherValidation, AppliedVoucher } from '../types/voucher.types';
import { PaymentLogger } from './payment-logger.service';

export class VoucherService {
  private static instance: VoucherService;
  private logger = PaymentLogger.getInstance();

  // Vouchers de exemplo (em produção, viriam do backend)
  private vouchers: Voucher[] = [
    {
      id: 'v1',
      code: 'PRIMEIRA',
      type: 'first_ride',
      value: 12, // 12% de desconto
      description: 'Primeira corrida - 12% OFF',
      status: 'active',
      usageLimit: 1,
      usageCount: 0,
      conditions: {
        firstRideOnly: true,
      },
    },
    {
      id: 'v2',
      code: 'BEM-VINDO',
      type: 'percentage',
      value: 10, // 10% de desconto
      description: 'Boas-vindas - 10% OFF',
      status: 'active',
      maxDiscount: 15,
      usageLimit: 3,
      usageCount: 0,
    },
    {
      id: 'v3',
      code: 'XIQUE5',
      type: 'fixed_amount',
      value: 5, // R$ 5 de desconto
      description: 'R$ 5 OFF em qualquer corrida',
      status: 'active',
      minAmount: 20,
      usageLimit: 1,
      usageCount: 0,
    },
    {
      id: 'v4',
      code: 'FERIADO',
      type: 'percentage',
      value: 20, // 20% de desconto
      description: 'Feriado - 20% OFF',
      status: 'active',
      maxDiscount: 25,
      expiresAt: new Date('2025-12-31'),
      usageLimit: 5,
      usageCount: 0,
    },
  ];

  private constructor() {}

  static getInstance(): VoucherService {
    if (!VoucherService.instance) {
      VoucherService.instance = new VoucherService();
    }
    return VoucherService.instance;
  }

  /**
   * Valida um código de voucher
   */
  async validateVoucher(
    code: string,
    amount: number,
    userId: string,
    isFirstRide: boolean = false
  ): Promise<VoucherValidation> {
    try {
      this.logger.log('VOUCHER_VALIDATION_STARTED', userId, {
        code,
        amount,
      });

      const voucher = this.vouchers.find(
        v => v.code.toUpperCase() === code.toUpperCase()
      );

      if (!voucher) {
        return {
          isValid: false,
          message: 'Voucher não encontrado',
        };
      }

      // Verifica status
      if (voucher.status !== 'active') {
        return {
          isValid: false,
          message: 'Voucher inválido ou expirado',
        };
      }

      // Verifica expiração
      if (voucher.expiresAt && new Date() > voucher.expiresAt) {
        return {
          isValid: false,
          message: 'Voucher expirado',
        };
      }

      // Verifica limite de uso
      if (voucher.usageLimit && voucher.usageCount >= voucher.usageLimit) {
        return {
          isValid: false,
          message: 'Voucher já utilizado',
        };
      }

      // Verifica se é primeira corrida
      if (voucher.conditions?.firstRideOnly && !isFirstRide) {
        return {
          isValid: false,
          message: 'Voucher válido apenas para primeira corrida',
        };
      }

      // Verifica valor mínimo
      if (voucher.minAmount && amount < voucher.minAmount) {
        return {
          isValid: false,
          message: `Valor mínimo: R$ ${voucher.minAmount.toFixed(2)}`,
        };
      }

      // Calcula desconto
      const discount = this.calculateDiscount(voucher, amount);
      const finalAmount = amount - discount;

      this.logger.log('VOUCHER_VALIDATED', userId, {
        code,
        discount,
        finalAmount,
      });

      return {
        isValid: true,
        message: `Desconto aplicado: R$ ${discount.toFixed(2)}`,
        discount,
        finalAmount,
      };
    } catch (error: any) {
      this.logger.error('VOUCHER_VALIDATION_ERROR', userId, error);
      return {
        isValid: false,
        message: 'Erro ao validar voucher',
      };
    }
  }

  /**
   * Calcula desconto do voucher
   */
  private calculateDiscount(voucher: Voucher, amount: number): number {
    let discount = 0;

    if (voucher.type === 'percentage') {
      discount = (amount * voucher.value) / 100;
      
      // Aplica desconto máximo se houver
      if (voucher.maxDiscount && discount > voucher.maxDiscount) {
        discount = voucher.maxDiscount;
      }
    } else if (voucher.type === 'fixed_amount' || voucher.type === 'first_ride' || voucher.type === 'referral') {
      // Para tipos que podem ter porcentagem ou valor fixo
      if (voucher.type === 'first_ride' || voucher.type === 'referral') {
        // Assume porcentagem
        discount = (amount * voucher.value) / 100;
      } else {
        // Valor fixo
        discount = voucher.value;
      }
    }

    // Desconto não pode ser maior que o valor total
    if (discount > amount) {
      discount = amount;
    }

    return discount;
  }

  /**
   * Aplica voucher (marca como usado)
   */
  async applyVoucher(
    code: string,
    amount: number,
    userId: string
  ): Promise<AppliedVoucher | null> {
    try {
      const voucher = this.vouchers.find(
        v => v.code.toUpperCase() === code.toUpperCase()
      );

      if (!voucher) return null;

      const discount = this.calculateDiscount(voucher, amount);
      const finalAmount = amount - discount;

      // Incrementa contador de uso
      voucher.usageCount++;

      this.logger.log('VOUCHER_APPLIED', userId, {
        code,
        discount,
        finalAmount,
      });

      return {
        voucher,
        originalAmount: amount,
        discountAmount: discount,
        finalAmount,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtém vouchers disponíveis para o usuário
   */
  async getAvailableVouchers(userId: string, isFirstRide: boolean = false): Promise<Voucher[]> {
    return this.vouchers.filter(voucher => {
      // Ativo
      if (voucher.status !== 'active') return false;

      // Não expirado
      if (voucher.expiresAt && new Date() > voucher.expiresAt) return false;

      // Tem usos disponíveis
      if (voucher.usageLimit && voucher.usageCount >= voucher.usageLimit) return false;

      // Se for voucher de primeira corrida, só mostra se for primeira corrida
      if (voucher.conditions?.firstRideOnly && !isFirstRide) return false;

      return true;
    });
  }
}




