# 🔧 SOLUÇÃO: PORTA OCUPADA - SERVIDOR NÃO INICIA

## ❌ PROBLEMA IDENTIFICADO

```
Port 8081 is being used by another process
Skipping dev server
```

**Resultado:** 
- ❌ Servidor Expo NÃO está rodando
- ❌ App não busca endereços
- ❌ Só aparece "não encontrado"
- ❌ 78 avisos no console

---

## ✅ SOLUÇÃO RÁPIDA (2 minutos)

### **Opção 1: Usar porta diferente**

```bash
cd "C:\ANDREIA BASTOS\APP XIQUE GO - MOVE XIQUE XIQUE\XIQUEGO"
npx expo start --port 8083 --clear
```

### **Opção 2: Matar processo na porta 8081**

#### **Windows:**

```powershell
# Encontrar o processo
netstat -ano | findstr :8081

# Vai aparecer algo como:
# TCP    0.0.0.0:8081    0.0.0.0:0    LISTENING    12345
#                                                   ↑
#                                                   PID

# Matar o processo (substitua 12345 pelo PID real)
taskkill /PID 12345 /F

# Agora iniciar normalmente
npx expo start --clear
```

#### **Se não souber o PID:**

```powershell
# Matar todos os processos do Node
taskkill /IM node.exe /F

# Depois iniciar
npx expo start --clear
```

---

## 🔍 COMO VERIFICAR SE FUNCIONOU

### **1. Observe o terminal:**

**✅ FUNCIONANDO:**
```
Starting Metro Bundler
Logs for your project will appear below.

› Metro waiting on exp://192.168.x.x:8083
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

**❌ NÃO FUNCIONANDO:**
```
Port 8081 is being used by another process
Skipping dev server
```

### **2. Teste no app:**

1. Abra o app no celular
2. Vá em "Corrida"
3. Digite qualquer endereço
4. **Deve aparecer sugestões!**

---

## 🧪 TESTE ESPECÍFICO: R. Monsenhor Costa

Você mencionou que no Google Maps aparece:
```
R. Monsenhor Costa, 306 - centro, Xique-Xique - BA
```

### **Vamos testar no app:**

1. ✅ Abra o app
2. ✅ Toque em "Corrida"
3. ✅ Selecione categoria
4. ✅ Digite: **"Monsenhor"**

**Deve aparecer:**
```
📍 Rua Monsenhor Costa (se cadastrada localmente)
🌐 R. Monsenhor Costa, 306 - Centro (via Google)
```

### **Se NÃO aparecer:**

Provavelmente você **NÃO tem API Key configurada**.

**Solução:**
1. Configure API Key (veja: `GUIA_RAPIDO_TODAS_AS_RUAS.md`)
2. Ou adicione manualmente no arquivo de locais

---

## 📝 ADICIONAR RUA MANUALMENTE

Se quiser que "Rua Monsenhor Costa" apareça SEMPRE (offline):

### **Edite:** `components/address-autocomplete.tsx`

Linha ~30-50, adicione:

```typescript
const LOCAL_PLACES = [
  // ... locais existentes ...
  
  // ADICIONAR ESTA LINHA:
  { name: 'Rua Monsenhor Costa', city: 'Centro, Xique-Xique, BA', lat: -10.8238, lng: -42.7272 },
  
  // ... resto dos locais ...
];
```

**Depois:**
```bash
npx expo start --clear
```

---

## 🐛 78 AVISOS - O QUE SÃO?

### **Avisos Normais (pode ignorar):**

```
Warning: Each child in a list should have a unique "key" prop
Warning: VirtualizedList: You have a large list
Warning: componentWillMount has been renamed
```

**São avisos de bibliotecas**, não afetam funcionamento.

### **Erros Graves (precisa corrigir):**

```
ERROR: Undefined is not an object
ERROR: Text strings must be rendered within a <Text> component
ERROR: Invalid hook call
```

**Se ver esses, copie e envie!**

---

## 📊 DIAGNÓSTICO COMPLETO

### **Verifique o console do Metro Bundler:**

```bash
# Terminal do Expo deve mostrar:
LOG  🔍 MODO HÍBRIDO - Buscando: Monsenhor
LOG  📍 Resultados locais encontrados: 0
LOG  🌐 API Key OK - Buscando TODAS AS RUAS no Google Places...
```

### **Se aparecer:**

```
⚠️ API KEY NÃO CONFIGURADA!
```

**Então precisa configurar:**
📄 Leia: `GUIA_RAPIDO_TODAS_AS_RUAS.md`

---

## 🎯 CHECKLIST

Para verificar se tudo está OK:

- [ ] Servidor Expo rodando (sem "Skipping dev server")
- [ ] QR Code aparecendo no terminal
- [ ] App abre no celular
- [ ] Consegue navegar até tela de Origem
- [ ] Consegue digitar na caixa de busca
- [ ] Aparecem sugestões ao digitar

Se TODOS estiverem ✅, então:

### **PROBLEMA 1: Rua não cadastrada localmente**

**Solução:** Configure API Key para buscar via Google

### **PROBLEMA 2: API Key não configurada**

**Solução:** Siga `GUIA_RAPIDO_TODAS_AS_RUAS.md`

---

## 💡 POR QUE NÃO APARECE "R. MONSENHOR COSTA"?

### **Resposta:**

Esta rua **NÃO** está na lista das 200+ ruas cadastradas manualmente.

**Opções:**

1. ✅ **Configure API Key** → Busca TODAS as ruas via Google
2. ✅ **Adicione manualmente** → Edite `address-autocomplete.tsx`

---

## 🚀 SOLUÇÃO DEFINITIVA

### **Para ter TODAS as ruas (incluindo Monsenhor Costa):**

1. ✅ Obtenha Google Maps API Key
2. ✅ Crie arquivo `.env`:
   ```
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=SuaChaveAqui
   ```
3. ✅ Reinicie Expo: `npx expo start --clear`
4. ✅ Teste digitando "Monsenhor"

**Com API configurada:**
```
🌐 TODAS AS RUAS - Google Places ativo
→ R. Monsenhor Costa, 306 - Centro
→ R. Monsenhor Costa, 123
→ Qualquer endereço de Xique-Xique!
```

---

## 📞 RESUMO DA SOLUÇÃO

```
1. PARAR processo antigo:
   → taskkill /IM node.exe /F

2. INICIAR na porta 8083:
   → npx expo start --port 8083 --clear

3. VERIFICAR terminal:
   → Deve aparecer QR Code

4. TESTAR no app:
   → Digite "Monsenhor" ou qualquer rua

5. SE NÃO APARECER:
   → Configure API Key (GUIA_RAPIDO_TODAS_AS_RUAS.md)
```

---

**Data:** 25/10/2025  
**Status:** ✅ SOLUÇÃO DOCUMENTADA

🔧 **Siga os passos e teste novamente!**

