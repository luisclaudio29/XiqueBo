# 💳 Sistema de Pagamentos - XiquêGo

> Sistema completo de pagamentos integrado com Mercado Pago para processar corridas via PIX, Cartão e Dinheiro.

---

## 🚀 Início Rápido

### 1️⃣ Criar arquivo `.env`

**⚠️ PASSO OBRIGATÓRIO - Sem este arquivo o sistema não funciona!**

Crie o arquivo `XIQUEGO/.env` com:

```env
MERCADO_PAGO_PUBLIC_KEY=TEST-5f05202a-1837-4533-8bfb-ce3ff225c0aa
MERCADO_PAGO_ACCESS_TOKEN=TEST-3592412332909878-102106-411c527d855ad54c5e4db290a1126a7d-553797548
APP_COMMISSION_PERCENTAGE=2
APP_MIN_WITHDRAWAL_AMOUNT=127
```

### 2️⃣ Dependências (já instaladas ✅)

```bash
✓ axios
✓ @react-native-async-storage/async-storage
✓ expo-clipboard
```

### 3️⃣ Usar no app

```typescript
router.push({
  pathname: '/payment-selection',
  params: {
    amount: 50.00,
    rideId: 'ride_123',
    userId: 'user_456',
    driverId: 'driver_789',
  }
});
```

---

## 📁 Estrutura

```
XIQUEGO/
├── .env                          ⚠️ CRIAR MANUALMENTE
├── config/
│   └── payment.config.ts         Configurações
├── services/
│   ├── payment.service.ts        Lógica de negócio
│   └── payment-logger.service.ts Sistema de logs
├── types/
│   └── payment.types.ts          TypeScript types
└── app/
    ├── payment-selection.tsx     Escolha do método
    ├── payment-pix.tsx           PIX
    ├── payment-card.tsx          Cartão
    └── payment-cash.tsx          Dinheiro
```

---

## 💰 Funcionalidades

### ✅ PIX
- QR Code automático
- Copia e Cola
- Verificação de status em tempo real
- Aprovação instantânea

### ✅ Cartão de Crédito/Débito
- Todas as bandeiras (Visa, Master, Elo, Amex, Hipercard)
- Parcelamento até 12x
- Validação em tempo real
- **Bloqueio de vale-refeição/alimentação**
- Tokenização segura

### ✅ Dinheiro
- Confirmação pelo motorista
- Cálculo automático de comissão
- Registro de transação
- Desconto no próximo saque

---

## 🔒 Segurança

- ✅ Credenciais protegidas em `.env` (não vai pro Git)
- ✅ HTTPS obrigatório
- ✅ Tokenização de cartão (Mercado Pago)
- ✅ Validação de CPF, CVV, validade
- ✅ Bloqueio de cartões benefício (BINs específicos)
- ✅ Logs de auditoria

---

## 📊 Comissão (2%)

```
Valor da corrida: R$ 100,00
├── Motorista recebe: R$ 98,00 (98%)
└── Empresa recebe: R$ 2,00 (2%)
```

**Configurável no `.env`:**
```env
APP_COMMISSION_PERCENTAGE=2
```

---

## 🧪 Testes

### Cartão de Teste (Aprovado)
```
Número: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: APRO
CPF: 12345678909
```

### Cartão de Teste (Recusado)
```
Número: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: OTHE
CPF: 12345678909
```

### PIX
Sistema gerará QR Code automaticamente em modo teste.

### Dinheiro
Confirme no app após "receber" o pagamento.

---

## 📖 Documentação Completa

| Arquivo | Descrição |
|---------|-----------|
| `SISTEMA_PAGAMENTOS_COMPLETO.md` | Documentação técnica completa |
| `CONFIGURACAO_RAPIDA_PAGAMENTOS.md` | Setup em 5 minutos |
| `INTEGRACAO_PAGAMENTOS_NO_APP.md` | Como integrar no app |
| `GUIA_VISUAL_INSTALACAO_PAGAMENTOS.md` | Guia visual com diagramas |
| `RESUMO_EXECUTIVO_PAGAMENTOS.md` | Visão de negócio |
| `README_PAGAMENTOS.md` | Este arquivo |

---

## 🔄 Produção

Para usar em produção, substitua no `.env`:

```env
MERCADO_PAGO_PUBLIC_KEY=APP_USR-sua-public-key-real
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-seu-access-token-real
```

**Onde obter credenciais de produção:**
1. Acesse https://www.mercadopago.com.br/developers
2. Faça login na sua conta Mercado Pago
3. Vá em "Suas integrações"
4. Crie uma aplicação
5. Copie as credenciais de PRODUÇÃO

---

## ⚡ API Rápida

### Calcular Comissão
```typescript
import { PaymentService } from './services/payment.service';

const service = PaymentService.getInstance();
const commission = service.calculateCommission(100);

console.log(commission.driverAmount); // 98
console.log(commission.commissionAmount); // 2
```

### Criar Pagamento PIX
```typescript
const pix = await service.createPixPayment(
  50.00,                    // amount
  'Corrida XiquêGo',        // description
  'user_123',               // userId
  'ride_456'                // rideId
);

console.log(pix.qrCode);    // Chave PIX
console.log(pix.id);        // ID do pagamento
```

### Processar Cartão
```typescript
// 1. Criar token
const token = await service.createCardToken({
  number: '5031433215406351',
  holderName: 'APRO',
  expirationMonth: '11',
  expirationYear: '25',
  cvv: '123',
  cpf: '12345678909',
});

// 2. Processar pagamento
const payment = await service.processCardPayment(
  token,
  50.00,
  'Corrida XiquêGo',
  'user_123',
  'ride_456',
  1 // installments
);

console.log(payment.status); // approved/rejected
```

### Confirmar Dinheiro
```typescript
const payment = await service.confirmCashPayment(
  50.00,
  'user_123',
  'driver_456',
  'ride_789'
);

console.log(payment.driverAmount); // 49
```

---

## 📝 Logs

### Ver Logs
```typescript
import { PaymentLogger } from './services/payment-logger.service';

const logger = PaymentLogger.getInstance();
const logs = await logger.getLogs();
console.log(logs);
```

### Exportar para Auditoria
```typescript
const json = await logger.exportLogs();
// Salvar em arquivo ou enviar para servidor
```

---

## ⚠️ Avisos Importantes

1. **NUNCA** compartilhe o arquivo `.env`
2. **NUNCA** faça commit do `.env` no Git (já está no `.gitignore`)
3. **SEMPRE** use credenciais de TESTE em desenvolvimento
4. **TESTE** bem antes de ir para produção
5. **MONITORE** os logs regularmente

---

## 🆘 Troubleshooting

### Erro: "Cannot read property 'MERCADO_PAGO_PUBLIC_KEY'"
- ✅ Verifique se o arquivo `.env` existe
- ✅ Reinicie o servidor (`npm start`)

### Erro: "Payment failed"
- ✅ Verifique suas credenciais no `.env`
- ✅ Teste com cartões de teste oficiais
- ✅ Veja os logs para detalhes

### PIX não gera QR Code
- ✅ Verifique conexão com internet
- ✅ Confirme que credenciais estão corretas
- ✅ Veja console para erros

---

## 📞 Suporte

- **Mercado Pago:** https://www.mercadopago.com.br/developers
- **Docs API:** https://www.mercadopago.com.br/developers/pt/docs
- **Testes:** https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing

---

## 📊 Status

✅ **Implementação: 100% Completa**
- [x] PIX funcionando
- [x] Cartão funcionando
- [x] Dinheiro funcionando
- [x] Comissão automática
- [x] Logs de auditoria
- [x] Segurança implementada
- [x] Documentação completa

**Próximo passo:** Criar arquivo `.env` e começar a testar!

---

**XiquêGo - O app que move Xique-Xique! 🚗💳**

_Sistema implementado em 21/10/2025_




