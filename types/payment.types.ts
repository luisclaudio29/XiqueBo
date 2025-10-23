/**
 * Tipos TypeScript para Sistema de Pagamentos
 */

export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'pix';

export type PaymentStatus = 
  | 'pending' 
  | 'approved' 
  | 'in_process' 
  | 'rejected' 
  | 'cancelled' 
  | 'refunded';

export type CardBrand = 
  | 'visa' 
  | 'mastercard' 
  | 'amex' 
  | 'elo' 
  | 'hipercard';

export interface PaymentData {
  id: string;
  rideId: string;
  userId: string;
  driverId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  commission: number;
  driverAmount: number;
  companyAmount: number;
  metadata?: {
    cardLast4?: string;
    cardBrand?: CardBrand;
    pixKey?: string;
    pixQrCode?: string;
    transactionId?: string;
  };
}

export interface CardData {
  number: string;
  holderName: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
  cpf: string;
}

export interface PixPaymentResponse {
  id: string;
  status: PaymentStatus;
  qrCode: string;
  qrCodeBase64: string;
  pixKey: string;
  expiresAt: Date;
}

export interface CardPaymentResponse {
  id: string;
  status: PaymentStatus;
  transactionId: string;
  last4: string;
  brand: CardBrand;
}

export interface PaymentLog {
  id: string;
  timestamp: Date;
  action: string;
  userId: string;
  paymentId?: string;
  amount?: number;
  method?: PaymentMethod;
  status?: PaymentStatus;
  details: any;
  ipAddress?: string;
}

export interface Commission {
  totalAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  driverAmount: number;
}




