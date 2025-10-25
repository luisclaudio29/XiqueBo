# 🗺️ COMO ATIVAR TODAS AS RUAS DE XIQUE-XIQUE NA BUSCA

## ✅ SISTEMA ATUAL

O XiqueGo já possui um **SISTEMA HÍBRIDO DE BUSCA**:

### 📍 **NÍVEL 1: Base Local (OFFLINE)**
- ✅ **200+ ruas cadastradas** manualmente
- ✅ Funciona **SEM INTERNET**
- ✅ Resposta **INSTANTÂNEA**
- ✅ Cobre principais locais de Xique-Xique

### 🌐 **NÍVEL 2: Google Places API (ONLINE)**
- ✅ Busca **TODAS AS RUAS** de Xique-Xique
- ✅ Raio de **50km** do centro
- ✅ Inclui **QUALQUER endereço** da região
- ✅ Combina com resultados locais

---

## 🔑 PASSO 1: CONFIGURAR GOOGLE MAPS API KEY

Para que **TODAS AS RUAS** apareçam, você precisa configurar a API Key do Google Maps.

### **Opção A: Se já tem a API Key**

1. **Abra o arquivo `.env`** na pasta `XIQUEGO/`
   ```
   XIQUEGO/
   ├── app/
   ├── components/
   ├── .env   👈 Este arquivo
   └── ...
   ```

2. **Adicione esta linha:**
   ```bash
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=SUA_CHAVE_AQUI
   ```

3. **Substitua** `SUA_CHAVE_AQUI` pela sua chave real

4. **Salve o arquivo**

5. **Reinicie o servidor Expo:**
   ```bash
   npx expo start --clear
   ```

---

### **Opção B: Se não tem a API Key (criar agora)**

#### **1. Acesse o Google Cloud Console:**
🌐 https://console.cloud.google.com/

#### **2. Crie um projeto:**
- Clique em "Selecionar projeto"
- Clique em "Novo projeto"
- Nome: `XiqueGo`
- Clique em "Criar"

#### **3. Ative as APIs necessárias:**

No menu, vá em **"APIs e Serviços"** → **"Biblioteca"**

Ative **TODAS** estas APIs (uma por vez):

- ✅ **Places API** (ESSENCIAL - para busca de ruas)
- ✅ **Maps SDK for Android**
- ✅ **Maps SDK for iOS**
- ✅ **Geocoding API** (recomendado)
- ✅ **Directions API** (recomendado)

#### **4. Crie a API Key:**

- Menu → "APIs e Serviços" → "Credenciais"
- Clique em **"Criar credenciais"**
- Selecione **"Chave de API"**
- **Copie a chave** gerada

#### **5. Configure restrições (IMPORTANTE!):**

##### Para **DESENVOLVIMENTO** (testar agora):
- Clique na chave criada
- Em **"Restrições de aplicativo"**: Selecione **"Nenhuma"**
- Em **"Restrições de API"**: 
  - Selecione **"Restringir chave"**
  - Marque **apenas** as APIs que ativou
- Clique em **"Salvar"**

##### Para **PRODUÇÃO** (depois):
- Configure restrições por app (package name/bundle ID)

#### **6. Adicione no projeto:**

Crie o arquivo `.env` na pasta `XIQUEGO/`:

```bash
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyB...SuaChaveAqui...
```

#### **7. Reinicie o Expo:**

```bash
npx expo start --clear
```

---

## ✅ PASSO 2: VERIFICAR SE ESTÁ FUNCIONANDO

### **1. Abra o app**

### **2. Toque em "Corrida"**

### **3. Selecione uma categoria (Moto/Carro)**

### **4. Na tela de Origem, comece a digitar:**

Digite qualquer rua, por exemplo:
- **"Rua"** → Deve aparecer uma lista de TODAS as ruas
- **"Av"** → Deve aparecer TODAS as avenidas
- **"Centro"** → Deve aparecer endereços do centro
- **"Barão"** → Deve aparecer "Rua Barão do Rio Branco"

### **5. Observe o status no topo:**

✅ **Se aparecer:**
```
🌐 TODAS AS RUAS - Google Places ativo
```
**✅ ESTÁ FUNCIONANDO!** Todas as ruas de Xique-Xique estão disponíveis!

⚠️ **Se aparecer:**
```
Google indisponível - Usando 200+ ruas locais
```
**⚠️ Verifique a API Key!** Apenas ruas cadastradas manualmente disponíveis.

---

## 🔍 COMO O SISTEMA FUNCIONA

### **Quando você digita um endereço:**

1. **Busca LOCAL (0-100ms):**
   - Busca instantânea nas 200+ ruas cadastradas
   - Funciona mesmo SEM INTERNET

2. **Busca GOOGLE (200-800ms):**
   - Busca em TODAS as ruas via Google Places API
   - Raio de 50km do centro de Xique-Xique
   - Tipos: `address`, `geocode`, `establishment`

3. **COMBINA RESULTADOS:**
   - Prioriza resultados locais (mais rápido)
   - Adiciona resultados do Google (mais completo)
   - Remove duplicatas
   - Mostra até **30 sugestões**

---

## 🎯 OTIMIZAÇÕES APLICADAS

### **O que foi melhorado para pegar TODAS as ruas:**

1. ✅ **Removida forçagem de "Xique-Xique BA"** na query
   - Antes: `input=Rua ABC Xique-Xique BA`
   - Agora: `input=Rua ABC`
   - Resultado: Google retorna MAIS resultados

2. ✅ **Location Bias inteligente**
   - Centro: `-10.8236,-42.7273`
   - Raio: `50.000 metros (50km)`
   - Resultado: Foca em Xique-Xique SEM limitar

3. ✅ **Tipos ampliados**
   - `address` → Endereços residenciais
   - `geocode` → Todas as localizações
   - `establishment` → Estabelecimentos comerciais
   - Resultado: Pega TODAS as ruas + comércios

4. ✅ **strictbounds=false**
   - Não restringe rigidamente aos limites
   - Permite resultados próximos
   - Resultado: Não perde ruas nas bordas

5. ✅ **Timeout aumentado para 8 segundos**
   - Mais tempo para busca completa
   - Resultado: Não corta busca no meio

6. ✅ **Até 30 resultados mostrados**
   - Antes: 20 resultados
   - Agora: 30 resultados
   - Resultado: Mais opções para o usuário

---

## 📊 EXEMPLOS DE BUSCA

### **Teste estas buscas para verificar:**

| Digite | Deve aparecer |
|--------|---------------|
| `Rua` | TODAS as ruas de Xique-Xique |
| `Av` | TODAS as avenidas |
| `Barão` | Rua Barão do Rio Branco |
| `Centro` | Todas as ruas do centro |
| `Marreca` | Marreca Velha + suas ruas |
| `Santo Inácio` | Santo Inácio + suas ruas |
| `Boa Vista` | Boa Vista + suas ruas |
| `Polivalente` | Bairro Polivalente + ruas |
| `Getúlio` | Av. Getúlio Vargas |
| `Hospital` | Hospital Municipal |

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### **❌ Problema: "Google indisponível"**

**Causa:** API Key não configurada ou inválida

**Solução:**
1. Verificar se o arquivo `.env` existe
2. Verificar se a chave está correta (sem espaços)
3. Verificar se a **Places API** está ativada no Google Cloud
4. Aguardar 5-10 minutos (propagação da chave)
5. Reiniciar: `npx expo start --clear`

---

### **❌ Problema: "REQUEST_DENIED"**

**Causa:** Places API não ativada ou chave restrita

**Solução:**
1. Acesse: https://console.cloud.google.com/
2. Vá em "APIs e Serviços" → "Biblioteca"
3. Procure por **"Places API"**
4. Clique em **"ATIVAR"**
5. Aguarde 5 minutos
6. Teste novamente

---

### **❌ Problema: Poucas ruas aparecem**

**Causa:** Google pode estar limitando por falta de detalhes

**Solução:**
1. Digite mais caracteres (mínimo 3 letras)
2. Seja mais específico: "Rua Barão" em vez de "Rua"
3. Verifique sua conexão com internet
4. Ruas locais sempre aparecem (200+)

---

### **❌ Problema: "OVER_QUERY_LIMIT"**

**Causa:** Excedeu limite gratuito do Google

**Solução:**
1. Google dá **$200/mês GRÁTIS** (suficiente para desenvolvimento)
2. Verifique uso em: https://console.cloud.google.com/billing
3. Configure alertas de cobrança
4. Em produção, otimize com debounce (já implementado)

---

## 💰 CUSTOS DO GOOGLE MAPS

### **Plano Gratuito:**

- ✅ **$200 USD de crédito por mês** (GRÁTIS)
- ✅ Places Autocomplete: **$2.83 por 1.000 requisições**
  - Com $200 grátis = ~**70.000 buscas/mês GRÁTIS**
- ✅ Places Details: **$17 por 1.000 requisições**
  - Com $200 grátis = ~**11.000 seleções/mês GRÁTIS**

### **Para um app pequeno:**

- ✅ **10 usuários fazendo 50 buscas/dia** = 15.000 buscas/mês
- ✅ **CUSTO: $0** (dentro do grátis)

### **Monitorar uso:**

1. Acesse: https://console.cloud.google.com/
2. Menu: **"Faturamento"** → **"Relatórios"**
3. Configure alertas para avisar se ultrapassar

---

## 🔒 SEGURANÇA

### **✅ SEMPRE:**

- ✅ Usar arquivo `.env` (não commitar no Git)
- ✅ Adicionar `.env` no `.gitignore`
- ✅ Restringir APIs usadas no Google Cloud
- ✅ Monitorar uso regularmente

### **❌ NUNCA:**

- ❌ Compartilhar API Key publicamente
- ❌ Commitar `.env` no Git
- ❌ Deixar sem restrições em produção

---

## 📱 TESTE FINAL

### **Passo a passo completo para testar:**

1. ✅ API Key configurada no `.env`
2. ✅ Servidor Expo reiniciado: `npx expo start --clear`
3. ✅ Abra o app
4. ✅ Toque em "Corrida"
5. ✅ Selecione categoria (Moto/Carro)
6. ✅ Na tela de Origem, digite "Rua"
7. ✅ Observe o status no topo:
   - 🌐 **"TODAS AS RUAS - Google Places ativo"** = ✅ FUNCIONANDO!
8. ✅ Digite mais: "Barão", "Centro", "Av"
9. ✅ Veja TODAS as ruas aparecendo!

---

## 🎉 RESULTADO ESPERADO

Quando tudo estiver configurado corretamente:

✅ **MODO ONLINE (com internet):**
- 🌐 Google Places API ativa
- 🗺️ **TODAS AS RUAS** de Xique-Xique aparecem
- 📍 Santo Inácio, Boa Vista, Itaparica, etc.
- 🏪 Estabelecimentos comerciais
- 🏠 Endereços residenciais
- **ILIMITADO** (dentro do raio de 50km)

✅ **MODO OFFLINE (sem internet):**
- 📍 200+ ruas principais cadastradas
- ⚡ Resposta instantânea
- 🔒 Sempre disponível
- 💪 Backup garantido

---

## 📞 PRECISA DE AJUDA?

Se tiver algum problema, verifique:

1. ✅ Arquivo `.env` criado na pasta correta?
2. ✅ API Key copiada corretamente (sem espaços)?
3. ✅ **Places API** ativada no Google Cloud?
4. ✅ Servidor Expo reiniciado com `--clear`?
5. ✅ Internet funcionando?

---

## 📚 DOCUMENTAÇÃO COMPLEMENTAR

Para mais detalhes, consulte:

- 📄 `CONFIGURAR_GOOGLE_MAPS_API.md` - Guia completo da API
- 📄 `COBERTURA_COMPLETA_XIQUEXIQUE.md` - Lista de todas as localidades
- 📄 `CONFIGURACAO_MAPA.md` - Configuração do mapa

---

**Data:** 25/10/2025  
**Status:** ✅ SISTEMA OTIMIZADO PARA TODAS AS RUAS

🗺️ **Xique-Xique - TODAS as ruas disponíveis!**

