# 🗺️ COMO CONFIGURAR A CHAVE DO GOOGLE MAPS API

## ✅ PASSO A PASSO COMPLETO

---

## 🔑 1. OBTER A CHAVE DA API DO GOOGLE MAPS

### **Opção A: Se você JÁ TEM a chave**
- Pule para o **Passo 2** abaixo

### **Opção B: Se você AINDA NÃO TEM a chave**

1. **Acesse o Google Cloud Console:**
   - 🌐 https://console.cloud.google.com/

2. **Crie um projeto (se não tiver):**
   - Clique em "Selecionar projeto"
   - Clique em "Novo projeto"
   - Nome: `XiqueGo` (ou qualquer nome)
   - Clique em "Criar"

3. **Ative as APIs necessárias:**
   - Menu hamburger → "APIs e Serviços" → "Biblioteca"
   - Ative as seguintes APIs (uma por uma):
     - ✅ **Maps SDK for Android**
     - ✅ **Maps SDK for iOS**
     - ✅ **Maps JavaScript API**
     - ✅ **Places API**
     - ✅ **Geocoding API**
     - ✅ **Directions API**

4. **Crie a chave da API:**
   - Menu → "APIs e Serviços" → "Credenciais"
   - Clique em "Criar credenciais"
   - Selecione "Chave de API"
   - **Copie a chave gerada** (ex: `AIzaSyBCd123456789abcdefghijklmnopqr`)

5. **Configure restrições (IMPORTANTE!):**
   - Clique na chave criada
   - Em "Restrições de aplicativo":
     - **Para desenvolvimento**: Selecione "Nenhuma"
     - **Para produção**: Configure por aplicativo (iOS/Android)
   - Em "Restrições de API":
     - Selecione "Restringir chave"
     - Marque todas as APIs que você ativou
   - Clique em "Salvar"

---

## 📝 2. CONFIGURAR A CHAVE NO PROJETO

Você tem **DUAS OPÇÕES**:

### **OPÇÃO 1: Usar arquivo .env (RECOMENDADO - Mais Seguro)**

1. **Na pasta raiz do projeto XIQUEGO**, crie um arquivo chamado `.env`:
   ```
   XIQUEGO/
   ├── app/
   ├── components/
   ├── .env   👈 Crie este arquivo aqui
   └── ...
   ```

2. **Abra o arquivo `.env` e cole isto:**
   ```bash
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=SUA_CHAVE_AQUI
   ```

3. **Substitua `SUA_CHAVE_AQUI` pela sua chave real:**
   ```bash
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBCd123456789abcdefghijklmnopqr
   ```

4. **Salve o arquivo**

✅ **PRONTO!** O arquivo `.env` está no `.gitignore`, então é seguro!

---

### **OPÇÃO 2: Usar app.json (Alternativa)**

1. **Abra o arquivo `XIQUEGO/app.json`**

2. **Procure por estas 3 linhas:**
   ```json
   "COLOQUE_SUA_CHAVE_AQUI"
   ```

3. **Substitua em TODOS os 3 lugares:**
   - iOS (linha ~14)
   - Android (linha ~28)
   - extra (linha ~56)

4. **Exemplo:**
   ```json
   {
     "expo": {
       "ios": {
         "config": {
           "googleMapsApiKey": "AIzaSyBCd123456789abcdefghijklmnopqr"
         }
       },
       "android": {
         "config": {
           "googleMaps": {
             "apiKey": "AIzaSyBCd123456789abcdefghijklmnopqr"
           }
         }
       },
       "extra": {
         "EXPO_PUBLIC_GOOGLE_MAPS_API_KEY": "AIzaSyBCd123456789abcdefghijklmnopqr"
       }
     }
   }
   ```

5. **Salve o arquivo**

⚠️ **ATENÇÃO:** Se usar esta opção, NÃO FAÇA commit do `app.json` com a chave!

---

## 🧪 3. TESTAR SE FUNCIONOU

### **Reinicie o servidor Expo:**
```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente:
npx expo start --clear
```

### **Teste no app:**
1. Abra o app
2. Toque em "Corrida"
3. Selecione uma categoria
4. Na tela de **Origem**, comece a digitar um endereço:
   - Digite: "Salvador"
   - Digite: "Xique-Xique"
   - Digite: "Marreca Velha"

### **✅ Funcionou se:**
- Aparecem sugestões enquanto você digita
- O mapa carrega corretamente
- Você consegue selecionar endereços

### **❌ Não funcionou se:**
- Não aparecem sugestões
- Mapa não carrega
- Erro no console

---

## 🔧 4. SOLUÇÃO DE PROBLEMAS

### **Problema 1: "API key not valid"**
**Solução:**
- Verifique se copiou a chave corretamente (sem espaços)
- Verifique se ativou todas as APIs necessárias no Google Cloud
- Aguarde 5-10 minutos (às vezes demora para propagar)

### **Problema 2: "This API project is not authorized to use this API"**
**Solução:**
- Vá ao Google Cloud Console
- Ative a API que está faltando (Places, Maps, Geocoding, etc)
- Aguarde alguns minutos

### **Problema 3: Mapa não carrega**
**Solução:**
- Limpe o cache: `npx expo start --clear`
- Feche e abra o app novamente
- Verifique a internet

### **Problema 4: "OVER_QUERY_LIMIT"**
**Solução:**
- Você excedeu o limite gratuito do Google
- Google dá $200/mês grátis (suficiente para desenvolvimento)
- Verifique seu uso no Google Cloud Console

---

## 💰 5. CUSTOS E LIMITES

### **Plano Gratuito do Google Maps:**
- ✅ **$200 USD de crédito por mês**
- ✅ Suficiente para ~28.000 solicitações de mapa/mês
- ✅ Suficiente para ~40.000 solicitações de Places/mês
- ✅ Perfeito para desenvolvimento e testes

### **Para produção:**
- Configure limites de uso no Google Cloud
- Ative alertas de cobrança
- Monitore o uso regularmente

---

## 🔒 6. SEGURANÇA

### **✅ FAÇA:**
- Use arquivo `.env` (opção 1)
- Adicione `.env` no `.gitignore`
- Configure restrições de API no Google Cloud
- Use chaves diferentes para desenvolvimento e produção

### **❌ NÃO FAÇA:**
- Commitar a chave no Git
- Compartilhar a chave publicamente
- Deixar a chave sem restrições

---

## 📱 7. ONDE A CHAVE É USADA NO APP

A chave é usada em:
- ✅ `app/order/origin.tsx` - Tela de origem (Google Maps)
- ✅ `app/order/destination.tsx` - Tela de destino (Google Maps)
- ✅ `components/google-places-input.tsx` - Autocomplete de endereços
- ✅ Cálculo de rotas
- ✅ Geocoding e Reverse Geocoding

---

## 🎯 8. PRONTO PARA USAR!

Depois de configurar, o app vai funcionar com:
- ✅ Google Maps REAL
- ✅ Autocomplete de endereços
- ✅ Qualquer lugar do Brasil
- ✅ GPS real
- ✅ Rotas reais

---

## 📞 PRECISA DE AJUDA?

Se tiver algum problema, verifique:
1. ✅ Chave copiada corretamente?
2. ✅ Todas as APIs ativadas?
3. ✅ Arquivo `.env` criado na pasta correta?
4. ✅ Servidor Expo reiniciado?

---

**© 2025 XiqueGo - Google Maps funcionando! 🗺️✅**

