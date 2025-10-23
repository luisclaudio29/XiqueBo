# 🧭 Navegação Rápida - XIQUÊGO

## 📱 Como Acessar Cada Tela

### Durante o Desenvolvimento (Expo Go):

#### **1. Cadastro Completo**
```typescript
// No navegador ou app
http://localhost:8081/signup-complete

// Ou no código
router.push('/signup-complete');
```

**O que testar:**
- [ ] Cadastro como Cliente
- [ ] Cadastro como Motorista/Entregador
- [ ] Upload de fotos
- [ ] Validações

---

#### **2. Solicitar Corrida/Entrega**
```typescript
// No navegador ou app
http://localhost:8081/request-service

// Ou no código
router.push('/request-service');
```

**O que testar:**
- [ ] Mapa carrega
- [ ] GPS funciona
- [ ] Escolher tipo de corrida
- [ ] Escolher tipo de entrega
- [ ] Calcular preço

---

#### **3. Confirmar Pedido**
```typescript
// No navegador ou app
http://localhost:8081/confirm-service

// Ou no código (com params)
router.push({
  pathname: '/confirm-service',
  params: {
    serviceType: 'corrida',
    rideType: 'moto',
    originAddress: 'Centro',
    destinationAddress: 'Marreca Velha',
    distance: '12.5',
    duration: '19',
    price: '31.25',
  },
});
```

**O que testar:**
- [ ] Resumo da rota
- [ ] Formas de pagamento
- [ ] Cálculo de taxas
- [ ] Confirmação

---

#### **4. Tela Inicial (Home)**
```typescript
// No navegador ou app
http://localhost:8081/(tabs)/

// Ou no código
router.push('/(tabs)');
```

---

#### **5. Login**
```typescript
// No navegador ou app
http://localhost:8081/login

// Ou no código
router.push('/login');
```

**Novidades:**
- ✅ Olhinho na senha
- ✅ Botão Gmail

---

#### **6. Esqueci Senha**
```typescript
// No navegador ou app
http://localhost:8081/forgot-password

// Ou no código
router.push('/forgot-password');
```

**Novidades:**
- ✅ Verificação biométrica (rosto/digital)

---

## 🔗 Integrando nas Telas Existentes

### Na Tela Inicial (Home):

```typescript
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push('/request-service')}
    >
      <Text>Solicitar Corrida/Entrega</Text>
    </TouchableOpacity>
  );
}
```

---

### No Menu:

```typescript
const menuItems = [
  {
    id: '1',
    title: 'Solicitar Corrida',
    icon: 'car',
    onPress: () => router.push('/request-service'),
  },
  {
    id: '2',
    title: 'Solicitar Entrega',
    icon: 'cube',
    onPress: () => router.push('/request-service'),
  },
];
```

---

### Em Cards:

```typescript
<TouchableOpacity
  style={styles.card}
  onPress={() => router.push('/request-service')}
>
  <Ionicons name="car" size={32} color="#FFD700" />
  <Text>Nova Corrida</Text>
</TouchableOpacity>
```

---

## 🚀 Fluxo Recomendado

### Para Novo Usuário:

```
1. /login
   ↓
   "Não tem conta?" → Clique
   ↓
2. /signup-complete
   ↓
   Preencher dados → Criar Conta
   ↓
3. /(tabs)/ (Home)
   ↓
   "Solicitar Corrida" → Clique
   ↓
4. /request-service
   ↓
   Escolher tipo → Definir rota → Confirmar
   ↓
5. /confirm-service
   ↓
   Escolher pagamento → Confirmar
   ↓
6. Aguardar motorista (volta para Home)
```

---

## 📲 Testando Navegação

### Método 1: Deep Link (Emulador/Dispositivo)

```bash
# Android
adb shell am start -a android.intent.action.VIEW \
  -d "exp://localhost:8081/--/request-service"

# iOS
xcrun simctl openurl booted \
  "exp://localhost:8081/--/request-service"
```

### Método 2: No Navegador

Abra no navegador durante desenvolvimento:
```
http://localhost:8081/request-service
```

### Método 3: No Código

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navegar
router.push('/request-service');

// Navegar com parâmetros
router.push({
  pathname: '/confirm-service',
  params: { price: '25.00' }
});

// Voltar
router.back();

// Substituir (não volta)
router.replace('/(tabs)');
```

---

## 🎯 Atalhos de Teclado (Desenvolvimento)

Durante o desenvolvimento com Expo:

- `R` - Reload
- `M` - Toggle menu
- `D` - Toggle DevTools
- `Shift + M` - Toggle performance monitor

---

## 🗂️ Estrutura de Rotas

```
app/
├── login.tsx                    → /login
├── signup.tsx                   → /signup (antigo)
├── signup-complete.tsx          → /signup-complete (novo)
├── forgot-password.tsx          → /forgot-password
├── request-service.tsx          → /request-service (novo)
├── confirm-service.tsx          → /confirm-service (novo)
│
├── (tabs)/
│   ├── index.tsx               → /(tabs)/
│   ├── activities.tsx          → /(tabs)/activities
│   ├── profile.tsx             → /(tabs)/profile
│   └── menu.tsx                → /(tabs)/menu
│
├── payment-selection.tsx        → /payment-selection
├── payment-pix.tsx             → /payment-pix
├── payment-card.tsx            → /payment-card
├── payment-cash.tsx            → /payment-cash
├── driver-payments.tsx         → /driver-payments
├── help-center.tsx             → /help-center
├── share-app.tsx               → /share-app
├── language.tsx                → /language
└── map-view.tsx                → /map-view
```

---

## 📝 Exemplos de Uso

### Exemplo 1: Botão na Home

```typescript
<TouchableOpacity
  style={{
    backgroundColor: '#FFD700',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  }}
  onPress={() => router.push('/request-service')}
>
  <Ionicons name="car" size={40} color="#8B4513" />
  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#8B4513', marginTop: 8 }}>
    Solicitar Corrida ou Entrega
  </Text>
</TouchableOpacity>
```

### Exemplo 2: Menu Lateral

```typescript
const menuOptions = [
  {
    section: 'Serviços',
    items: [
      {
        label: 'Nova Corrida',
        icon: 'car',
        route: '/request-service',
      },
      {
        label: 'Histórico',
        icon: 'time',
        route: '/(tabs)/activities',
      },
    ],
  },
  {
    section: 'Conta',
    items: [
      {
        label: 'Perfil',
        icon: 'person',
        route: '/(tabs)/profile',
      },
      {
        label: 'Pagamentos',
        icon: 'card',
        route: '/driver-payments',
      },
    ],
  },
];

// Renderizar
menuOptions.map((section) => (
  <View key={section.section}>
    <Text style={styles.sectionTitle}>{section.section}</Text>
    {section.items.map((item) => (
      <TouchableOpacity
        key={item.label}
        onPress={() => router.push(item.route)}
      >
        <Ionicons name={item.icon} size={24} />
        <Text>{item.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
));
```

### Exemplo 3: Cards Rápidos

```typescript
const quickActions = [
  {
    title: 'Corrida',
    icon: 'car',
    color: '#FFD700',
    route: '/request-service',
  },
  {
    title: 'Entrega',
    icon: 'cube',
    color: '#FF6347',
    route: '/request-service',
  },
  {
    title: 'Histórico',
    icon: 'time',
    color: '#4169E1',
    route: '/(tabs)/activities',
  },
  {
    title: 'Perfil',
    icon: 'person',
    color: '#32CD32',
    route: '/(tabs)/profile',
  },
];

<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
  {quickActions.map((action) => (
    <TouchableOpacity
      key={action.title}
      style={{
        flex: 1,
        minWidth: '45%',
        backgroundColor: action.color,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
      }}
      onPress={() => router.push(action.route)}
    >
      <Ionicons name={action.icon} size={32} color="#FFF" />
      <Text style={{ color: '#FFF', fontWeight: 'bold', marginTop: 8 }}>
        {action.title}
      </Text>
    </TouchableOpacity>
  ))}
</View>
```

---

## 🔍 Debug de Navegação

### Ver rota atual:

```typescript
import { usePathname } from 'expo-router';

export default function MyScreen() {
  const pathname = usePathname();
  
  console.log('Rota atual:', pathname);
  
  return <Text>Você está em: {pathname}</Text>;
}
```

### Ver parâmetros:

```typescript
import { useLocalSearchParams } from 'expo-router';

export default function MyScreen() {
  const params = useLocalSearchParams();
  
  console.log('Parâmetros:', params);
  
  return <Text>Price: {params.price}</Text>;
}
```

---

## ⚡ Tips & Tricks

### 1. Navegação com Animação

```typescript
router.push('/request-service');
// Animação padrão aplicada automaticamente
```

### 2. Passar Dados Complexos

```typescript
// Não recomendado para objetos grandes
router.push({
  pathname: '/confirm-service',
  params: {
    data: JSON.stringify({ price: 25, distance: 10 })
  }
});

// Na tela de destino
const { data } = useLocalSearchParams();
const parsed = JSON.parse(data);
```

### 3. Voltar Múltiplas Telas

```typescript
router.back(); // Volta 1 tela
router.dismiss(); // Fecha modal/stack
```

### 4. Resetar Navegação

```typescript
router.replace('/(tabs)'); // Substitui histórico
```

---

## 🎯 Checklist de Integração

Antes de lançar, verificar:

- [ ] Botão na Home leva para `/request-service`
- [ ] Menu tem opção de Nova Corrida
- [ ] Cadastro completo acessível em `/signup-complete`
- [ ] Fluxo completo funciona (Home → Request → Confirm → Success)
- [ ] Voltar funciona em todas as telas
- [ ] Parâmetros passados corretamente
- [ ] Deep links funcionam
- [ ] Navegação suave (sem travamentos)

---

## 🚀 Pronto!

Agora você sabe como navegar entre todas as telas do XIQUÊGO!

**Documentação relacionada:**
- `GUIA_TESTE_RAPIDO.md` - Como testar tudo
- `SISTEMA_COMPLETO_CORRIDAS_ENTREGAS.md` - Documentação técnica
- `RESUMO_FINAL_IMPLEMENTACOES.md` - Resumo geral

---

**Versão:** 1.0.0  
**Status:** ✅ Completo  
**Data:** Outubro 2025

