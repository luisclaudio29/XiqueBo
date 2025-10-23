# 🏢 Nome da Empresa em Pagamentos - XiqueGO

## ✅ Configuração Atualizada

### 📌 Nome Oficial para Pagamentos

**Nome:** `XiqueGO Pagamentos`
**Razão Social (CNPJ):** XiqueGO
**Sem acento:** Sempre use "XiqueGO" (não "XiquêGo")

---

## 🎯 Onde o Nome Aparece

### 1. 📱 Pagamento PIX

Quando o cliente paga via PIX, aparece:

```
Beneficiário: XiqueGO Pagamentos
Descrição: XiqueGO Pagamentos - Corrida ride_123
Email: bastosa549@gmail.com
```

**No extrato bancário do cliente:**
```
PIX ENVIADO
Destino: XiqueGO Pagamentos
Valor: R$ 50,00
```

**Na conta Nubank CNPJ (você recebe):**
```
PIX RECEBIDO
De: Cliente XYZ
Descrição: XiqueGO Pagamentos - Corrida ride_123
Valor: R$ 50,00
```

---

### 2. 💳 Pagamento com Cartão

**Na fatura do cartão do cliente:**
```
XiqueGO          R$ 50,00
Compra aprovada em 21/10/2025
```

**Statement Descriptor (máx 13 caracteres):**
```
XiqueGO
```

**Descrição completa:**
```
XiqueGO Pagamentos - Corrida ride_123
```

**No email de confirmação:**
```
Compra aprovada
XiqueGO Pagamentos
R$ 50,00
```

---

### 3. 💵 Pagamento em Dinheiro

**No app:**
```
Taxa XiqueGO (2%): R$ 1,00
```

**No histórico:**
```
Pagamento em dinheiro
Empresa: XiqueGO
Comissão: 2%
```

---

## 🔧 Configuração no Código

### Serviço de Pagamento (payment.service.ts)

```typescript
// PIX
{
  description: 'XiqueGO Pagamentos - Corrida ride_123',
  payer: {
    email: 'bastosa549@gmail.com',
    first_name: 'XiqueGO',
    last_name: 'Pagamentos',
  },
  statement_descriptor: 'XiqueGO',
}

// Cartão
{
  description: 'XiqueGO Pagamentos - Corrida ride_123',
  payer: {
    email: 'bastosa549@gmail.com',
    first_name: 'XiqueGO',
    last_name: 'Pagamentos',
  },
  statement_descriptor: 'XiqueGO',
}
```

### Telas do App

**Título principal:**
```
XiqueGO Pagamentos
```

**Descrições:**
```
Taxa XiqueGO (2%)
```

---

## 📊 Como Aparece para Cada Pessoa

### 👤 Para o Cliente (quem paga):

**PIX:**
```
┌─────────────────────────────────┐
│ Confirmar Pagamento             │
├─────────────────────────────────┤
│ Para: XiqueGO Pagamentos        │
│ Valor: R$ 50,00                 │
│ Descrição: Corrida ride_123     │
└─────────────────────────────────┘
```

**Cartão:**
```
Fatura do Cartão
─────────────────
21/10  XiqueGO        R$ 50,00
```

**Dinheiro:**
```
Pagamento em dinheiro
ao motorista
```

---

### 🚗 Para o Motorista (quem recebe):

**Extrato:**
```
Corrida finalizada
Cliente pagou: R$ 50,00
Você recebe: R$ 49,00
Taxa XiqueGO: R$ 1,00 (2%)
```

---

### 🏦 Para Você (Conta Nubank CNPJ):

**PIX Recebido:**
```
PIX RECEBIDO
De: João Silva
Descrição: XiqueGO Pagamentos - Corrida ride_123
Valor: R$ 50,00
Data: 21/10/2025 10:30
```

**Cartão (após processamento Mercado Pago):**
```
TRANSFERÊNCIA RECEBIDA
De: Mercado Pago
Referência: XiqueGO Pagamentos - Corrida ride_123
Valor: R$ 48,50
(R$ 50,00 - 2.99% taxa Mercado Pago)
Data: 21/10/2025
```

---

## 🔄 Fluxo Completo PIX

```
1. Cliente solicita corrida
   ↓
2. App gera QR Code PIX
   Beneficiário: XiqueGO Pagamentos
   Descrição: XiqueGO Pagamentos - Corrida ride_123
   ↓
3. Cliente paga no banco dele
   Extrato cliente: "PIX para XiqueGO Pagamentos"
   ↓
4. Nubank CNPJ recebe
   Extrato Nubank: "PIX de Cliente - XiqueGO Pagamentos - Corrida ride_123"
   ↓
5. Sistema confirma pagamento
   Cliente: ✅ Pago
   Motorista: R$ 49,00 disponível
   XiqueGO: R$ 1,00 comissão
```

---

## 🔄 Fluxo Completo Cartão

```
1. Cliente preenche dados do cartão
   ↓
2. Sistema processa via Mercado Pago
   Nome: XiqueGO Pagamentos
   Descrição: XiqueGO Pagamentos - Corrida ride_123
   ↓
3. Fatura do cliente
   "21/10  XiqueGO        R$ 50,00"
   ↓
4. Mercado Pago processa
   ↓
5. Nubank CNPJ recebe
   R$ 48,50 (R$ 50 - 2.99% MP)
   ↓
6. Sistema distribui
   Motorista: R$ 49,00
   XiqueGO: R$ 1,00 (2%)
```

---

## 📋 Campos Importantes

### Statement Descriptor

**O que é:**
Nome que aparece na fatura do cartão de crédito

**Limite:**
13 caracteres

**Configurado:**
```
XiqueGO
```

**Aparece como:**
```
21/10  XiqueGO        R$ 50,00
```

---

### Email de Contato

**Configurado:**
```
bastosa549@gmail.com
```

**Usado para:**
- Identificação no Mercado Pago
- Comunicação com clientes
- Recibos e comprovantes

---

### Nome Completo

**First Name:** `XiqueGO`
**Last Name:** `Pagamentos`

**Aparece como:**
```
XiqueGO Pagamentos
```

---

## 🎨 Branding nos Pagamentos

### Logo/Nome Visual

```
 __  ___                 ____  _____ 
 \ \/ (_) __ _ _   _  __/ ___||  _  |
  \  /| |/ _` | | | |/ _ \  | | | | |
  /  \| | (_| | |_| |  __/ |_| |_| |
 /_/\_\_|\__, |\__,_|\___\____\___/  
            |_|                       
```

### Cores

**Principal:** Verde (#4CAF50)
**Secundária:** Azul (#2196F3)
**Destaque:** Laranja (#FF9800)

---

## ✅ Checklist de Identidade

- [x] Nome sem acento: "XiqueGO"
- [x] Nome completo: "XiqueGO Pagamentos"
- [x] Statement descriptor: "XiqueGO"
- [x] Email: bastosa549@gmail.com
- [x] Descrição: "XiqueGO Pagamentos - Corrida X"
- [x] Payer name: "XiqueGO Pagamentos"

---

## 📱 Exemplo Real

### QR Code PIX Gerado

```json
{
  "transaction_amount": 50.00,
  "description": "XiqueGO Pagamentos - Corrida ride_123",
  "payment_method_id": "pix",
  "payer": {
    "email": "bastosa549@gmail.com",
    "first_name": "XiqueGO",
    "last_name": "Pagamentos"
  },
  "statement_descriptor": "XiqueGO"
}
```

### O Cliente Vê no App do Banco

```
┌─────────────────────────────────┐
│ Pagar com PIX                   │
├─────────────────────────────────┤
│ Destinatário:                   │
│ XiqueGO Pagamentos              │
│                                 │
│ Valor:                          │
│ R$ 50,00                        │
│                                 │
│ Descrição:                      │
│ XiqueGO Pagamentos - Corrida... │
│                                 │
│ [Confirmar Pagamento]           │
└─────────────────────────────────┘
```

---

## 🔒 Dados da Empresa

### Para Configurar no Mercado Pago

```
Razão Social: XiqueGO
Nome Fantasia: XiqueGO Pagamentos
CNPJ: [seu CNPJ]
Email: bastosa549@gmail.com
Telefone: [seu telefone]
Site: xiquego.app
```

---

## 🎯 Resumo

| Item | Valor |
|------|-------|
| **Nome da Empresa** | XiqueGO |
| **Nome Comercial** | XiqueGO Pagamentos |
| **Statement (Fatura)** | XiqueGO |
| **Email** | bastosa549@gmail.com |
| **Descrição PIX/Cartão** | XiqueGO Pagamentos - Corrida X |
| **Comissão** | 2% |
| **Conta Destino** | Nubank CNPJ |

---

**🎊 Identidade Visual Consistente em Todos os Pagamentos!**

_XiqueGO - O app que move Xique-Xique! 🚗💳_

