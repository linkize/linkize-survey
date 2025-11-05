# 📧 Migração para Brevo (ex-Sendinblue)

## ✅ Concluído

### Remoções
- ❌ MailerSend SDK removido (`mailersend` package)
- ❌ Variáveis de ambiente do MailerSend removidas
- ❌ Arquivos de teste do MailerSend removidos

### Adições
- ✅ Brevo SDK instalado (`@getbrevo/brevo` package)
- ✅ Função de email atualizada para usar Brevo API
- ✅ Variáveis de ambiente configuradas para Brevo

## 🔧 Configuração Necessária

### 1. API Key do Brevo
Você precisa configurar a API key do Brevo no arquivo `.env`:

```env
BREVO_API_KEY=xkeysib-sua_api_key_completa_aqui
```

**Como obter a API key:**
1. Acesse [app.brevo.com](https://app.brevo.com)
2. Faça login na sua conta
3. Vá em **Account Settings** → **API Keys** 
4. Clique em **Generate a new API key**
5. Nomeie como "Linkize Survey" 
6. Copie a key completa (formato: `xkeysib-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-xxxxxxxx`)
7. Cole no arquivo `.env` substituindo `xkeysib-SUA_API_KEY_COMPLETA_AQUI`

### 2. Email Remetente
Configure o email remetente no `.env`:

```env
MAIL_FROM=seu-email@gmail.com
MAIL_FROM_NAME=Linkize
```

**Vantagem do Brevo:** 
- ✅ Aceita Gmail, Hotmail e outros provedores gratuitos
- ✅ Não requer verificação de domínio para começar
- ✅ 300 emails grátis por dia

## 🧪 Como Testar

1. Configure a API key no `.env`
2. Faça deploy no Netlify 
3. Teste o envio de email através da aplicação

## 🚀 Vantagens do Brevo

1. **Sem limitações de trial** - Conta gratuita permite enviar para qualquer email
2. **Plano gratuito generoso** - 300 emails/dia grátis
3. **Interface amigável** - Painel mais intuitivo
4. **Melhor deliverability** - Taxa de entrega superior
5. **Suporte em português** - Documentação e suporte em PT-BR

## 🔄 Próximos Passos

1. Configurar API key do Brevo
2. Configurar domínio de envio
3. Testar envio de email
4. Deploy da nova versão

## 📝 Alterações Técnicas

### Arquivo alterado:
- `.netlify/functions/send-email.js` - Migrado de MailerSend para Brevo API

### Dependências:
- Removido: `mailersend`
- ✅ **Nenhuma dependência adicional** - usando fetch nativo

### Implementação:
- Usando API REST do Brevo diretamente com fetch()
- Mais leve e confiável que SDKs
- Compatível com Netlify Functions