# Linkize Survey

Pesquisa interativa para coletar feedback sobre a ferramenta Linkize, com integração ao Supabase e notificações automáticas via WhatsApp e Email.

## 🚀 Funcionalidades

- ✅ Formulário responsivo com 21 perguntas
- ✅ Salvamento automático no Supabase
- ✅ Envio de WhatsApp via Twilio (Netlify Functions)
- ✅ Envio de Email via SMTP (Netlify Functions)  
- ✅ Conformidade com LGPD
- ✅ Interface em português
- ✅ Design moderno com Tailwind CSS

## 🛠️ Configuração

### 1. Supabase Setup

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o SQL para criar a tabela:

```sql
create table survey_responses (
  id bigint generated always as identity primary key,
  created_at timestamp with time zone default now(),
  nome_negocio text,
  tipo_atividade text,
  canais_venda text[],
  qtd_pessoas text,
  nivel_tecnologia text,
  forma_apresentacao text,
  principais_dificuldades text,
  frequencia_atualizacao text,
  perdeu_venda text,
  desejo_facilidade text,
  usa_whatsapp_business text,
  uso_whatsapp text,
  usou_catalogo_whatsapp text,
  motivo_catalogo_insuficiente text,
  interesse_linkize text,
  caracteristicas_preferidas text[],
  valor_justo text,
  interesse_teste_gratuito text,
  motivo_recomendacao text,
  quer_ser_avisado text,
  contato text
);
```

### 2. Netlify Deployment

1. Conecte o repositório ao Netlify
2. Configure as variáveis de ambiente:

**Para WhatsApp (Twilio):**
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token  
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

**Para Email (SMTP):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
```

**Supabase:**
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

##  Estrutura

```
├── src/
│   ├── App.vue              # Componente principal
│   ├── main.js             # Entry point
│   └── data/
│       └── questions.json   # Configuração das perguntas
├── .netlify/
│   └── functions/
│       ├── send-whatsapp.js # Function para WhatsApp
│       └── send-email.js    # Function para Email
└── netlify.toml           # Configuração Netlify
```

## 📱 Fluxo de Notificações

1. Usuário preenche formulário
2. Dados salvos no Supabase
3. Se `quer_ser_avisado === "Sim, quero participar"`:
   - Detecta se o contato é email ou telefone
   - Envia WhatsApp (se telefone) via Twilio
   - Envia Email (se email) via SMTP
4. Exibe confirmação de sucesso

## 🔒 LGPD Compliance

- Checkbox obrigatório de consentimento
- Dados coletados apenas com autorização
- Comunicações enviadas apenas para interessados
- Política de privacidade integrada

---

**Desenvolvido com ❤️ para a Linkize**
