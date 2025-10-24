/**
 * Constantes de Pagamento
 */

// Taxa da empresa sobre cada corrida/entrega
export const COMPANY_FEE_PERCENTAGE = 0.02; // 2%

// Valor mínimo para saque (motoristas/entregadores)
export const MINIMUM_WITHDRAWAL = 95.00; // R$ 95,00

// Métodos de pagamento disponíveis
export const PAYMENT_METHODS = {
  pix: 'PIX',
  cartao: 'Cartão',
  dinheiro: 'Dinheiro',
} as const;

// Cupons de desconto disponíveis
export const AVAILABLE_COUPONS = {
  PRIMEIRA: { discount: 0.12, description: '12% OFF na primeira corrida' },
  'BEM-VINDO': { discount: 0.10, maxDiscount: 15, description: '10% OFF (máx. R$ 15)' },
  XIQUE5: { discount: 5, minOrder: 20, description: 'R$ 5 OFF (mín. R$ 20)' },
} as const;

