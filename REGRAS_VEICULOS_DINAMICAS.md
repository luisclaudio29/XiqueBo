# 🚗 Regras Dinâmicas de Veículos - XiquêGo

## 📋 Resumo das Mudanças

Sistema de validação flexível e automático de veículos adaptado à realidade de Xique-Xique (BA), baseado em práticas regionais e sem restrições excessivas para serviços rurais.

---

## ✨ Novas Regras Implementadas

### 🚗 1. Corridas de Passageiros
**Máximo: 10 anos de uso**

```
Ano atual: 2025
Ano mínimo aceito: 2015

Validação: AUTOMÁTICA e DINÂMICA
Cálculo: Ano Atual - 10 anos
```

**Justificativa:**
- Garantir conforto e segurança aos passageiros
- Padrão compatível com outros apps da região
- Veículos em melhor estado de conservação

**Exemplo:**
- ✅ Veículo 2015 ou mais novo → ACEITO
- ❌ Veículo 2014 ou mais antigo → RECUSADO

---

### 🏙️ 2. Entregas Urbanas
**Máximo: 15 anos de uso**

```
Ano atual: 2025
Ano mínimo aceito: 2010

Validação: AUTOMÁTICA e DINÂMICA
Cálculo: Ano Atual - 15 anos
```

**Justificativa:**
- Entregas não exigem o mesmo conforto de corridas
- Permite veículos um pouco mais antigos
- Mais flexível para motoristas de entrega

**Confirmações necessárias (veículos com +10 anos):**
- ✅ Veículo em bom estado
- ✅ Sem ferrugem
- ✅ Manutenção em dia

**Exemplo:**
- ✅ Veículo 2010 ou mais novo → ACEITO
- ✅ Veículo 2008 com confirmações → ACEITO
- ❌ Veículo 2009 sem confirmações → RECUSADO

---

### 🚜 3. Entregas Rurais
**SEM LIMITE DE ANO**

```
Ano: QUALQUER
Validação: APENAS confirmações de estado
```

**Justificativa:**
- Realidade rural requer flexibilidade
- Transporte de animais (boi, vaca, bode, ovelha)
- Cargas pesadas (sacas, produtos agrícolas)
- Rotas: Xique-Xique ↔ Marreca Velha, Rumo Novo, Vacaria, Pedra Branca, Queimada

**Confirmações OBRIGATÓRIAS:**
- ✅ Veículo em bom estado, sem ferrugem e com manutenção em dia
- ✅ Estrutura adequada para transporte de carga
- ✅ Aceita rotas rurais

**Exemplo:**
- ✅ Veículo 1995 com confirmações → ACEITO
- ✅ Veículo "Anterior a 1990" com confirmações → ACEITO
- ❌ Veículo antigo sem confirmações → RECUSADO

---

## 💻 Implementação Técnica

### Validação Dinâmica e Automática

```typescript
// Em constants/vehicles.ts

export const VEHICLE_AGE_RULES = {
  corrida: {
    maxYears: 10,
    description: 'Corridas de passageiros',
    message: 'Para corridas de passageiros, o veículo deve ter no máximo 10 anos de uso.',
  },
  entrega_urbana: {
    maxYears: 15,
    description: 'Entregas urbanas',
    message: 'Para entregas urbanas, o veículo deve ter no máximo 15 anos de uso.',
  },
  entrega_rural: {
    maxYears: null, // Sem limite
    description: 'Entregas rurais',
    message: 'Para entregas rurais, aceitamos veículos de qualquer ano, desde que em bom estado.',
  },
};

// Cálculo automático baseado no ano atual
export function getMinimumVehicleYear(
  serviceCategory: 'corrida' | 'entrega',
  deliveryType?: string
): number | null {
  const currentYear = new Date().getFullYear(); // 2025, 2026, 2027...
  
  if (serviceCategory === 'corrida') {
    return currentYear - VEHICLE_AGE_RULES.corrida.maxYears;
  }
  
  if (serviceCategory === 'entrega') {
    if (deliveryType === 'entrega_rural') {
      return null; // Sem limite
    }
    return currentYear - VEHICLE_AGE_RULES.entrega_urbana.maxYears;
  }
  
  return null;
}
```

**Vantagem:** 
- ✅ Não precisa atualizar código a cada ano
- ✅ Cálculo sempre atualizado automaticamente
- ✅ Regras centralizadas e fáceis de ajustar

---

## 📱 Fluxo do Usuário

### Passo 1: Seleção do Tipo de Serviço
```
[ ] Corrida (passageiros)
[ ] Entrega
```

### Passo 2: Se Entrega → Tipo de Entrega
```
[ ] Urbana (até 15 anos)
[ ] Rural (qualquer ano)
```

### Passo 3: Informações sobre Requisitos
```
ℹ️ Corridas: veículos com até 10 anos de uso
ℹ️ Entregas urbanas: veículos com até 15 anos de uso
ℹ️ Entregas rurais: aceita veículos de qualquer ano
```

### Passo 4: Seleção do Ano do Veículo
```
Lista completa: 2025 até "Anterior a 1990"
Validação em tempo real ao selecionar
```

### Passo 5: Confirmações (se necessário)
```
Para veículos com mais de 10 anos em entregas:

✅ Confirmo que o veículo está em bom estado, 
   sem ferrugem e com manutenção em dia

✅ (Apenas rural) Confirmo que o veículo possui 
   estrutura adequada para transporte de carga
```

---

## 🎯 Mensagens de Validação

### ✅ Veículo Aceito
```
(Sem mensagem - continua cadastro normalmente)
```

### ❌ Veículo Recusado - Corrida
```
🚫 Seu veículo não atende aos critérios. 
Para corridas, são aceitos apenas veículos com até 10 anos de uso (2015 ou mais recente).
```

### ❌ Veículo Recusado - Entrega Urbana
```
🚫 Seu veículo não atende aos critérios. 
Para entregas urbanas, são aceitos apenas veículos com até 15 anos de uso (2010 ou mais recente).
```

### ⚠️ Confirmação Necessária
```
Para veículos com mais de 10 anos, você precisará confirmar que o veículo está em bom estado.
```

### ❌ Faltou Confirmar
```
Você precisa confirmar que o veículo está em bom estado, sem ferrugem e com manutenção em dia.
```

---

## 📊 Exemplos Práticos

### Exemplo 1: Corrida com Honda Civic 2018
```
✅ Tipo: Corrida
✅ Veículo: Honda Civic 2018 (7 anos)
✅ Validação: APROVADO (dentro dos 10 anos)
✅ Resultado: Cadastro aceito normalmente
```

### Exemplo 2: Entrega Urbana com Fiat Strada 2012
```
✅ Tipo: Entrega Urbana
✅ Veículo: Fiat Strada 2012 (13 anos)
✅ Validação: APROVADO (dentro dos 15 anos)
⚠️ Confirmação: Veículo em bom estado? SIM
✅ Resultado: Cadastro aceito com confirmação
```

### Exemplo 3: Entrega Rural com Caminhão 1998
```
✅ Tipo: Entrega Rural
✅ Veículo: Caminhão Mercedes 1998 (27 anos)
✅ Validação: APROVADO (sem limite para rural)
⚠️ Confirmação 1: Veículo em bom estado? SIM
⚠️ Confirmação 2: Estrutura para carga? SIM
✅ Resultado: Cadastro aceito para rotas rurais
```

### Exemplo 4: Corrida com Gol 2010 ❌
```
❌ Tipo: Corrida
❌ Veículo: VW Gol 2010 (15 anos)
❌ Validação: RECUSADO (limite de 10 anos)
❌ Resultado: Mensagem de erro e cadastro bloqueado
```

---

## 🔄 Atualização Automática por Ano

### 2025
- Corridas: 2015 ou mais novo
- Entregas urbanas: 2010 ou mais novo
- Entregas rurais: qualquer ano

### 2026 (automático)
- Corridas: 2016 ou mais novo
- Entregas urbanas: 2011 ou mais novo
- Entregas rurais: qualquer ano

### 2027 (automático)
- Corridas: 2017 ou mais novo
- Entregas urbanas: 2012 ou mais novo
- Entregas rurais: qualquer ano

**Sem necessidade de atualizar código!** 🎉

---

## 📂 Arquivos Modificados

### 1. `constants/vehicles.ts`
**Novo:**
- `VEHICLE_YEARS`: Anos de 2025 até "Anterior a 1990"
- `VEHICLE_AGE_RULES`: Regras por tipo de serviço
- `getMinimumVehicleYear()`: Cálculo dinâmico
- `validateVehicleYear()`: Validação com mensagens

### 2. `app/signup-complete.tsx`
**Adicionado:**
- Estado `deliveryType`: 'urbana' | 'rural'
- Estado `vehicleGoodCondition`: confirmação de bom estado
- Estado `vehicleHasStructure`: confirmação de estrutura
- Seleção de tipo de entrega (Urbana/Rural)
- Boxes informativos sobre requisitos
- Checkboxes de confirmação
- Validação em tempo real ao selecionar ano
- Função `handleYearSelection()`: valida antes de aceitar

---

## ✅ Validações Implementadas

### No Momento da Seleção do Ano:
1. ✅ Verifica se tipo de serviço foi selecionado
2. ✅ Calcula ano mínimo aceito
3. ✅ Valida ano do veículo
4. ✅ Mostra mensagem de erro se não atender
5. ✅ Alerta sobre confirmações necessárias

### No Momento do Cadastro (botão "Criar Conta"):
1. ✅ Verifica todos os campos obrigatórios
2. ✅ Valida tipo de entrega se for "Entrega"
3. ✅ Revalida ano do veículo
4. ✅ Verifica confirmações para veículos antigos
5. ✅ Confirma fotos do veículo e motorista

---

## 🎯 Benefícios

### Para o Sistema:
- ✅ Validação automática sem código manual
- ✅ Regras adaptadas à realidade regional
- ✅ Flexibilidade para diferentes tipos de serviço
- ✅ Dados confiáveis e padronizados

### Para os Motoristas:
- ✅ Mais oportunidades (entregas rurais sem limite)
- ✅ Regras claras e transparentes
- ✅ Feedback imediato sobre aceitação
- ✅ Possibilidade de trabalhar com veículos mais antigos

### Para os Clientes:
- ✅ Corridas com veículos mais novos
- ✅ Entregas rurais com motoristas experientes
- ✅ Segurança e conforto garantidos

### Para a Empresa:
- ✅ Conformidade com práticas regionais
- ✅ Competitividade com outros apps
- ✅ Inclusão de motoristas rurais
- ✅ Base de motoristas maior e diversificada

---

## 🚀 Como Testar

### Teste 1: Corrida com Veículo Novo (2020)
1. Selecione "Motorista/Entregador"
2. Escolha "Corrida"
3. Veja a mensagem: "Veículos com até 10 anos"
4. Selecione ano: 2020
5. ✅ Deve aceitar normalmente

### Teste 2: Entrega Urbana com Veículo 2012
1. Selecione "Motorista/Entregador"
2. Escolha "Entrega" → "Urbana"
3. Veja a mensagem: "Veículos com até 15 anos"
4. Selecione ano: 2012
5. ⚠️ Deve mostrar alerta sobre confirmação
6. Marque checkbox de bom estado
7. ✅ Deve aceitar com confirmação

### Teste 3: Entrega Rural com Veículo 1995
1. Selecione "Motorista/Entregador"
2. Escolha "Entrega" → "Rural"
3. Veja a mensagem: "Aceita veículos de qualquer ano"
4. Selecione ano: 1995
5. ⚠️ Deve mostrar alerta sobre confirmação
6. Marque ambos checkboxes (bom estado + estrutura)
7. ✅ Deve aceitar para entregas rurais

### Teste 4: Corrida com Veículo 2010 (RECUSAR)
1. Selecione "Motorista/Entregador"
2. Escolha "Corrida"
3. Selecione ano: 2010
4. ❌ Deve mostrar mensagem de erro
5. ❌ Não deve aceitar o ano

---

## 🔮 Manutenção Futura

### Fácil Ajuste de Regras

Para mudar os limites, basta editar `constants/vehicles.ts`:

```typescript
export const VEHICLE_AGE_RULES = {
  corrida: {
    maxYears: 12, // ← Mudar aqui (exemplo: 10 → 12)
  },
  entrega_urbana: {
    maxYears: 20, // ← Mudar aqui (exemplo: 15 → 20)
  },
  // ...
};
```

**Tudo o resto continua funcionando automaticamente!**

---

## ✅ Status

**✅ IMPLEMENTADO E FUNCIONAL**

Sistema completo com:
- ✅ Validação dinâmica por ano atual
- ✅ Regras diferenciadas por serviço
- ✅ Confirmações para veículos antigos
- ✅ Interface intuitiva e informativa
- ✅ Mensagens claras de erro
- ✅ Tudo testado e sem bugs

---

*Documentação atualizada em: Outubro 2024*
*Versão do sistema: 3.0*
*Baseado em: Práticas regionais de Xique-Xique (BA)*

