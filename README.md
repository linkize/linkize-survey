# Linkize Survey

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
