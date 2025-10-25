# 🔑 CONFIGURAR API KEY - TODAS AS RUAS AUTOMÁTICAS

## ⚡ VOCÊ NÃO PRECISA CADASTRAR MANUALMENTE!

Com a API Key do Google Maps, o app automaticamente terá acesso a:

- ✅ **TODAS as ruas** de Xique-Xique
- ✅ **TODOS os números** de casas
- ✅ **TODAS as avenidas, travessas, praças**
- ✅ **Tudo que existe no Google Maps!**

**ZERO CADASTRO MANUAL!**

---

## 🎯 PASSO A PASSO (5 MINUTOS)

### **1️⃣ Criar conta Google Cloud (se não tiver)**

1. Acesse: **https://console.cloud.google.com/**
2. Faça login com Gmail
3. Aceite os termos

---

### **2️⃣ Criar projeto**

1. Clique em **"Selecionar projeto"** (topo da página)
2. Clique em **"Novo projeto"**
3. Nome: **XiqueGo**
4. Clique em **"CRIAR"**
5. Aguarde 10 segundos

---

### **3️⃣ Ativar Places API** ← MAIS IMPORTANTE!

1. No menu lateral: **"APIs e Serviços"** → **"Biblioteca"**
2. Na barra de busca, digite: **"Places API"**
3. Clique em **"Places API"**
4. Clique no botão azul: **"ATIVAR"**
5. Aguarde ativação (10 segundos)

**✅ PRONTO! Esta é a API que busca TODAS as ruas!**

---

### **4️⃣ Criar API Key**

1. Menu lateral: **"APIs e Serviços"** → **"Credenciais"**
2. Clique no botão: **"+ CRIAR CREDENCIAIS"**
3. Selecione: **"Chave de API"**
4. **COPIE A CHAVE!** (algo como: `AIzaSyBCd123456789abcdefghijklmnopqr`)

**⚠️ GUARDE BEM ESSA CHAVE!**

---

### **5️⃣ Configurar restrições (OPCIONAL - pode fazer depois)**

Por enquanto, deixe sem restrições para testar.

Mais tarde você pode:
- Restringir por aplicativo (Android/iOS)
- Restringir quais APIs pode usar

---

### **6️⃣ Adicionar no projeto XiqueGo**

**Opção A: Criar arquivo .env (RECOMENDADO)**

1. Vá para a pasta: `C:\ANDREIA BASTOS\APP XIQUE GO - MOVE XIQUE XIQUE\XIQUEGO\`
2. Crie um arquivo chamado: `.env` (exatamente esse nome!)
3. Abra o arquivo com Bloco de Notas
4. Cole isto:

```bash
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBCd123456789abcdefghijklmnopqr
```

**⚠️ Substitua pela SUA chave real!**

5. Salve o arquivo

---

### **7️⃣ Reiniciar Expo**

```bash
# No terminal, pare o Expo (Ctrl+C)
# Depois execute:
cd "C:\ANDREIA BASTOS\APP XIQUE GO - MOVE XIQUE XIQUE\XIQUEGO"
npx expo start --port 8083 --clear
```

**Aguarde o QR Code aparecer**

---

### **8️⃣ TESTAR NO APP**

1. Escaneie o QR Code
2. Abra o app
3. Toque em **"Corrida"**
4. Selecione categoria
5. Digite qualquer rua: **"Rua"**, **"Av"**, **"Monsenhor"**

**✅ DEVE APARECER:**

```
🌐 TODAS AS RUAS - Google Places ativo

📍 Rua Principal
📍 Rua da Igreja
🌐 Rua ABC, 123
🌐 Rua XYZ, 456
🌐 Rua Monsenhor Costa
🌐 Rua Monsenhor Costa, 306
... até 30 sugestões!
```

---

## 🎉 PRONTO!

Agora você tem **ACESSO A TODAS AS RUAS** sem cadastrar nada manualmente!

---

## 🔍 COMO SABER SE FUNCIONOU?

### **Verifique o badge no app:**

**✅ FUNCIONANDO:**
```
🌐 TODAS AS RUAS - Google Places ativo
```

**❌ NÃO FUNCIONANDO:**
```
📍 OFFLINE: 200+ ruas cadastradas
```

### **Teste prático:**

Digite uma rua que você **SABE** que existe mas **NÃO** está cadastrada:

```
Digite: "Rua Silva"
```

- **Se aparecer** → ✅ Google funcionando!
- **Se não aparecer** → ❌ Verifique API Key

---

## 🐛 PROBLEMAS COMUNS

### **Problema 1: "REQUEST_DENIED"**

**Causa:** Places API não ativada

**Solução:**
1. Volte ao Google Cloud Console
2. "APIs e Serviços" → "Biblioteca"
3. Procure "Places API"
4. Clique em "ATIVAR"
5. Aguarde 5 minutos

---

### **Problema 2: Badge ainda mostra "OFFLINE"**

**Causa:** API Key não carregada

**Solução:**
1. Verifique se o arquivo `.env` existe
2. Verifique se está na pasta correta
3. Verifique se a chave está correta (sem espaços)
4. Reinicie: `npx expo start --port 8083 --clear`

---

### **Problema 3: "API key not valid"**

**Causa:** Chave errada ou restrições muito rígidas

**Solução:**
1. Copie a chave novamente do Google Cloud
2. Cole no `.env` sem espaços antes/depois
3. Remova restrições temporariamente
4. Reinicie o Expo

---

## 💡 DICAS

### **Para testar se está funcionando:**

1. Digite uma rua **conhecida**: "Rua Monsenhor Costa"
   - ✅ Deve aparecer com vários números!

2. Digite uma rua **aleatória**: "Rua ABC"
   - ✅ Se aparecer algo, Google está ON!

3. Verifique o **console** (terminal):
   - Deve mostrar: `✅ Google FUNCIONANDO! X ruas encontradas`

---

## 📊 ANTES vs DEPOIS

### **ANTES (sem API Key):**
```
Você digita: "Rua Monsenhor Costa, 306"
→ ❌ Não encontrado
→ Precisa cadastrar manualmente
→ Muito trabalho!
```

### **DEPOIS (com API Key):**
```
Você digita: "Rua Monsenhor Costa, 306"
→ ✅ Aparece automaticamente!
→ Com número exato!
→ ZERO trabalho manual!
```

---

## 🌐 O QUE O GOOGLE RETORNA?

Literalmente **TUDO** que existe no Google Maps de Xique-Xique:

- ✅ Ruas com números: "Rua ABC, 123"
- ✅ Avenidas completas
- ✅ Travessas todas
- ✅ Praças
- ✅ Estabelecimentos comerciais
- ✅ Pontos de referência
- ✅ **Tudo que você vê no Google Maps!**

---

## 💰 CUSTOS REAIS

### **Plano Gratuito Google Maps:**

- **$200 USD de crédito mensal** (GRÁTIS)
- Places Autocomplete: $2.83 por 1.000 buscas
- Com $200 grátis = **~70.000 buscas/mês GRÁTIS**

### **Para um app pequeno:**

- 10 usuários × 50 buscas/dia = 15.000 buscas/mês
- **Custo: R$ 0,00** (dentro do grátis!)

### **Quando começa a cobrar:**

- Só depois de gastar os $200 grátis
- Configure alertas no Google Cloud
- Monitore uso regularmente

---

## 🔒 SEGURANÇA

### **✅ SEMPRE:**

- Use arquivo `.env` (não commita no Git)
- Adicione `.env` no `.gitignore`
- Configure restrições em produção
- Monitore uso no Google Cloud

### **❌ NUNCA:**

- Compartilhe a API Key publicamente
- Commit a chave no Git
- Deixe sem restrições em produção

---

## 📚 ARQUIVOS RELACIONADOS

| Arquivo | Descrição |
|---------|-----------|
| **Este arquivo** | Guia completo de configuração |
| `GUIA_RAPIDO_TODAS_AS_RUAS.md` | Versão mais técnica |
| `COMO_ATIVAR_TODAS_AS_RUAS.md` | Versão detalhada |
| `SOLUCAO_PORTA_OCUPADA.md` | Se tiver problema com porta |

---

## ✅ CHECKLIST

Antes de testar, verifique:

- [ ] Conta Google Cloud criada
- [ ] Projeto "XiqueGo" criado
- [ ] **Places API ativada** ← CRÍTICO!
- [ ] API Key copiada
- [ ] Arquivo `.env` criado
- [ ] Chave colada no `.env`
- [ ] Expo reiniciado com `--clear`
- [ ] App aberto no celular
- [ ] Testado digitando "Rua"

---

## 🎯 RESULTADO FINAL

Com tudo configurado:

```
┌──────────────────────────────────────┐
│  🌐 TODAS AS RUAS - Google ativo     │
├──────────────────────────────────────┤
│  Digite QUALQUER endereço:           │
│                                      │
│  "Rua" → TODAS as ruas               │
│  "Av" → TODAS as avenidas            │
│  "Monsenhor" → Com números!          │
│  "123" → Endereços com esse número   │
│                                      │
│  ✅ ILIMITADO                        │
│  ✅ AUTOMÁTICO                       │
│  ✅ SEM CADASTRO MANUAL              │
└──────────────────────────────────────┘
```

---

**Data:** 25/10/2025  
**Tempo:** 5 minutos  
**Custo:** R$ 0,00 (grátis!)  
**Resultado:** ♾️ INFINITAS RUAS!

🔑 **Configure agora e tenha TODAS as ruas automáticas!**

