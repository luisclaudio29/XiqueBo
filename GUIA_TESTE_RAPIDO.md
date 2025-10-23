# 🧪 Guia de Teste Rápido - XIQUÊGO

## 🚀 Como Iniciar

```bash
cd "C:\ANDREIA BASTOS\APP XIQUE GO - MOVE XIQUE XIQUE\XIQUEGO"
npx expo start --clear
```

Depois escaneie o QR Code no Expo Go.

---

## 📝 Teste 1: Cadastro Completo

### ✅ Como Cliente:
1. Abra o app
2. Clique em "Cadastre-se"
3. Ou navegue direto: `/signup-complete`
4. Selecione **"Cliente"**
5. Preencha:
   - Nome: João Silva
   - CPF: 123.456.789-00 (máscara automática)
   - Telefone: (74) 98765-4321 (máscara automática)
   - E-mail: joao@email.com
   - Idade: 25
   - Gênero: Masculino
   - Rua: Av. Principal
   - Número: 123
   - Bairro: Centro
   - Senha: 123456
   - Confirmar: 123456
6. Clique em **"Criar Conta"**
7. ✅ Deve mostrar sucesso e redirecionar

### ✅ Como Motorista/Entregador:
1. Selecione **"Motorista/Entregador"**
2. Preencha dados pessoais (igual acima)
3. Selecione **"Tipo de Serviço"**: Corrida ou Entrega
4. Selecione **"Tipo de Veículo"**: Moto
5. Preencha:
   - Marca: Honda
   - Modelo: CG 160
   - Placa: ABC-1234
6. Clique em **"Adicionar Foto do Veículo"**
   - Selecione uma imagem
7. Clique em **"Adicionar Sua Foto"**
   - Selecione uma imagem
8. Clique em **"Criar Conta"**
9. ✅ Deve mostrar sucesso

### ✅ Validações que devem funcionar:
- ❌ CPF inválido → mostra erro
- ❌ Senha diferente → mostra erro
- ❌ Cliente com menos de 16 anos → mostra erro
- ❌ Motorista com menos de 18 anos → mostra erro
- ❌ Motorista sem fotos → mostra erro

---

## 🗺️ Teste 2: Solicitar Corrida

### Passo a Passo:
1. Navegue para: `/request-service`
2. Aguarde o mapa carregar (GPS ativo)
3. Selecione **"Corrida"**
4. Escolha o tipo:
   - **Moto** (R$ 2,50/km) → econômica
   - **Táxi/Carro** (R$ 3,00/km) → confortável
   - **Expresso** (R$ 4,50/km) → urgente

### Definir Origem:
- ✅ Já vem com "📍 Localização Atual"
- Ou digite um distrito
- Ou clique em um chip de sugestão

### Definir Destino:
1. Digite: "Marreca Velha"
2. Ou clique no chip: **Marreca Velha**
3. ✅ Ver marcador aparecer no mapa
4. ✅ Ver linha conectando origem e destino

### Ver Resumo:
```
┌──────────────────────┐
│ Distância: 12.5 km  │
│ Tempo: 19 min       │
│ Valor: R$ 31.25     │
└──────────────────────┘
```

5. Clique em **"Confirmar Pedido"**

---

## 📦 Teste 3: Solicitar Entrega

### Passo a Passo:
1. Navegue para: `/request-service`
2. Selecione **"Entrega"**
3. Escolha o tipo:
   - **Bicicleta** (R$ 2,00/km) → pequenas entregas
   - **Moto** (R$ 2,50/km) → entregas médias
   - **Carro** (R$ 3,50/km) → entregas grandes
   - **Rural** (R$ 5,00/km) → cargas e animais

4. Defina origem e destino (igual corrida)
5. ✅ Ver cálculo automático
6. Clique em **"Confirmar Pedido"**

---

## ✅ Teste 4: Confirmação de Pedido

### Na tela de confirmação:

1. ✅ Ver resumo completo:
   - Origem com marcador 🟡
   - Destino com marcador 🔴
   - Distância e tempo

2. **Escolher Pagamento:**
   - Clique em **PIX** → ícone de QR Code
   - Ou **Cartão** → ícone de cartão
   - Ou **Dinheiro** → ícone de dinheiro
   - ✅ Ver seleção mudar de cor

3. **Ver Resumo de Valores:**
   ```
   Valor da corrida:     R$ 31.25
   Taxa da plataforma:   - R$ 0.63  (2%)
   Ganho do motorista:   R$ 30.62
   ─────────────────────────────
   TOTAL A PAGAR:        R$ 31.25
   ```

4. Clique em **"Confirmar e Solicitar"**
5. ✅ Ver loading
6. ✅ Ver mensagem de sucesso
7. ✅ Redirecionar para home

---

## 🧪 Teste 5: Validações

### Testar Erros:

**Request Service:**
- ❌ Clicar confirmar sem selecionar serviço → erro
- ❌ Clicar confirmar sem selecionar tipo → erro
- ❌ Clicar confirmar sem destino → erro

**Confirm Service:**
- ❌ Clicar confirmar sem selecionar pagamento → erro

---

## 📱 Teste 6: Interface

### Verificar Visual:

1. **Botões:**
   - ✅ Texto "Motorista/Entregador" aparece completo
   - ✅ Centralizado e legível
   - ✅ Ícones claros

2. **Inputs:**
   - ✅ Máscaras funcionando (CPF, telefone)
   - ✅ Olhinhos nas senhas
   - ✅ Placeholders visíveis

3. **Mapa:**
   - ✅ Ocupa 40% da tela
   - ✅ Marcadores visíveis
   - ✅ Linha de rota aparece

4. **Cards:**
   - ✅ Sombras suaves
   - ✅ Bordas arredondadas
   - ✅ Espaçamento adequado

5. **Cores:**
   - ✅ Amarelo (#FFD700) nos destaques
   - ✅ Marrom (#8B4513) nos textos
   - ✅ Harmonia visual

---

## 🎯 Testes de Cálculo

### Verificar Preços:

**Corrida de Moto:**
- 10 km × R$ 2,50 = **R$ 25,00**
- 2 km × R$ 2,50 = **R$ 5,00** (mínimo)

**Corrida de Táxi:**
- 10 km × R$ 3,00 = **R$ 30,00**

**Corrida Expressa:**
- 10 km × R$ 4,50 = **R$ 45,00**

**Entrega Rural:**
- 20 km × R$ 5,00 = **R$ 100,00**

**Comissão:**
- R$ 100,00 × 2% = **R$ 2,00** (empresa)
- R$ 100,00 - R$ 2,00 = **R$ 98,00** (motorista)

---

## 📊 Checklist Completo

### Cadastro:
- [ ] Cliente cadastra com sucesso
- [ ] Motorista cadastra com sucesso
- [ ] Fotos são salvas
- [ ] Máscaras funcionam
- [ ] Validações funcionam

### Corrida:
- [ ] Mapa carrega
- [ ] GPS funciona
- [ ] Tipos de corrida aparecem
- [ ] Cálculo automático funciona
- [ ] Marcadores aparecem no mapa

### Entrega:
- [ ] Tipos de entrega aparecem
- [ ] Entrega rural disponível
- [ ] Cálculo correto

### Confirmação:
- [ ] Resumo aparece correto
- [ ] Formas de pagamento funcionam
- [ ] Cálculo de taxa correto
- [ ] Confirmação redireciona

### Visual:
- [ ] Botão Entregador legível
- [ ] Interface responsiva
- [ ] Cores harmoniosas
- [ ] Sem erros de layout

---

## 🐛 Problemas Comuns

### GPS não funciona:
- Verificar permissões do app
- Testar em dispositivo real
- Emulador pode não ter GPS

### Mapa não carrega:
- Verificar API Key do Google Maps
- Verificar conexão com internet
- Ver console para erros

### Fotos não fazem upload:
- Verificar permissões de galeria
- Testar em dispositivo real

---

## ✅ Teste Final

Execute todos os testes acima e marque no checklist.

**Tudo funcionando?** 🎉 Sistema está pronto!

---

**Tempo estimado de teste:** 15-20 minutos  
**Dispositivos recomendados:** Android ou iOS real (para GPS e fotos)  
**Status esperado:** ✅ Todas as funcionalidades operacionais

