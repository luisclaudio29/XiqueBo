/**
 * Tipos TypeScript para Sistema de Voucher
 */

export type VoucherType = 'percentage' | 'fixed_amount' | 'first_ride' | 'referral';

export type VoucherStatus = 'active' | 'used' | 'expired' | 'invalid';

export interface Voucher {
  id: string;
  code: string;
  type: VoucherType;
  value: number; // Porcentagem (ex: 10) ou valor fixo (ex: 5.00)
  description: string;
  minAmount?: number; // Valor mínimo da corrida para usar
  maxDiscount?: number; // Desconto máximo em reais
  expiresAt?: Date;
  usageLimit?: number; // Quantas vezes pode ser usado
  usageCount: number; // Quantas vezes foi usado
  status: VoucherStatus;
  conditions?: {
    firstRideOnly?: boolean;
    validDays?: number[]; // 0-6 (domingo-sábado)
    validHours?: { start: string; end: string };
    validPaymentMethods?: string[];
  };
}

export interface VoucherValidation {
  isValid: boolean;
  message: string;
  discount?: number;
  finalAmount?: number;
}

export interface AppliedVoucher {
  voucher: Voucher;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
}




