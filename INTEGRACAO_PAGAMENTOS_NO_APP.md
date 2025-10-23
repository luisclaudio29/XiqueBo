# 🔌 Como Integrar Pagamentos no Fluxo do App

## 📍 Pontos de Integração

### 1. Ao Finalizar Corrida (Página Inicial)

**Arquivo:** `app/(tabs)/index.tsx`

```typescript
// Adicione ao final do arquivo, antes de export default

import { useRouter } from 'expo-router';

// Dentro do componente
const router = useRouter();

const handleFinishRide = () => {
  // Dados da corrida
  const rideData = {
    amount: 50.00,           // Valor calculado da corrida
    rideId: 'ride_12345',    // ID da corrida
    userId: 'user_123',      // ID do cliente
    driverId: 'driver_456',  // ID do motorista
  };

  // Navega para seleção de pagamento
  router.push({
    pathname: '/payment-selection',
    params: rideData,
  });
};
```

**Adicione botão na interface:**

```typescript
<TouchableOpacity 
  style={styles.finishButton}
  onPress={handleFinishRide}
>
  <Text style={styles.finishButtonText}>
    Finalizar Corrida e Pagar
  </Text>
</TouchableOpacity>
```

---

### 2. No Modal de Confirmação de Corrida

**Arquivo:** `components/ride-confirmation-modal.tsx`

```typescript
import { useRouter } from 'expo-router';

export function RideConfirmationModal({ rideData, onClose }) {
  const router = useRouter();

  const handlePayment = () => {
    onClose(); // Fecha o modal
    
    // Vai para pagamento
    router.push({
      pathname: '/payment-selection',
      params: {
        amount: rideData.price,
        rideId: rideData.id,
        userId: rideData.userId,
        driverId: rideData.driverId,
      },
    });
  };

  return (
    <View>
      {/* ... conteúdo do modal ... */}
      
      <TouchableOpacity 
        style={styles.payButton}
        onPress={handlePayment}
      >
        <Text>Ir para Pagamento</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

### 3. Botão Direto no Perfil (Ações Rápidas)

**Arquivo:** `app/(tabs)/profile.tsx`

```typescript
// Adicione nas Ações Rápidas
<TouchableOpacity 
  style={styles.actionCard}
  onPress={() => router.push('/payment-selection?amount=0')}
>
  <Text style={styles.actionIcon}>💳</Text>
  <View style={styles.actionInfo}>
    <Text style={styles.actionTitle}>Testar Pagamentos</Text>
    <Text style={styles.actionSubtitle}>Ver métodos disponíveis</Text>
  </View>
  <Text style={styles.actionArrow}>›</Text>
</TouchableOpacity>
```

---

## 🔄 Fluxo Completo Integrado

```
┌──────────────────────────────────────┐
│ Página Inicial (index.tsx)          │
│                                      │
│ Cliente solicita corrida            │
│         ↓                            │
│ Motorista aceita                     │
│         ↓                            │
│ Corrida em andamento                 │
│         ↓                            │
│ [Finalizar Corrida]  ← BOTÃO AQUI   │
└──────────────────────────────────────┘
                ↓
┌──────────────────────────────────────┐
│ payment-selection.tsx                │
│                                      │
│ Valor: R$ 50,00                      │
│ Motorista recebe: R$ 49,00           │
│ Taxa (2%): R$ 1,00                   │
│                                      │
│ Escolha o método:                    │
│ [📱 PIX]                              │
│ [💳 Cartão]                           │
│ [💵 Dinheiro]                         │
└──────────────────────────────────────┘
                ↓
       ┌────────┴────────┐
       │                 │
       ↓                 ↓
┌──────────┐      ┌──────────┐
│ PIX      │      │ Cartão   │
│          │      │          │
│ QR Code  │      │ Form     │
│ Copiar   │      │ Validar  │
│ Verificar│      │ Pagar    │
└──────────┘      └──────────┘
       │                 │
       └────────┬────────┘
                ↓
┌──────────────────────────────────────┐
│ ✅ Pagamento Aprovado!               │
│                                      │
│ Corrida finalizada com sucesso       │
│                                      │
│ [Voltar ao Início]                   │
└──────────────────────────────────────┘
                ↓
┌──────────────────────────────────────┐
│ Página Inicial (index.tsx)           │
│                                      │
│ Pronto para nova corrida             │
└──────────────────────────────────────┘
```

---

## 💡 Exemplo Prático: Botão "Pagar Corrida"

### No arquivo `app/(tabs)/index.tsx`:

```typescript
// 1. Importar no topo
import { useRouter } from 'expo-router';

// 2. Dentro do componente
export default function HomeScreen() {
  const router = useRouter();
  const [currentRide, setCurrentRide] = useState(null);

  // 3. Função para ir ao pagamento
  const goToPayment = () => {
    if (!currentRide) {
      Alert.alert('Erro', 'Nenhuma corrida ativa');
      return;
    }

    router.push({
      pathname: '/payment-selection',
      params: {
        amount: currentRide.price,
        rideId: currentRide.id,
        userId: currentRide.userId,
        driverId: currentRide.driverId,
      },
    });
  };

  // 4. Renderizar botão
  return (
    <ScrollView>
      {/* ... seu conteúdo existente ... */}

      {currentRide && (
        <View style={styles.rideActive}>
          <Text style={styles.rideTitle}>Corrida em Andamento</Text>
          <Text style={styles.ridePrice}>
            Valor: R$ {currentRide.price.toFixed(2)}
          </Text>
          
          <TouchableOpacity 
            style={styles.finishButton}
            onPress={goToPayment}
          >
            <Text style={styles.finishButtonText}>
              Finalizar e Pagar
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

// 5. Estilos
const styles = StyleSheet.create({
  rideActive: {
    backgroundColor: '#4CAF50',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  rideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  ridePrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  finishButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
```

---

## 🔐 Usar o Serviço de Pagamento Diretamente

### Exemplo: Calcular comissão antes de mostrar

```typescript
import { PaymentService } from '../services/payment.service';

const paymentService = PaymentService.getInstance();

// Calcular valores
const rideAmount = 100;
const commission = paymentService.calculateCommission(rideAmount);

console.log('Total:', commission.totalAmount);           // 100
console.log('Motorista:', commission.driverAmount);      // 98
console.log('Empresa:', commission.commissionAmount);    // 2
console.log('Taxa:', commission.commissionPercentage);   // 2%
```

---

## 📊 Exemplo: Exibir Resumo antes do Pagamento

```typescript
const RideSummary = ({ rideData }) => {
  const paymentService = PaymentService.getInstance();
  const commission = paymentService.calculateCommission(rideData.price);

  return (
    <View style={styles.summary}>
      <Text style={styles.title}>Resumo da Corrida</Text>
      
      <View style={styles.row}>
        <Text>Origem:</Text>
        <Text>{rideData.origin}</Text>
      </View>
      
      <View style={styles.row}>
        <Text>Destino:</Text>
        <Text>{rideData.destination}</Text>
      </View>
      
      <View style={styles.separator} />
      
      <View style={styles.row}>
        <Text style={styles.bold}>Valor Total:</Text>
        <Text style={styles.bold}>
          R$ {commission.totalAmount.toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.small}>Motorista recebe:</Text>
        <Text style={styles.small}>
          R$ {commission.driverAmount.toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.small}>
          Taxa XiquêGo ({commission.commissionPercentage}%):
        </Text>
        <Text style={styles.small}>
          R$ {commission.commissionAmount.toFixed(2)}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.payButton}
        onPress={() => router.push({
          pathname: '/payment-selection',
          params: {
            amount: commission.totalAmount,
            rideId: rideData.id,
            userId: rideData.userId,
            driverId: rideData.driverId,
          }
        })}
      >
        <Text style={styles.payButtonText}>Ir para Pagamento</Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

## 🎯 Integração no Menu

**Arquivo:** `app/(tabs)/menu.tsx`

```typescript
// Adicione opção no menu
<TouchableOpacity 
  style={styles.menuCard} 
  onPress={() => router.push('/payment-selection?amount=0')}
>
  <Text style={styles.menuIcon}>💳</Text>
  <View style={styles.menuContent}>
    <Text style={styles.menuTitle}>Métodos de Pagamento</Text>
    <Text style={styles.menuSubtitle}>Ver opções disponíveis</Text>
  </View>
  <Text style={styles.menuArrow}>›</Text>
</TouchableOpacity>
```

---

## 📱 Receber Resultado do Pagamento

### Opção 1: Via parâmetros da URL

```typescript
// Após pagamento aprovado em payment-pix.tsx
router.push({
  pathname: '/(tabs)/',
  params: {
    paymentStatus: 'approved',
    paymentId: pixData.id,
    amount: amount,
  }
});

// Na página inicial, ler:
const params = useLocalSearchParams();

useEffect(() => {
  if (params.paymentStatus === 'approved') {
    Alert.alert('✅ Pagamento Aprovado!', 
      `Valor: R$ ${params.amount}`
    );
  }
}, [params]);
```

### Opção 2: Via Context/Estado Global

```typescript
// Criar PaymentContext.tsx
import { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export function PaymentProvider({ children }) {
  const [lastPayment, setLastPayment] = useState(null);

  return (
    <PaymentContext.Provider value={{ lastPayment, setLastPayment }}>
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayment = () => useContext(PaymentContext);

// Usar:
const { setLastPayment } = usePayment();
setLastPayment({ status: 'approved', amount: 100 });
```

---

## 🧪 Teste Rápido

### 1. Teste Manual via URL

Digite no navegador do app (em desenvolvimento):

```
exp://192.168.x.x:8081/--/payment-selection?amount=75.50&rideId=test_123
```

### 2. Teste via Botão de Debug

Adicione na Página Inicial:

```typescript
{__DEV__ && (
  <TouchableOpacity 
    style={{ backgroundColor: 'red', padding: 20, margin: 20 }}
    onPress={() => router.push('/payment-selection?amount=99.90')}
  >
    <Text style={{ color: 'white', fontWeight: 'bold' }}>
      [DEBUG] Testar Pagamento
    </Text>
  </TouchableOpacity>
)}
```

---

## ✅ Checklist de Integração

- [ ] Arquivo `.env` criado com credenciais
- [ ] Botão "Finalizar Corrida" adicionado
- [ ] Navegação para `/payment-selection` implementada
- [ ] Parâmetros `amount`, `rideId`, `userId`, `driverId` passados
- [ ] Teste PIX funcionando
- [ ] Teste Cartão funcionando
- [ ] Teste Dinheiro funcionando
- [ ] Retorno para página inicial após pagamento
- [ ] Exibição de confirmação de pagamento

---

## 🎉 Pronto!

Agora o sistema de pagamentos está totalmente integrado ao fluxo do app!

**XiquêGo - O app que move Xique-Xique! 🚗💳**




