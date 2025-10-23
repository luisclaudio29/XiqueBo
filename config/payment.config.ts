/**
 * Configuração de Pagamentos - XiquêGo
 * 
 * ⚠️ IMPORTANTE: As credenciais estão no arquivo .env (NÃO compartilhe)
 */

// Credenciais do Mercado Pago (vêm do .env)
export const MERCADO_PAGO_CONFIG = {
  publicKey: process.env.MERCADO_PAGO_PUBLIC_KEY || '',
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
};

// Configurações do app
export const APP_CONFIG = {
  commissionPercentage: Number(process.env.APP_COMMISSION_PERCENTAGE) || 2,
  minWithdrawalAmount: Number(process.env.APP_MIN_WITHDRAWAL_AMOUNT) || 127,
};

// URLs da API do Mercado Pago
export const MERCADO_PAGO_API = {
  baseUrl: 'https://api.mercadopago.com',
  endpoints: {
    payment: '/v1/payments',
    pixPayment: '/v1/payments',
    cardToken: '/v1/card_tokens',
    customers: '/v1/customers',
  },
};

// Tipos de pagamento aceitos
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PIX: 'pix',
} as const;

// Bandeiras de cartão aceitas
export const ACCEPTED_CARD_BRANDS = [
  'visa',
  'mastercard',
  'amex',
  'elo',
  'hipercard',
] as const;

// Bloqueio de vale-refeição/alimentação
export const BLOCKED_CARD_TYPES = [
  'meal_voucher',
  'food_voucher',
  'benefit',
] as const;

// Status de pagamento
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  IN_PROCESS: 'in_process',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;




