# 📞 Contatos de Suporte - XiquêGo

## 📧 Informações de Contato

### Suporte Oficial

**Email:**
- 📧 bastosa549@gmail.com

**WhatsApp:**
- 📱 (71) 98263-3972
- 🌐 Link direto: https://wa.me/5571982633972

---

## 🔧 Onde os Contatos São Usados no App

### 1. Central de Ajuda (`app/help-center.tsx`)
- ✅ Botão de WhatsApp
- ✅ Botão de Email
- Ambos abrem diretamente os aplicativos nativos

### 2. README.md
- ✅ Seção de Suporte
- Informações para desenvolvedores e usuários

### 3. Documentação
- Referências em vários arquivos `.md`

---

## 📱 Funcionalidades de Contato no App

### WhatsApp
```typescript
// Abre WhatsApp com mensagem pré-definida
Linking.openURL('whatsapp://send?phone=5571982633972&text=Olá, preciso de ajuda com o XiquêGo!');
```

**Comportamento:**
- No celular: Abre o app WhatsApp
- Mensagem pré-preenchida: "Olá, preciso de ajuda com o XiquêGo!"
- Número: +55 71 98263-3972

### Email
```typescript
// Abre app de email
Linking.openURL('mailto:bastosa549@gmail.com');
```

**Comportamento:**
- Abre o app de email padrão do celular
- Destinatário já preenchido: bastosa549@gmail.com
- Usuário pode digitar assunto e mensagem

---

## 🎯 Como os Usuários Acessam

### Caminho 1: Menu → Central de Ajuda
```
1. Abrir app
2. Menu (ícone hambúrguer) 
3. Suporte > Central de Ajuda
4. Botões no topo:
   📱 WhatsApp | 📧 Email
```

### Caminho 2: Menu → Fale Conosco
```
1. Abrir app
2. Menu (ícone hambúrguer)
3. Suporte > Fale Conosco
4. Mesma tela da Central de Ajuda
```

---

## ✅ Status Atual

| Local | Status | Contato Atualizado |
|-------|--------|-------------------|
| `app/help-center.tsx` | ✅ Atualizado | Sim |
| `README.md` | ✅ Atualizado | Sim |
| Documentação | ✅ Atualizado | Sim |

---

## 🔄 Como Atualizar no Futuro

Se precisar mudar os contatos novamente:

### 1. Atualizar no Código
**Arquivo:** `XIQUEGO/app/help-center.tsx`

```typescript
// Linhas 89-95
const openWhatsApp = () => {
  Linking.openURL('whatsapp://send?phone=55XXXXXXXXXXX&text=Mensagem');
};

const openEmail = () => {
  Linking.openURL('mailto:novoemail@exemplo.com');
};
```

### 2. Atualizar na Documentação
**Arquivo:** `XIQUEGO/README.md`

```markdown
## 📞 Suporte

Para dúvidas ou sugestões:
- 📧 Email: novoemail@exemplo.com
- 📱 WhatsApp: (XX) XXXXX-XXXX
```

### 3. Atualizar Este Arquivo
Manter `CONTATO_SUPORTE.md` atualizado com as mudanças.

---

## 📊 Estatísticas de Uso (Futuro)

Quando tiver backend implementado, adicionar:
- Número de contatos via WhatsApp
- Número de emails enviados
- Horários de maior procura
- Tipos de dúvidas mais comuns

---

## 💡 Melhorias Futuras

### Automação
- [ ] Sistema de tickets
- [ ] Chatbot para dúvidas comuns
- [ ] Email automático de confirmação
- [ ] SLA de resposta

### Canais Adicionais
- [ ] Chat ao vivo no app
- [ ] Central telefônica
- [ ] Redes sociais (@xiquego)
- [ ] Formulário de contato no app

---

## 🔒 Privacidade

**Importante:** 
- Não compartilhe esses contatos publicamente em repositórios
- Mantenha em `.env` quando possível
- Use apenas para suporte oficial do XiquêGo

---

*Última atualização: Outubro 2024*
*Contatos verificados e funcionais*

