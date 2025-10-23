/**
 * Serviço de Email - XiqueGO
 * Envio de recibos e notificações
 */

import type { PaymentData } from '../types/payment.types';
import type { RideData } from '../types/ride.types';
import { PaymentLogger } from './payment-logger.service';

export class EmailService {
  private static instance: EmailService;
  private logger = PaymentLogger.getInstance();

  private constructor() {}

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Envia recibo de pagamento por email
   */
  async sendPaymentReceipt(
    clientEmail: string,
    clientName: string,
    payment: PaymentData,
    ride: RideData
  ): Promise<boolean> {
    try {
      this.logger.log('EMAIL_RECEIPT_SENDING', payment.userId, {
        email: clientEmail,
        paymentId: payment.id,
        rideId: ride.id,
      });

      // HTML do recibo
      const receiptHTML = this.generateReceiptHTML(
        clientName,
        payment,
        ride
      );

      // Em produção, aqui você usaria um serviço como:
      // - SendGrid
      // - AWS SES
      // - Mailgun
      // - Resend
      // Por enquanto, vamos simular o envio

      // Exemplo com fetch (você precisará de um backend)
      /*
      const response = await fetch('https://api.xiquego.app/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: clientEmail,
          subject: `Recibo XiqueGO - Corrida #${ride.id}`,
          html: receiptHTML,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar email');
      }
      */

      // Simulação de envio bem-sucedido
      console.log('📧 EMAIL ENVIADO PARA:', clientEmail);
      console.log('📄 CONTEÚDO:', receiptHTML);

      this.logger.log('EMAIL_RECEIPT_SENT', payment.userId, {
        email: clientEmail,
        paymentId: payment.id,
      });

      return true;
    } catch (error: any) {
      this.logger.error('EMAIL_RECEIPT_ERROR', payment.userId, error);
      return false;
    }
  }

  /**
   * Gera HTML do recibo de pagamento
   */
  private generateReceiptHTML(
    clientName: string,
    payment: PaymentData,
    ride: RideData
  ): string {
    const date = new Date(payment.createdAt);
    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const paymentMethodLabel = {
      pix: 'PIX',
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      cash: 'Dinheiro',
    }[payment.method] || payment.method;

    // Link do formulário de satisfação
    const satisfactionFormUrl = `https://xiquego.app/feedback?ride=${ride.id}`;

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recibo XiqueGO</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #4CAF50;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #4CAF50;
      margin-bottom: 10px;
    }
    .subtitle {
      color: #666;
      font-size: 14px;
    }
    .greeting {
      font-size: 18px;
      color: #333;
      margin-bottom: 20px;
    }
    .message {
      background: #e8f5e9;
      border-left: 4px solid #4CAF50;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .section {
      margin: 25px 0;
    }
    .section-title {
      font-weight: bold;
      color: #4CAF50;
      font-size: 16px;
      margin-bottom: 15px;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 8px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .info-label {
      color: #666;
      font-size: 14px;
    }
    .info-value {
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }
    .total {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
    .total-label {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
    .total-value {
      font-size: 20px;
      font-weight: bold;
      color: #4CAF50;
    }
    .satisfaction {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 12px;
      text-align: center;
      margin: 30px 0;
    }
    .satisfaction h3 {
      margin: 0 0 15px 0;
      font-size: 20px;
    }
    .satisfaction p {
      margin: 0 0 20px 0;
      font-size: 14px;
      opacity: 0.95;
    }
    .btn {
      display: inline-block;
      background: white;
      color: #667eea;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 25px;
      font-weight: bold;
      font-size: 16px;
      transition: transform 0.2s;
    }
    .btn:hover {
      transform: scale(1.05);
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #999;
      font-size: 12px;
    }
    .footer a {
      color: #4CAF50;
      text-decoration: none;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      background: #4CAF50;
      color: white;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo">🚗 XiqueGO</div>
      <div class="subtitle">O app que move Xique-Xique</div>
    </div>

    <!-- Greeting -->
    <div class="greeting">
      Olá, <strong>${clientName}</strong>! 👋
    </div>

    <!-- Message -->
    <div class="message">
      <strong>✅ Pagamento confirmado com sucesso!</strong><br>
      Obrigado por usar o XiqueGO. Sua corrida foi finalizada e o pagamento foi processado.
    </div>

    <!-- Ride Details -->
    <div class="section">
      <div class="section-title">📍 Detalhes da Corrida</div>
      
      <div class="info-row">
        <span class="info-label">ID da Corrida:</span>
        <span class="info-value">#${ride.id}</span>
      </div>

      <div class="info-row">
        <span class="info-label">Data e Hora:</span>
        <span class="info-value">${formattedDate}</span>
      </div>

      <div class="info-row">
        <span class="info-label">Origem:</span>
        <span class="info-value">${ride.origin}</span>
      </div>

      <div class="info-row">
        <span class="info-label">Destino:</span>
        <span class="info-value">${ride.destination}</span>
      </div>

      <div class="info-row">
        <span class="info-label">Distância:</span>
        <span class="info-value">${ride.distance} km</span>
      </div>

      <div class="info-row">
        <span class="info-label">Motorista:</span>
        <span class="info-value">${ride.driverName}</span>
      </div>

      <div class="info-row">
        <span class="info-label">Veículo:</span>
        <span class="info-value">${ride.vehicleModel} - ${ride.vehiclePlate}</span>
      </div>
    </div>

    <!-- Payment Details -->
    <div class="section">
      <div class="section-title">💳 Detalhes do Pagamento</div>
      
      <div class="info-row">
        <span class="info-label">ID do Pagamento:</span>
        <span class="info-value">#${payment.id}</span>
      </div>

      <div class="info-row">
        <span class="info-label">Método:</span>
        <span class="info-value">${paymentMethodLabel}</span>
      </div>

      ${payment.metadata?.cardLast4 ? `
      <div class="info-row">
        <span class="info-label">Cartão:</span>
        <span class="info-value">**** **** **** ${payment.metadata.cardLast4}</span>
      </div>
      ` : ''}

      <div class="info-row">
        <span class="info-label">Status:</span>
        <span class="info-value">
          <span class="status-badge">✅ Pago</span>
        </span>
      </div>
    </div>

    <!-- Total -->
    <div class="total">
      <div class="total-row">
        <span class="total-label">Valor Total Pago:</span>
        <span class="total-value">R$ ${payment.amount.toFixed(2)}</span>
      </div>
    </div>

    <!-- Satisfaction Survey -->
    <div class="satisfaction">
      <h3>⭐ Como foi sua experiência?</h3>
      <p>Sua opinião é muito importante para nós!<br>
      Avalie sua corrida e ajude-nos a melhorar.</p>
      <a href="${satisfactionFormUrl}" class="btn">
        📝 Avaliar Agora
      </a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>
        Este é um recibo automático da sua corrida no XiqueGO.<br>
        Para suporte, entre em contato: <a href="mailto:bastosa549@gmail.com">bastosa549@gmail.com</a>
      </p>
      <p>
        <a href="https://xiquego.app">xiquego.app</a> | 
        <a href="https://xiquego.app/termos">Termos de Uso</a> | 
        <a href="https://xiquego.app/privacidade">Privacidade</a>
      </p>
      <p style="margin-top: 15px;">
        © ${new Date().getFullYear()} XiqueGO - Todos os direitos reservados
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Envia lembrete de avaliação
   */
  async sendRatingReminder(
    clientEmail: string,
    clientName: string,
    rideId: string
  ): Promise<boolean> {
    try {
      const reminderHTML = `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2>⭐ Lembrete: Avalie sua corrida!</h2>
          <p>Olá, ${clientName}!</p>
          <p>Notamos que você ainda não avaliou sua última corrida no XiqueGO.</p>
          <p>Sua opinião é muito importante para nós!</p>
          <a href="https://xiquego.app/feedback?ride=${rideId}" 
             style="display: inline-block; background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0;">
            Avaliar Agora
          </a>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            XiqueGO - O app que move Xique-Xique
          </p>
        </div>
      `;

      console.log('📧 LEMBRETE ENVIADO PARA:', clientEmail);
      return true;
    } catch (error) {
      return false;
    }
  }
}




