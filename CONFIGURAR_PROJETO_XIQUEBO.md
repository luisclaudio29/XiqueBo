# 🔑 CONFIGURAR PROJETO XIQUEBO - FINAL

## ✅ VOCÊ JÁ TEM

- ✅ Projeto Google Cloud: **xiquebo**
- ✅ ID do Projeto: **399418653841**
- ✅ APIs ativadas
- ✅ Arquivo `.env` existe (Expo está carregando)

---

## 🎯 FALTA APENAS 2 COISAS

### **1️⃣ OBTER A API KEY DO PROJETO**
### **2️⃣ COLAR NO ARQUIVO .env**

**Tempo:** 2 minutos

---

## 🔑 PASSO 1: OBTER API KEY

### **Acesse diretamente:**

🌐 https://console.cloud.google.com/apis/credentials?project=xiquebo

**OU:**

1. Acesse: https://console.cloud.google.com/
2. Certifique-se que está no projeto **"xiquebo"** (topo da página)
3. Menu lateral: **"APIs e Serviços"** → **"Credenciais"**

---

### **Você vai ver uma tela assim:**

```
┌─────────────────────────────────────────────┐
│  Credenciais                                │
├─────────────────────────────────────────────┤
│  + CREATE CREDENTIALS   ⚙️ Manage API Keys  │
├─────────────────────────────────────────────┤
│  API Keys:                                  │
│                                             │
│  📝 API key 1                               │
│     Created: Dec 1, 2024                    │
│     [⋮] Show key / Copy / Delete            │
│                                             │
└─────────────────────────────────────────────┘
```

---

### **Se JÁ EXISTE uma chave:**

1. Clique nos **3 pontinhos** (⋮) ao lado da chave
2. Clique em **"Show key"** ou **"Copy"**
3. **COPIE A CHAVE COMPLETA!**

**Exemplo:**
```
AIzaSyBCd123456789abcdefghijklmnopqr...
```

---

### **Se NÃO EXISTE chave:**

1. Clique em **"+ CREATE CREDENTIALS"** (topo)
2. Selecione **"API key"**
3. Aguarde 5 segundos
4. **COPIE A CHAVE!**
5. Clique em "CLOSE"

---

## 📝 PASSO 2: CONFIGURAR NO XIQUEGO

### **A) Abrir arquivo .env**

**Caminho:**
```
C:\ANDREIA BASTOS\APP XIQUE GO - MOVE XIQUE XIQUE\XIQUEGO\.env
```

**Abra com:** Bloco de Notas ou VS Code

---

### **B) Verificar conteúdo atual**

O arquivo pode estar assim:

```bash
# Vazio ou com placeholder
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
```

**OU:**

```bash
# Com chave antiga/exemplo
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=COLOQUE_SUA_CHAVE_AQUI
```

---

### **C) COLAR SUA CHAVE**

**Substitua/adicione:**

```bash
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyB...SuaChaveDoProjetoXiquebo...
```

**⚠️ IMPORTANTE:**
- Cole a chave **COMPLETA**
- **SEM ESPAÇOS** antes ou depois
- **SEM ASPAS** ao redor da chave
- Uma linha só

---

### **D) Salvar**

Salve o arquivo (Ctrl+S)

---

## 🔄 PASSO 3: REINICIAR EXPO

**Já fiz isso para você!** ✅

O Expo está reiniciando agora com cache limpo.

**Aguarde aparecer:**
```
› Metro waiting on exp://...
› Scan the QR code above...
```

---

## 🧪 PASSO 4: TESTAR

### **A) Escanear QR Code**

Use o celular para escanear o QR Code que vai aparecer no terminal.

---

### **B) Abrir o app**

1. App abre automaticamente
2. Toque em **"Corrida"**
3. Selecione **"Moto"** ou **"Carro"**
4. Na tela de **Origem**, digite: **"Rua"**

---

### **C) Verificar resultado**

**✅ SE FUNCIONOU:**

```
┌──────────────────────────────────────┐
│ 🌐 TODAS AS RUAS - Google ativo      │
├──────────────────────────────────────┤
│ Digite: "Rua"                        │
│                                      │
│ 📍 Rua Principal (local)             │
│ 📍 Rua da Igreja (local)             │
│ 🌐 Rua ABC, 123 (Google)             │
│ 🌐 Rua XYZ, 456 (Google)             │
│ 🌐 Rua Monsenhor Costa (Google)      │
│ ... até 30 sugestões!                │
│                                      │
│ ✅ TODAS AS RUAS DISPONÍVEIS!        │
└──────────────────────────────────────┘
```

---

**❌ SE NÃO FUNCIONOU:**

```
┌──────────────────────────────────────┐
│ 📍 OFFLINE: 200+ ruas cadastradas    │
├──────────────────────────────────────┤
│ Digite: "Rua"                        │
│                                      │
│ 📍 Rua Principal (local)             │
│ 📍 Rua da Igreja (local)             │
│ ... apenas locais                    │
│                                      │
│ ⚠️ Google não está ativo             │
└──────────────────────────────────────┘
```

**Solução:** Veja "PROBLEMAS" abaixo.

---

## 🐛 PROBLEMAS COMUNS

### **Problema 1: Badge mostra "OFFLINE"**

**Causa:** API Key não foi carregada

**Solução:**
1. Verifique se salvou o arquivo `.env`
2. Verifique se a chave está correta (sem espaços)
3. Pare o Expo (Ctrl+C no terminal)
4. Reinicie: `npx expo start --port 8083 --clear`

---

### **Problema 2: "REQUEST_DENIED"**

**Causa:** Places API não está ativa no projeto

**Solução:**
1. Acesse: https://console.cloud.google.com/apis/library/places-backend.googleapis.com?project=xiquebo
2. Clique em **"ENABLE"** (ATIVAR)
3. Aguarde 5 minutos
4. Reinicie o Expo

---

### **Problema 3: "API key not valid"**

**Causa:** Chave copiada incorretamente ou com restrições

**Solução:**
1. Copie a chave novamente do Google Cloud
2. Cole no `.env` sem espaços
3. Remova restrições temporariamente:
   - Console → Credenciais → Clique na chave
   - "Application restrictions" → "None"
   - "API restrictions" → "Don't restrict key"
   - Save
4. Reinicie o Expo

---

## 📊 CHECKLIST FINAL

Antes de dizer que não funcionou, verifique:

- [ ] Acessou https://console.cloud.google.com/apis/credentials?project=xiquebo
- [ ] Copiou a API Key completa
- [ ] Abriu arquivo `.env` na pasta correta
- [ ] Colou a chave SEM espaços
- [ ] Salvou o arquivo (Ctrl+S)
- [ ] Reiniciou Expo com `--clear`
- [ ] QR Code apareceu no terminal
- [ ] App abriu no celular
- [ ] Testou digitando "Rua"

---

## 🔍 LOGS ESPERADOS

Quando você digitar "Rua", o console deve mostrar:

```
🔍 MODO HÍBRIDO - Buscando: Rua
📍 Resultados locais encontrados: 15
🌐 API Key OK - Buscando TODAS AS RUAS no Google Places...
✅ Google FUNCIONANDO! 20 ruas encontradas

📊 RESULTADO FINAL:
   📍 Local:   15 ruas
   🌐 Google:  20 ruas
   🎯 TOTAL:   35 RUAS DISPONÍVEIS

✅ MODO: HÍBRIDO (local + Google - TODAS AS RUAS!)
```

---

## 💡 DICAS

### **Para testar rapidamente:**

Digite apenas: **"Mon"**
- Se aparecer "Monsenhor Costa" com vários números = ✅ Google ON!
- Se aparecer só 3 resultados = ❌ Ainda offline

---

### **Para ver mais logs:**

Olhe o terminal onde o Expo está rodando.
- Vai mostrar cada busca em tempo real
- Mostra se Google está funcionando
- Mostra quantos resultados encontrou

---

## 🎯 LINKS RÁPIDOS

### **Seu projeto:**
- 🌐 Console: https://console.cloud.google.com/?project=xiquebo
- 🔑 Credenciais: https://console.cloud.google.com/apis/credentials?project=xiquebo
- 📊 APIs: https://console.cloud.google.com/apis/dashboard?project=xiquebo
- 🔍 Places API: https://console.cloud.google.com/apis/library/places-backend.googleapis.com?project=xiquebo

---

## 🚀 RESUMO

```
1. ✅ Você TEM projeto: xiquebo
2. ✅ Você TEM APIs ativas
3. 🔑 COPIE a API Key do projeto
4. 📝 COLE no arquivo .env
5. 🔄 REINICIE Expo (já feito!)
6. 🧪 TESTE digitando "Rua"
7. 🎉 TODAS AS RUAS!
```

---

## ✅ RESULTADO ESPERADO

Com tudo configurado:

```
Você digita: "Rua Mon"
              ↓
App busca no Google: "xiquebo"
              ↓
Google retorna: TODAS as ruas
              ↓
Aparece:
  🌐 Rua Monsenhor Costa
  🌐 Rua Monsenhor Costa, 50
  🌐 Rua Monsenhor Costa, 100
  🌐 Rua Monsenhor Costa, 123
  🌐 Rua Monsenhor Costa, 200
  🌐 Rua Monsenhor Costa, 306
  ... e TODAS as outras!
```

---

**Data:** 25/10/2025  
**Projeto:** xiquebo (399418653841)  
**Status:** ✅ Pronto para configurar!

🔑 **Pegue a chave e cole no .env - 2 minutos!**

