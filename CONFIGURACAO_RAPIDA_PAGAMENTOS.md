# ⚡ Configuração Rápida - Sistema de Pagamentos

## 🚀 Começar em 5 Minutos

### ✅ PASSO 1: Criar arquivo .env

**⚠️ OBRIGATÓRIO!**

1. Abra a pasta `XIQUEGO`
2. Crie um arquivo chamado `.env` (com ponto no início)
3. Cole este conteúdo:

```env
MERCADO_PAGO_PUBLIC_KEY=TEST-5f05202a-1837-4533-8bfb-ce3ff225c0aa
MERCADO_PAGO_ACCESS_TOKEN=TEST-3592412332909878-102106-411c527d855ad54c5e4db290a1126a7d-553797548
APP_COMMISSION_PERCENTAGE=2
APP_MIN_WITHDRAWAL_AMOUNT=127
```

4. Salve o arquivo

---

### ✅ PASSO 2: Dependências já instaladas ✓

```
✓ axios
✓ @react-native-async-storage/async-storage
✓ expo-clipboard
```

---

### ✅ PASSO 3: Testar

#### Teste PIX:
```typescript
router.push({
  pathname: '/payment-selection',
  params: { amount: 50, rideId: 'test_123' }
});
```

#### Teste Cartão (use cartão de teste):
```
Número: 5031 4332 1540 6351
CVV: 123
Validade: 11/25
Nome: APRO
CPF: 12345678909
```

#### Teste Dinheiro:
Confirme no app após "receber" o pagamento.

---

## 📁 Arquivos Criados

```
config/
  └── payment.config.ts        # Configurações

services/
  ├── payment.service.ts       # Serviço principal
  └── payment-logger.service.ts # Logs

types/
  └── payment.types.ts         # Tipos TypeScript

app/
  ├── payment-selection.tsx    # Escolher método
  ├── payment-pix.tsx          # PIX
  ├── payment-card.tsx         # Cartão
  └── payment-cash.tsx         # Dinheiro
```

---

## 💰 Comissão (2%)

- R$ 100 → Motorista: R$ 98 | Empresa: R$ 2
- Automático em todos os métodos
- Configurável no `.env`

---

## 🔒 Segurança

✅ `.env` protegido (não vai pro Git)
✅ HTTPS obrigatório
✅ Bloqueio de vale-refeição
✅ Logs de auditoria

---

## 📖 Documentação Completa

Veja `SISTEMA_PAGAMENTOS_COMPLETO.md` para mais detalhes.

---

## ⚠️ Produção

Para usar em produção, substitua no `.env`:

```env
MERCADO_PAGO_PUBLIC_KEY=APP_USR-sua-chave-real
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-seu-token-real
```

---

**Pronto! Sistema de pagamentos funcionando! 🎉**




