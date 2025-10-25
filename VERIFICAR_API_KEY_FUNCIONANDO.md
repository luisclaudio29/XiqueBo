# 🔍 VERIFICAR SE API KEY ESTÁ FUNCIONANDO

## ✅ VOCÊ JÁ FEZ

- Projeto xiquebo criado
- APIs habilitadas no Google Cloud Console

---

## 🎯 VERIFICAR AGORA

### **1️⃣ Verificar se .env tem a chave**

Abra este arquivo:
```
C:\ANDREIA BASTOS\APP XIQUE GO - MOVE XIQUE XIQUE\XIQUEGO\.env
```

**Deve ter esta linha:**
```bash
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyB...SuaChaveDoProjetoXiquebo...
```

**✅ SE TEM:** Prossiga para passo 2  
**❌ SE NÃO TEM:** Siga `FAZER_AGORA_PROJETO_XIQUEBO.md`

---

### **2️⃣ Verificar no console do Expo**

No terminal onde o Expo está rodando, deve aparecer:

```
env: load .env
env: export EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ← DEVE TER ISSO!
```

**✅ SE APARECE:** API Key está carregada!  
**❌ SE NÃO APARECE:** Reinicie o Expo

---

### **3️⃣ Testar no app**

1. Abra o app no celular
2. Toque em **"Corrida"**
3. Selecione categoria
4. **Digite: "Rua"**

**Observe o badge no topo:**

**✅ FUNCIONANDO:**
```
🌐 TODAS AS RUAS - Google Places ativo
```

**❌ NÃO FUNCIONANDO:**
```
📍 OFFLINE: 200+ ruas cadastradas
```

---

### **4️⃣ Verificar logs detalhados**

No console do Expo, quando você digitar "Rua", deve aparecer:

**✅ FUNCIONANDO:**
```
🔍 MODO HÍBRIDO - Buscando: Rua
📍 Resultados locais encontrados: 15
🌐 API Key OK - Buscando TODAS AS RUAS no Google Places...
✅ Google FUNCIONANDO! 20 ruas encontradas

📊 RESULTADO FINAL:
   📍 Local:   15 ruas
   🌐 Google:  20 ruas
   🎯 TOTAL:   35 RUAS DISPONÍVEIS
```

**❌ NÃO FUNCIONANDO:**
```
⚠️ API KEY NÃO CONFIGURADA! Google Places desabilitado.
⚠️ Configure EXPO_PUBLIC_GOOGLE_MAPS_API_KEY no .env
```

---

## 🐛 SE NÃO ESTÁ FUNCIONANDO

### **Passo 1: Pegar a chave do projeto xiquebo**

Acesse: https://console.cloud.google.com/apis/credentials?project=xiquebo

1. Procure "API Keys"
2. Clique nos 3 pontinhos (⋮)
3. "Show key" ou "Copy"
4. **COPIE A CHAVE!**

---

### **Passo 2: Criar/editar .env**

Crie ou edite o arquivo:
```
C:\ANDREIA BASTOS\APP XIQUE GO - MOVE XIQUE XIQUE\XIQUEGO\.env
```

Cole isto (com SUA chave):
```bash
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyB...SuaChaveAqui...
```

**SALVE!**

---

### **Passo 3: Reiniciar Expo**

```bash
# Pare com Ctrl+C
# Depois:
cd "C:\ANDREIA BASTOS\APP XIQUE GO - MOVE XIQUE XIQUE\XIQUEGO"
npx expo start --port 8083 --clear
```

---

### **Passo 4: Testar novamente**

Digite "Rua" e veja se aparece badge:
```
🌐 TODAS AS RUAS - Google Places ativo
```

---

## 📊 CHECKLIST

- [ ] Arquivo .env existe
- [ ] API Key está no .env
- [ ] Expo carrega: "export EXPO_PUBLIC_GOOGLE_MAPS_API_KEY"
- [ ] App mostra badge: "🌐 TODAS AS RUAS"
- [ ] Console mostra: "✅ Google FUNCIONANDO!"
- [ ] Aparecem 20-30 sugestões ao digitar

---

## ✅ SE TUDO ESTIVER OK

Você verá:
```
🌐 TODAS AS RUAS - Google Places ativo

Digite qualquer rua:
→ TODAS as ruas de Xique-Xique aparecem!
→ Todos os números de casa!
→ INFINITAS opções!
```

---

**Status:** Configure e teste!

