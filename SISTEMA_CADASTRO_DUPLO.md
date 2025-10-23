# 👥 Sistema de Cadastro Duplo - Cliente & Motorista

## 🎯 Funcionalidade Implementada

O usuário pode ter **DOIS cadastros simultâneos**:
- 👤 **Cliente** (para pedir corridas)
- 🚗 **Motorista** (para fazer corridas)

---

## 🎨 Como Funciona Visualmente

### Cenário 1: Usuário Só Tem Cadastro de Cliente

```
┌──────────────────────────────────┐
│          👤                      │
│     João da Silva                │
│                                  │
│ [Cliente]    [Motorista]         │
│  ━━━━━━      ┈┈┈┈┈┈┈┈┈          │
│  (ativo)     (Cadastrar)         │
│               ↑                  │
│        borda tracejada           │
└──────────────────────────────────┘
```

**O que acontece ao clicar em "Motorista":**
1. Abre alert: "Você ainda não tem cadastro como motorista"
2. Opções: Cancelar | Cadastrar
3. Se clicar "Cadastrar" → Escolhe tipo de veículo
4. Preenche formulário
5. ✅ Agora tem os 2 cadastros!

---

### Cenário 2: Usuário Só Tem Cadastro de Motorista

```
┌──────────────────────────────────┐
│          👤                      │
│     Maria Santos                 │
│                                  │
│ [Cliente]    [Motorista]         │
│  ┈┈┈┈┈┈┈       ━━━━━━           │
│ (Cadastrar)    (ativo)           │
└──────────────────────────────────┘
```

**O que acontece ao clicar em "Cliente":**
1. Abre alert: "Você ainda não tem cadastro como cliente"
2. Opções: Cancelar | Cadastrar
3. Se clicar "Cadastrar" → Preenche formulário de cliente
4. ✅ Agora tem os 2 cadastros!

---

### Cenário 3: Usuário Tem AMBOS os Cadastros

```
┌──────────────────────────────────┐
│          👤                      │
│     Carlos Oliveira              │
│                                  │
│ [Cliente]    [Motorista]         │
│  ━━━━━━      ━━━━━━             │
│  (ativo)                         │
│                                  │
│  ✅ Ambos habilitados            │
└──────────────────────────────────┘
```

**O que acontece:**
- Pode clicar livremente entre Cliente e Motorista
- Não aparece "Cadastrar"
- Apenas alterna a visualização
- Estatísticas mudam conforme o tipo

---

## 🚗 Fluxo de Cadastro de Motorista

### Passo 1: Confirmação
```
┌──────────────────────────────────────┐
│  Cadastro como Motorista             │
├──────────────────────────────────────┤
│  Você ainda não tem cadastro como    │
│  motorista. Deseja se cadastrar?     │
│                                      │
│  [Cancelar]        [Cadastrar]       │
└──────────────────────────────────────┘
```

### Passo 2: Tipo de Veículo
```
┌──────────────────────────────────────┐
│  Tipo de Veículo                     │
├──────────────────────────────────────┤
│  Selecione o tipo de veículo que     │
│  você opera:                         │
│                                      │
│  [Carro 🚗]                          │
│  [Moto/Mototáxi 🏍️]                 │
│  [Bicicleta 🚴]                      │
│  [Cancelar]                          │
└──────────────────────────────────────┘
```

### Passo 3: Documentos Necessários
```
┌──────────────────────────────────────┐
│  Cadastro de Motorista               │
├──────────────────────────────────────┤
│  Tipo de veículo: Carro              │
│                                      │
│  Documentos necessários:             │
│                                      │
│  • CNH válida                        │
│  • Documento do veículo              │
│  • Foto do veículo                   │
│  • Comprovante de residência         │
│                                      │
│  Você será redirecionado para        │
│  preencher o formulário completo.    │
│                                      │
│  [Cancelar]        [Continuar]       │
└──────────────────────────────────────┘
```

### Passo 4: Confirmação
```
┌──────────────────────────────────────┐
│  Cadastro Realizado!                 │
├──────────────────────────────────────┤
│  Seu cadastro como motorista foi     │
│  concluído com sucesso! Aguarde a    │
│  análise dos documentos.             │
│                                      │
│  [OK]                                │
└──────────────────────────────────────┘
```

---

## 👤 Fluxo de Cadastro de Cliente

### Passo 1: Confirmação
```
┌──────────────────────────────────────┐
│  Cadastro como Cliente               │
├──────────────────────────────────────┤
│  Você ainda não tem cadastro como    │
│  cliente. Deseja se cadastrar?       │
│                                      │
│  [Cancelar]        [Cadastrar]       │
└──────────────────────────────────────┘
```

### Passo 2: Informações
```
┌──────────────────────────────────────┐
│  Cadastro de Cliente                 │
├──────────────────────────────────────┤
│  Complete seu cadastro como cliente: │
│                                      │
│  • Confirme seus dados pessoais      │
│  • Adicione forma de pagamento       │
│  • Configure preferências            │
│                                      │
│  Você será redirecionado para o      │
│  formulário.                         │
│                                      │
│  [Cancelar]        [Continuar]       │
└──────────────────────────────────────┘
```

### Passo 3: Confirmação
```
┌──────────────────────────────────────┐
│  Cadastro Realizado!                 │
├──────────────────────────────────────┤
│  Seu cadastro como cliente foi       │
│  concluído com sucesso!              │
│                                      │
│  [OK]                                │
└──────────────────────────────────────┘
```

---

## 🎯 Lógica de Controle

### Estado dos Cadastros

```typescript
interface UserRegistrations {
  hasClienteRegistration: boolean;
  hasMotoristaRegistration: boolean;
}

// Exemplo: Só tem cadastro de cliente
{
  hasClienteRegistration: true,
  hasMotoristaRegistration: false
}

// Exemplo: Tem ambos os cadastros
{
  hasClienteRegistration: true,
  hasMotoristaRegistration: true
}
```

### Validação ao Clicar

```typescript
const handleUserTypeChange = (type: UserType) => {
  if (type === 'motorista' && !hasMotoristaRegistration) {
    // Mostrar formulário de cadastro de motorista
    showMotoristaRegistrationForm();
  } 
  else if (type === 'cliente' && !hasClienteRegistration) {
    // Mostrar formulário de cadastro de cliente
    showClienteRegistrationForm();
  } 
  else {
    // Tem cadastro, apenas muda visualização
    setUserType(type);
  }
};
```

---

## 🎨 Indicadores Visuais

### Botão COM Cadastro
```
┌──────────────┐
│   Cliente    │  ← Texto normal
│              │  ← Sem badge
│   (sólido)   │  ← Borda sólida
└──────────────┘
```

### Botão SEM Cadastro
```
┌┈┈┈┈┈┈┈┈┈┈┈┈┈┈┐
│   Motorista  │  ← Texto menor
│  Cadastrar   │  ← Badge "Cadastrar"
│  (tracejado) │  ← Borda tracejada
└┈┈┈┈┈┈┈┈┈┈┈┈┈┈┘
```

### Botão ATIVO (Com Cadastro)
```
┌──────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓ │  ← Fundo branco
│   Cliente    │  ← Texto amarelo
│              │  ← Destaque
└──────────────┘
```

---

## 📊 Tipos de Veículo para Motorista

| Opção | Ícone | Documentos Extras |
|-------|-------|-------------------|
| Carro | 🚗 | Documento do veículo, IPVA |
| Moto/Mototáxi | 🏍️ | CNH categoria A, Doc. moto |
| Bicicleta | 🚴 | Sem documentos extras |

---

## 🔄 Cenários de Uso

### Caso 1: Motorista que quer pedir corridas
```
1. Usuário é motorista há meses
2. Um dia precisa ir ao hospital
3. Decide pedir uma corrida
4. Vai ao perfil
5. Clica em "Cliente" (tracejado)
6. Aparece: "Cadastrar como cliente?"
7. Confirma e preenche dados
8. ✅ Agora pode:
   - Fazer corridas (como motorista)
   - Pedir corridas (como cliente)
```

### Caso 2: Cliente que quer ser motorista
```
1. Usuário sempre pede corridas
2. Decide trabalhar como motorista
3. Vai ao perfil
4. Clica em "Motorista" (tracejado)
5. Aparece: "Cadastrar como motorista?"
6. Escolhe tipo: Moto 🏍️
7. Envia documentos
8. Aguarda aprovação
9. ✅ Aprovado! Agora pode:
   - Pedir corridas (como cliente)
   - Fazer corridas (como motorista)
```

### Caso 3: Já tem os dois desde o início
```
1. Usuário se cadastrou completo
2. Tem Cliente ✅ e Motorista ✅
3. Vai ao perfil
4. Vê ambos os botões sólidos
5. Alterna livremente entre os dois
6. Estatísticas mudam conforme seleção
```

---

## 📱 Interface Completa

```
┌─────────────────────────────────────────┐
│ 🟡 HEADER 🟡                           │
│                                         │
│           👤                            │
│      João da Silva                      │
│                                         │
│  [Cliente]      [Motorista]             │
│   ━━━━━━         ┈┈┈┈┈┈┈┈              │
│   (ativo)        (Cadastrar)            │
└─────────────────────────────────────────┘
│                                         │
│ Informações Pessoais                    │
│ [Dados do usuário]                      │
│                                         │
│ Ações Rápidas                           │
│ [Opções clicáveis]                      │
│                                         │
│ Estatísticas                            │
│ [Muda conforme Cliente/Motorista]       │
└─────────────────────────────────────────┘

Ao clicar em "Motorista":
↓
┌─────────────────────────────────────────┐
│  Cadastro como Motorista                │
├─────────────────────────────────────────┤
│  Você ainda não tem cadastro como       │
│  motorista. Deseja se cadastrar?        │
│                                         │
│  [Cancelar]           [Cadastrar]       │
└─────────────────────────────────────────┘
↓
┌─────────────────────────────────────────┐
│  Tipo de Veículo                        │
├─────────────────────────────────────────┤
│  [Carro 🚗]                             │
│  [Moto/Mototáxi 🏍️]                    │
│  [Bicicleta 🚴]                         │
│  [Cancelar]                             │
└─────────────────────────────────────────┘
↓
✅ Cadastro concluído!
```

---

## 🔧 Integração Futura

### Backend
```typescript
// API para verificar cadastros
GET /api/user/registrations
Response:
{
  hasClienteRegistration: true,
  hasMotoristaRegistration: false
}

// API para criar cadastro de motorista
POST /api/driver/register
Body:
{
  vehicleType: "carro",
  documents: {...}
}

// API para criar cadastro de cliente
POST /api/client/register
Body:
{
  paymentMethod: "pix",
  preferences: {...}
}
```

---

## ✅ Benefícios do Sistema

1. **Flexibilidade Total**
   - Usuário escolhe quando quer cada cadastro
   - Não força a ter os dois

2. **UX Intuitiva**
   - Borda tracejada indica "disponível para cadastro"
   - Badge "Cadastrar" deixa claro a ação

3. **Processo Simples**
   - Poucos cliques para cadastrar
   - Fluxo guiado passo a passo

4. **Dual Role**
   - Mesma conta, duas funções
   - Alterna facilmente entre perfis

5. **Economia para o Usuário**
   - Não precisa criar duas contas separadas
   - Mesmos dados, dois usos

---

## 📊 Estatísticas por Tipo

### Como Cliente (vê):
- Corridas realizadas como cliente
- Avaliação recebida dos motoristas
- Gasto no mês

### Como Motorista (vê):
- Corridas realizadas como motorista
- Avaliação recebida dos clientes
- Total ganho

**Nota:** Os dados são separados por tipo!

---

## 🎯 Casos de Teste

### Teste 1: Só Cliente
```
1. Abrir perfil
2. Ver "Cliente" sólido, "Motorista" tracejado
3. Clicar em "Motorista"
4. ✅ Ver alert de cadastro
```

### Teste 2: Cadastrar como Motorista
```
1. Clicar "Cadastrar"
2. Escolher "Moto 🏍️"
3. Ver documentos necessários
4. Clicar "Continuar"
5. ✅ Ver confirmação
6. ✅ Ambos os botões agora sólidos
```

### Teste 3: Alternar entre Tipos
```
1. Ter ambos os cadastros
2. Clicar em "Cliente"
3. ✅ Ver estatísticas de cliente
4. Clicar em "Motorista"
5. ✅ Ver estatísticas de motorista
6. ✅ Sem mostrar cadastro
```

---

## 🎊 Resultado Final

**Sistema permite:**
- ✅ Usuário ter 1 ou 2 cadastros
- ✅ Cadastro sob demanda
- ✅ Escolha de tipo de veículo
- ✅ Fluxo intuitivo
- ✅ Indicadores visuais claros
- ✅ Alternância fácil entre perfis

---

**Implementação completa! 🎉**

_XiquêGo - O app que move Xique-Xique! 🚗_




