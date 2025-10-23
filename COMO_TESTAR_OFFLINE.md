# 🧪 COMO TESTAR O MODO OFFLINE - XiquêGo

## 📱 GUIA RÁPIDO DE TESTES

---

## ✅ PRÉ-REQUISITOS

1. App XiquêGo instalado
2. Permissão de localização ativada
3. Celular com Android/iOS

---

## 🎯 TESTE 1: SOLICITAR CORRIDA OFFLINE

### **Passos:**

1. **Abra o app XiquêGo**

2. **Ative o modo avião** (desligue WiFi e dados móveis)
   - Android: Arraste de cima para baixo → Clique no ícone de avião
   - iOS: Deslize de cima → Ative modo avião

3. **Veja o banner vermelho aparecer**
   ```
   📵 Modo Offline
   Suas solicitações serão sincronizadas quando a internet voltar
   ```

4. **Solicite uma corrida:**
   - Origem: "Marreca Velha"
   - Destino: "Xique-Xique Centro"
   - Pagamento: PIX
   - Clique em "Confirmar Corrida"

5. **Veja a mensagem:**
   ```
   📵 Modo Offline
   
   Sua solicitação foi salva!
   
   Valor estimado: R$ 12.50
   
   Ela será enviada automaticamente quando você
   tiver conexão de internet.
   
   [Entendi]
   ```

6. **Desative o modo avião**
   - O app detecta automaticamente

7. **Veja o banner verde:**
   ```
   ✅ Online
   Sincronizando dados...
   ```

8. **Pronto!** A solicitação foi enviada automaticamente!

---

## 🎯 TESTE 2: VER ESTATÍSTICAS OFFLINE

### **Passos:**

1. **Ative o modo avião**

2. **Faça 2-3 solicitações de corrida** (diferentes)

3. **Abra o Menu** (≡ no canto superior esquerdo)

4. **Clique em "Modo Offline"**

5. **Veja as estatísticas:**
   - Total: 3
   - Pendentes: 3
   - Sincronizadas: 0

6. **Veja a lista de solicitações pendentes:**
   - Cada uma com origem, destino, valor

7. **Desative o modo avião**

8. **Clique em "🔄 Sincronizar Agora"**

9. **Veja a mensagem:**
   ```
   ✅ Sincronização Concluída
   
   3 solicitações sincronizadas com sucesso!
   ```

10. **Veja as estatísticas atualizadas:**
    - Total: 3
    - Pendentes: 0
    - Sincronizadas: 3

---

## 🎯 TESTE 3: INDICADOR VISUAL

### **Teste do Banner Vermelho (Offline):**

1. Abra o app
2. Ative modo avião
3. **Veja o banner vermelho aparecer no topo**
4. Banner fica visível enquanto offline

### **Teste do Banner Verde (Online):**

1. Estando offline (banner vermelho visível)
2. Desative modo avião
3. **Veja o banner mudar para verde**
4. Banner verde some após 2 segundos

---

## 🎯 TESTE 4: GPS OFFLINE

### **Passos:**

1. **Ative a localização do celular**
2. **Ative o modo avião**
3. **Abra o XiquêGo**
4. **Clique no campo "Origem"**
5. **Clique em "📍 Usar localização atual"**
6. **GPS funciona e pega suas coordenadas!**
   - Mesmo sem internet
   - Mostra endereço aproximado

---

## 🎯 TESTE 5: SINCRONIZAÇÃO AUTOMÁTICA

### **Passos:**

1. **Ative modo avião**

2. **Solicite 1 corrida**
   - Salva offline

3. **Espere 10 segundos** (não faça nada)

4. **Desative modo avião**

5. **NÃO FAÇA NADA** (não abra menu, não clique em nada)

6. **Observe:**
   - Banner verde aparece
   - Mensagem: "Sincronizando..."
   - Após 1-2 segundos, sincroniza sozinho
   - **Você não fez nada!**

7. **Abra "Modo Offline" no menu**

8. **Veja:**
   - Pendentes: 0 (sincronizou automaticamente!)
   - Sincronizadas: 1

---

## 🎯 TESTE 6: MÚLTIPLAS SOLICITAÇÕES

### **Passos:**

1. **Ative modo avião**

2. **Faça 5 solicitações diferentes:**
   - Marreca Velha → Xique-Xique
   - Vacaria → Rumo Novo
   - Rumo Novo → Pedra Branca
   - Xique-Xique → Marreca Velha
   - Pedra Branca → Xique-Xique

3. **Veja "Modo Offline"**
   - Pendentes: 5

4. **Desative modo avião**

5. **Sincroniza automático**

6. **Todas as 5 são enviadas juntas!**

---

## 🎯 TESTE 7: LIMPEZA DE DADOS ANTIGOS

### **Passos:**

1. **Faça algumas solicitações e sincronize**

2. **Abra "Modo Offline"**

3. **Clique em "🗑️ Limpar Dados Antigos"**

4. **Confirme**

5. **Veja mensagem:**
   ```
   Concluído
   
   X solicitações antigas foram removidas.
   ```

---

## 🎯 TESTE 8: PERDA DE CONEXÃO DURANTE USO

### **Passos:**

1. **App aberto com internet**

2. **Comece a preencher uma solicitação:**
   - Origem: "Marreca Velha"

3. **DURANTE o preenchimento, ative modo avião**

4. **Continue preenchendo:**
   - Destino: "Xique-Xique"
   - Pagamento: PIX

5. **Clique em "Confirmar"**

6. **App detecta que está offline**

7. **Salva automaticamente**

8. **Mostra mensagem de offline**

✅ **App não trava! Continua funcionando!**

---

## 🎯 TESTE 9: SINCRONIZAÇÃO MANUAL

### **Passos:**

1. **Faça solicitações offline**

2. **Desative modo avião**

3. **NÃO espere sincronização automática**

4. **Abra "Modo Offline" rapidamente**

5. **Clique em "🔄 Sincronizar Agora"**

6. **Sincroniza imediatamente**

7. **Veja confirmação**

---

## 🎯 TESTE 10: POVOADO SEM SINAL (SIMULAÇÃO REAL)

### **Cenário Real:**
Você está em Marreca Velha (sem sinal) e precisa ir para Xique-Xique

### **Passos:**

1. **Estando em casa (com internet):**
   - Abra o app
   - Veja que está online

2. **Saia de casa e vá para área sem sinal:**
   - Ou ative modo avião para simular

3. **No local sem sinal:**
   - Abra o app
   - Veja banner vermelho
   - Solicite corrida: Marreca Velha → Xique-Xique
   - App salva offline

4. **Continue sua vida normal**
   - Feche o app
   - Guarde o celular

5. **Quando chegar em área com sinal:**
   - Pode ser daqui a 10 minutos
   - Pode ser daqui a 1 hora
   - Não importa!

6. **App detecta sinal automaticamente**
   - Mesmo fechado
   - Sincroniza em background
   - Envia sua solicitação

7. **Motorista recebe a solicitação**
   - Como se tivesse sido feita online
   - Normal!

✅ **FUNCIONOU PERFEITAMENTE!**

---

## 📊 CHECKLIST DE TESTES

Marque conforme for testando:

- [ ] Banner vermelho aparece offline
- [ ] Banner verde aparece online
- [ ] Solicitar corrida offline funciona
- [ ] Mensagem de confirmação offline aparece
- [ ] Estatísticas mostram pendentes corretamente
- [ ] Sincronização automática funciona
- [ ] Sincronização manual funciona
- [ ] Lista de pendentes mostra todas
- [ ] GPS funciona offline
- [ ] Múltiplas solicitações funcionam
- [ ] Limpeza de dados funciona
- [ ] App não trava ao perder conexão
- [ ] Sincronização em background funciona

---

## 🐛 REPORTAR PROBLEMAS

Se encontrar algum problema:

1. Anote o que aconteceu
2. Tire print da tela
3. Entre em contato:
   - 📧 bastosa549@gmail.com
   - 📱 (71) 98263-3972

---

## ✅ TUDO FUNCIONANDO?

Se todos os testes passaram:

🎉 **PARABÉNS!**

O modo offline do XiquêGo está funcionando perfeitamente!

Agora você pode usar o app **EM QUALQUER LUGAR**, mesmo sem sinal!

---

## 💡 DICAS

1. **GPS demora um pouco:**
   - Primeiro uso pode levar 30-60 segundos
   - Depois fica mais rápido

2. **Sincronização automática:**
   - Pode levar 1-2 segundos após conexão voltar
   - É normal

3. **Dados salvos:**
   - Ficam no celular
   - Não ocupam muito espaço
   - São removidos após 7 dias (se sincronizados)

4. **Bateria:**
   - Modo offline NÃO gasta mais bateria
   - GPS que gasta, mas é necessário

---

## 🚀 CONCLUSÃO

O modo offline do XiquêGo foi feito especialmente para:

✅ **Povoados sem sinal**
✅ **Zona rural**
✅ **Áreas remotas**
✅ **Qualquer lugar de Xique-Xique**

**Pode usar tranquilo!** 📵🚀

---

© 2025 XiquêGo - O app que funciona onde você vai!

