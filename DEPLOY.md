# 🚀 Deploy no Netlify - Guia Rápido

## 📋 **Checklist Pré-Deploy**

✅ Build funcionando (`npm run build`)  
✅ Netlify.toml configurado  
✅ Functions criadas em `.netlify/functions/`  
✅ Supabase configurado  
✅ Testes passando (58/58)

## 🌐 **Passos para Deploy**

### **1. Conectar ao Netlify**
1. Acesse [netlify.com](https://netlify.com)
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Conecte ao GitHub e selecione o repositório `linkize-survey`

### **2. Configurar Build Settings**
```
Build command: npm run build
Publish directory: dist
Functions directory: .netlify/functions
```

### **3. Configurar Environment Variables**
No Netlify Dashboard, vá em **Site settings** → **Environment variables** e adicione:

#### **Supabase (já funcionando):**
```
VITE_SUPABASE_URL=https://fkwoezmpvgzrxignmker.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Email (Mailtrap - já configurado no .env):**
```
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=c462168102d56a
MAIL_PASS=31070e8944e92a
MAIL_FROM=linkizeapp@gmail.com
```

#### **WhatsApp (Twilio - opcional):**
```
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token  
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### **4. Deploy**
1. Clique em **"Deploy site"**
2. Aguarde o build completar
3. Site estará disponível em uma URL como: `https://amazing-name-123456.netlify.app`

## 🧪 **Como Testar Após Deploy**

### **1. Teste Básico**
1. Acesse a URL do site deployado
2. Preencha o formulário da pesquisa
3. Marque "Sim, quero participar" na pergunta 20
4. Coloque seu email na pergunta 21
5. Aceite os termos LGPD
6. Clique em "Enviar Pesquisa"

### **2. Verificar Funcionamento**
- ✅ Dados salvos no Supabase
- ✅ Email enviado (verificar caixa de entrada)
- ✅ Mensagem de sucesso exibida
- ✅ Functions executadas sem erro 404

### **3. Monitorar Functions**
No Netlify Dashboard:
- **Functions** → Ver logs das execuções
- **Analytics** → Ver métricas de uso
- **Logs** → Debugar erros se houver

## 🔧 **Troubleshooting**

### **Erro 500 nas Functions:**
- Verificar environment variables
- Checar logs no dashboard Netlify
- Validar credenciais SMTP/Twilio

### **Build falhando:**
- Verificar se `npm run build` funciona localmente
- Checar se todas dependências estão no package.json

### **Functions não encontradas:**
- Confirmar que estão em `.netlify/functions/`
- Verificar se `netlify.toml` tem `functions = ".netlify/functions"`

## 🎯 **Deploy Automático**

Uma vez configurado, o CI/CD do GitHub Actions fará deploy automático a cada push na branch `main`.

## 📊 **Próximos Passos Após Deploy**

1. **Testar todas as funcionalidades**
2. **Verificar emails sendo enviados**
3. **Confirmar dados no Supabase**  
4. **Compartilhar URL para testes reais**
5. **Monitorar métricas no Netlify**

---

**🚀 Pronto para deploy? Basta seguir os passos acima!**