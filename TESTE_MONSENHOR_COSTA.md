# 🧪 TESTE: RUA MONSENHOR COSTA

## ✅ PROBLEMA RESOLVIDO

**Rua adicionada:** R. Monsenhor Costa, 306 - Centro, Xique-Xique - BA

Agora funciona **OFFLINE** (sem API Key)!

---

## ⚡ TESTE AGORA (1 minuto)

### **1️⃣ PARAR todos os processos Node**

```powershell
taskkill /IM node.exe /F
```

### **2️⃣ INICIAR Expo limpo na porta 8083**

```bash
cd "C:\ANDREIA BASTOS\APP XIQUE GO - MOVE XIQUE XIQUE\XIQUEGO"
npx expo start --port 8083 --clear
```

### **3️⃣ AGUARDAR aparecer o QR Code**

```
✅ DEVE APARECER:
› Metro waiting on exp://...
› Scan the QR code above...
```

### **4️⃣ ABRIR o app no celular**

Escaneie o QR Code

### **5️⃣ TESTAR a busca**

1. Toque em **"Corrida"**
2. Selecione **"Moto"** ou **"Carro"**
3. Na tela de **Origem**, digite:

---

## 🎯 TESTES

### **Teste 1: Digite "Monsenhor"**

```
✅ DEVE APARECER:
┌─────────────────────────────────────────┐
│ 📍 Rua Monsenhor Costa                  │
│    Centro, Xique-Xique, BA              │
├─────────────────────────────────────────┤
│ 📍 R. Monsenhor Costa                   │
│    Centro, Xique-Xique, BA              │
├─────────────────────────────────────────┤
│ 📍 Rua Monsenhor Costa, 306             │
│    Centro, Xique-Xique, BA              │
└─────────────────────────────────────────┘
```

### **Teste 2: Digite "Costa"**

```
✅ DEVE APARECER:
📍 Rua Monsenhor Costa
📍 R. Monsenhor Costa
📍 Rua Monsenhor Costa, 306
```

### **Teste 3: Digite "306"**

```
✅ DEVE APARECER:
📍 Rua Monsenhor Costa, 306
📍 Tv. dos Esportes, 462 (outra com número)
```

---

## 📊 RESULTADO ESPERADO

### **Console do Metro Bundler:**

```
🔍 ========================================
🔍 MODO HÍBRIDO - Buscando: Monsenhor
🔍 ========================================
📍 Resultados locais encontrados: 3
   1. Rua Monsenhor Costa, Centro, Xique-Xique, BA
   2. R. Monsenhor Costa, Centro, Xique-Xique, BA
   3. Rua Monsenhor Costa, 306, Centro, Xique-Xique, BA

📊 RESULTADO FINAL:
   📍 Local:   3 ruas
   🌐 Google:  0 ruas (sem API Key)
   🎯 TOTAL:   3 RUAS DISPONÍVEIS

📍 MODO: OFFLINE (só local)
```

---

## ✅ SE FUNCIONOU

Você verá:
```
✅ 3 sugestões com "Monsenhor Costa"
✅ Pode clicar em qualquer uma
✅ Endereço selecionado aparece
✅ Pode ir para próxima tela
```

**Parabéns!** A rua está funcionando!

---

## ❌ SE NÃO FUNCIONOU

### **Problema 1: Servidor não está rodando**

**Sintomas:**
- Nenhuma sugestão aparece
- Tela fica em branco
- Console não mostra logs

**Solução:**
1. Verifique se o QR Code apareceu
2. Verifique se não tem "Skipping dev server"
3. Mate todos os processos: `taskkill /IM node.exe /F`
4. Inicie novamente: `npx expo start --port 8083 --clear`

---

### **Problema 2: Console mostra 78 avisos**

**Se são avisos assim:**
```
Warning: Each child in a list...
Warning: VirtualizedList...
```

✅ **PODE IGNORAR!** São avisos normais de bibliotecas.

**Se são erros assim:**
```
ERROR: Undefined is not an object
ERROR: Text strings must be...
```

❌ **COPIE E ENVIE!** São erros reais.

---

### **Problema 3: Aparecem outras ruas, mas não Monsenhor**

**Causa:** Cache antigo

**Solução:**
```bash
# Limpar completamente
rm -rf node_modules/.cache
npx expo start --clear
```

---

## 🌐 PARA TER TODAS AS RUAS

Se quiser **QUALQUER** rua de Xique-Xique (não só as cadastradas):

### **Configure Google Maps API Key:**

1. 📄 Leia: `GUIA_RAPIDO_TODAS_AS_RUAS.md`
2. 🔑 Obtenha API Key do Google Cloud
3. 📝 Crie arquivo `.env`:
   ```
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=SuaChave
   ```
4. 🔄 Reinicie: `npx expo start --clear`

**Com API configurada:**
```
🌐 TODAS AS RUAS - Google Places ativo

Digite qualquer rua:
- Rua ABC, 123
- Avenida XYZ, 456
- Travessa Qualquer
- TODAS as ruas de Xique-Xique!
```

---

## 📝 LOCAIS ADICIONADOS

```javascript
// Agora no código (OFFLINE):
{ name: 'Rua Monsenhor Costa', city: 'Centro, Xique-Xique, BA' }
{ name: 'R. Monsenhor Costa', city: 'Centro, Xique-Xique, BA' }
{ name: 'Rua Monsenhor Costa, 306', city: 'Centro, Xique-Xique, BA' }
```

**Coordenadas:** `-10.8238, -42.7272` (Centro de Xique-Xique)

---

## 🎯 CHECKLIST FINAL

Antes de dizer que não funciona, verifique:

- [ ] Expo está rodando (QR Code visível)
- [ ] Não tem "Skipping dev server" no terminal
- [ ] App está aberto no celular
- [ ] Consegue navegar até tela de Origem
- [ ] Digitou "Monsenhor" ou "Costa"
- [ ] Aguardou 1-2 segundos (debounce)

Se TODOS estiverem ✅ e AINDA NÃO aparecer:

**Envie:**
1. ✅ Print da tela
2. ✅ Logs do console (últimas 50 linhas)
3. ✅ O que você digitou exatamente

---

## 💡 DICAS

### **Para testar rapidamente:**

```
Digite apenas 3 letras: "Mon"
→ Já deve aparecer sugestões!
```

### **Para ver mais detalhes:**

```
Olhe o console do Metro Bundler
→ Mostra quantos resultados encontrou
```

### **Para testar outros endereços:**

```
- "Centro" → Centro + ruas do centro
- "Marreca" → Marreca Velha + suas ruas  
- "Barão" → Rua Barão do Rio Branco
- "Getúlio" → Av. Getúlio Vargas
```

---

## 🚀 RESUMO

```
1. MATAR processos Node
   → taskkill /IM node.exe /F

2. INICIAR Expo na porta 8083
   → npx expo start --port 8083 --clear

3. AGUARDAR QR Code aparecer

4. ABRIR app no celular

5. TESTAR digitando "Monsenhor"

6. DEVE APARECER 3 sugestões!
```

---

**Data:** 25/10/2025  
**Commit:** 09f1b3a  
**Status:** ✅ RUA MONSENHOR COSTA ADICIONADA

🎉 **Teste e confirme que está funcionando!**

