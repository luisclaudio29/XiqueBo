/**
 * Serviço de Pagamentos - XiqueGO
 * Integração com Mercado Pago
 */

import axios from 'axios';
import { MERCADO_PAGO_CONFIG, MERCADO_PAGO_API, APP_CONFIG } from '../config/payment.config';
import type {
  PaymentData,
  CardData,
  PixPaymentResponse,
  CardPaymentResponse,
  Commission,
} from '../types/payment.types';
import { PaymentLogger } from './payment-logger.service';

export class PaymentService {
  private static instance: PaymentService;
  private logger = PaymentLogger.getInstance();

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  /**
   * Calcula comissão da empresa (2%)
   */
  calculateCommission(amount: number): Commission {
    const commissionPercentage = APP_CONFIG.commissionPercentage;
    const commissionAmount = (amount * commissionPercentage) / 100;
    const driverAmount = amount - commissionAmount;

    return {
      totalAmount: amount,
      commissionPercentage,
      commissionAmount,
      driverAmount,
    };
  }

  /**
   * Cria pagamento via PIX
   */
  async createPixPayment(
    amount: number,
    description: string,
    userId: string,
    rideId: string
  ): Promise<PixPaymentResponse> {
    try {
      this.logger.log('PIX_PAYMENT_INITIATED', userId, {
        amount,
        rideId,
      });

      const response = await axios.post(
        `${MERCADO_PAGO_API.baseUrl}${MERCADO_PAGO_API.endpoints.pixPayment}`,
        {
          transaction_amount: amount,
          description: `XiqueGO Pagamentos - ${description}`,
          payment_method_id: 'pix',
          payer: {
            email: 'bastosa549@gmail.com',
            first_name: 'XiqueGO',
            last_name: 'Pagamentos',
          },
          statement_descriptor: 'XiqueGO',
          external_reference: rideId,
        },
        {
          headers: {
            'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const pixData: PixPaymentResponse = {
        id: response.data.id,
        status: response.data.status,
        qrCode: response.data.point_of_interaction.transaction_data.qr_code,
        qrCodeBase64: response.data.point_of_interaction.transaction_data.qr_code_base64,
        pixKey: response.data.point_of_interaction.transaction_data.qr_code,
        expiresAt: new Date(response.data.date_of_expiration),
      };

      this.logger.log('PIX_PAYMENT_CREATED', userId, {
        paymentId: pixData.id,
        amount,
      });

      return pixData;
    } catch (error: any) {
      this.logger.error('PIX_PAYMENT_ERROR', userId, error);
      throw new Error(`Erro ao criar pagamento PIX: ${error.message}`);
    }
  }

  /**
   * Cria token de cartão (primeiro passo para pagamento com cartão)
   */
  async createCardToken(cardData: CardData): Promise<string> {
    try {
      const response = await axios.post(
        `${MERCADO_PAGO_API.baseUrl}${MERCADO_PAGO_API.endpoints.cardToken}`,
        {
          card_number: cardData.number.replace(/\s/g, ''),
          cardholder: {
            name: cardData.holderName,
            identification: {
              type: 'CPF',
              number: cardData.cpf.replace(/\D/g, ''),
            },
          },
          security_code: cardData.cvv,
          expiration_month: cardData.expirationMonth,
          expiration_year: cardData.expirationYear,
        },
        {
          headers: {
            'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.publicKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.id;
    } catch (error: any) {
      this.logger.error('CARD_TOKEN_ERROR', 'system', error);
      throw new Error(`Erro ao criar token de cartão: ${error.message}`);
    }
  }

  /**
   * Processa pagamento com cartão
   */
  async processCardPayment(
    cardToken: string,
    amount: number,
    description: string,
    userId: string,
    rideId: string,
    installments: number = 1
  ): Promise<CardPaymentResponse> {
    try {
      this.logger.log('CARD_PAYMENT_INITIATED', userId, {
        amount,
        rideId,
        installments,
      });

      const response = await axios.post(
        `${MERCADO_PAGO_API.baseUrl}${MERCADO_PAGO_API.endpoints.payment}`,
        {
          transaction_amount: amount,
          token: cardToken,
          description: `XiqueGO Pagamentos - ${description}`,
          installments,
          payment_method_id: 'visa', // Será detectado automaticamente
          payer: {
            email: 'bastosa549@gmail.com',
            first_name: 'XiqueGO',
            last_name: 'Pagamentos',
          },
          statement_descriptor: 'XiqueGO',
          external_reference: rideId,
        },
        {
          headers: {
            'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const cardPayment: CardPaymentResponse = {
        id: response.data.id,
        status: response.data.status,
        transactionId: response.data.id,
        last4: response.data.card?.last_four_digits || '****',
        brand: response.data.payment_method_id,
      };

      this.logger.log('CARD_PAYMENT_PROCESSED', userId, {
        paymentId: cardPayment.id,
        status: cardPayment.status,
        amount,
      });

      return cardPayment;
    } catch (error: any) {
      this.logger.error('CARD_PAYMENT_ERROR', userId, error);
      throw new Error(`Erro ao processar pagamento: ${error.message}`);
    }
  }

  /**
   * Confirma pagamento em dinheiro
   */
  async confirmCashPayment(
    amount: number,
    userId: string,
    driverId: string,
    rideId: string
  ): Promise<PaymentData> {
    try {
      this.logger.log('CASH_PAYMENT_CONFIRMED', driverId, {
        amount,
        userId,
        rideId,
      });

      const commission = this.calculateCommission(amount);

      const paymentData: PaymentData = {
        id: `cash_${Date.now()}`,
        rideId,
        userId,
        driverId,
        amount,
        method: 'cash',
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date(),
        commission: commission.commissionAmount,
        driverAmount: commission.driverAmount,
        companyAmount: commission.commissionAmount,
      };

      // Aqui você salvaria no backend
      // await this.savePaymentToDatabase(paymentData);

      return paymentData;
    } catch (error: any) {
      this.logger.error('CASH_PAYMENT_ERROR', driverId, error);
      throw new Error(`Erro ao confirmar pagamento em dinheiro: ${error.message}`);
    }
  }

  /**
   * Verifica status de pagamento
   */
  async checkPaymentStatus(paymentId: string): Promise<string> {
    try {
      const response = await axios.get(
        `${MERCADO_PAGO_API.baseUrl}${MERCADO_PAGO_API.endpoints.payment}/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.accessToken}`,
          },
        }
      );

      return response.data.status;
    } catch (error: any) {
      this.logger.error('PAYMENT_STATUS_CHECK_ERROR', 'system', error);
      throw new Error(`Erro ao verificar status: ${error.message}`);
    }
  }

  /**
   * Cancela pagamento
   */
  async cancelPayment(paymentId: string, userId: string): Promise<void> {
    try {
      await axios.put(
        `${MERCADO_PAGO_API.baseUrl}${MERCADO_PAGO_API.endpoints.payment}/${paymentId}`,
        {
          status: 'cancelled',
        },
        {
          headers: {
            'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.accessToken}`,
          },
        }
      );

      this.logger.log('PAYMENT_CANCELLED', userId, { paymentId });
    } catch (error: any) {
      this.logger.error('PAYMENT_CANCEL_ERROR', userId, error);
      throw new Error(`Erro ao cancelar pagamento: ${error.message}`);
    }
  }

  /**
   * Valida se cartão é vale-refeição/alimentação
   */
  isBlockedCardType(cardNumber: string): boolean {
    // BINs de cartões de benefício (exemplo)
    const blockedBins = [
      '506699', // Alelo
      '637036', // Ben
      '650485', // VR
      '603788', // Sodexo
      '637568', // Ticket
    ];

    const bin = cardNumber.substring(0, 6);
    return blockedBins.includes(bin);
  }
}

