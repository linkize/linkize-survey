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

## 📊 Analytics

Use as queries em `analytics-queries.sql` para analisar os dados coletados:

```sql
-- Resumo executivo
SELECT 
    COUNT(*) as total_respostas,
    COUNT(CASE WHEN interesse_linkize = 'Sim' THEN 1 END) as interessados,
    COUNT(CASE WHEN quer_ser_avisado = 'Sim, quero participar' THEN 1 END) as quer_testar
FROM survey_responses;
```

## 🔧 Estrutura

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
├── *.sql                   # Scripts SQL para análise
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

## 📈 Métricas

O sistema coleta automaticamente:
- Taxa de conversão por pergunta
- Canais de venda preferidos  
- Nível de interesse na ferramenta
- Valor disposto a pagar
- Contatos para beta testing

---

**Desenvolvido com ❤️ para a Linkize**

A responsive Vue 3 + Vite landing page with a dynamic survey form for collecting user feedback.

## Features

- 🎨 Beautiful gradient UI using Linkize brand colors (#0077B6 → #00E3A3)
- 📱 Fully responsive design with Tailwind CSS
- 📝 Dynamic survey form with questions loaded from JSON
- 💾 Supabase integration for storing responses
- ✅ Success and error states
- 🚀 Optimized for Netlify deployment

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Supabase (optional):
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key
   - Create a `survey_responses` table in your Supabase project with the following structure:
     ```sql
     create table survey_responses (
       id bigserial primary key,
       responses jsonb not null,
       submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
     );
     ```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Deployment

This project is configured for Netlify deployment with `netlify.toml`. Simply connect your repository to Netlify and it will automatically deploy.

## Survey Questions

Questions are defined in `src/data/questions.json` and support multiple question types:
- Radio buttons (single choice)
- Checkboxes (multiple choice)
- Text areas (free text)

## Tech Stack

- Vue 3
- Vite
- Tailwind CSS
- Supabase (for data storage)
- Netlify (for hosting)
