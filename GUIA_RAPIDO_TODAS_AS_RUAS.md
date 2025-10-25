# ⚡ GUIA RÁPIDO - ATIVAR TODAS AS RUAS

## 🎯 EM 5 MINUTOS

### **1️⃣ OBTER API KEY (2 minutos)**

1. Acesse: https://console.cloud.google.com/
2. Crie projeto: **"XiqueGo"**
3. Ative API: **"Places API"**
4. Crie: **"Chave de API"**
5. **Copie a chave!**

---

### **2️⃣ CONFIGURAR NO PROJETO (1 minuto)**

Crie arquivo `.env` na pasta `XIQUEGO/`:

```bash
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyB...SuaChaveAqui...
```

---

### **3️⃣ REINICIAR EXPO (1 minuto)**

```bash
npx expo start --clear
```

---

### **4️⃣ TESTAR NO APP (1 minuto)**

```
1. Abra o app
2. Toque em "Corrida"
3. Selecione "Moto" ou "Carro"
4. Digite: "Rua"
```

**✅ Sucesso se ver:**
```
🌐 TODAS AS RUAS - Google Places ativo
```

**✅ E aparecerem 20-30 ruas!**

---

## 🎉 PRONTO!

Agora o app busca **TODAS as ruas** de Xique-Xique via Google!

---

## 📊 O QUE MUDOU

### **ANTES:**
```
Digite "Rua"
→ 5-15 resultados (só cadastradas)
```

### **DEPOIS:**
```
Digite "Rua"
→ 20-30 resultados (TODAS via Google!)
```

---

## 🐛 NÃO FUNCIONOU?

### **1. API Key errada?**
- Verifique se copiou corretamente
- Sem espaços antes/depois

### **2. Places API não ativa?**
- Console Google Cloud
- "APIs e Serviços" → "Biblioteca"
- Procurar "Places API"
- Clicar "ATIVAR"

### **3. Arquivo .env no lugar certo?**
```
XIQUEGO/
├── app/
├── components/
├── .env   👈 Aqui!
└── package.json
```

### **4. Reiniciou o Expo?**
```bash
npx expo start --clear
```

---

## 💡 DICAS DE BUSCA

| Digite | Aparece |
|--------|---------|
| `Rua` | TODAS as ruas |
| `Av` | TODAS as avenidas |
| `Centro` | Ruas do centro |
| `Marreca` | Marreca Velha |
| `Santo` | Santo Inácio |
| `Barão` | R. Barão do Rio Branco |

---

## 📚 DOCUMENTAÇÃO COMPLETA

- `COMO_ATIVAR_TODAS_AS_RUAS.md` → Guia detalhado
- `O_QUE_MUDOU_BUSCA_RUAS.md` → Mudanças técnicas
- `README_BUSCA_OTIMIZADA.md` → Visão geral

---

## ✅ RESULTADO

### **COM INTERNET:**
```
🌐 Google Places API
→ TODAS as ruas de Xique-Xique
→ ILIMITADO (50km de raio)
→ 20-30 sugestões por busca
```

### **SEM INTERNET:**
```
📍 Base local offline
→ 200+ ruas cadastradas
→ Instantâneo
→ Sempre funciona
```

---

**Data:** 25/10/2025  
**Tempo estimado:** 5 minutos  
**Dificuldade:** ⭐ Fácil

🗺️ **XiqueGo - Busca completa de ruas!**

