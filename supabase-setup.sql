-- Criar tabela para armazenar as respostas da pesquisa
CREATE TABLE survey_responses (
    id BIGSERIAL PRIMARY KEY,
    responses JSONB NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para melhor performance nas consultas por data
CREATE INDEX idx_survey_responses_submitted_at ON survey_responses(submitted_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de qualquer usuário (para formulário público)
CREATE POLICY "Allow public insert" ON survey_responses
    FOR INSERT TO anon
    WITH CHECK (true);

-- Política para permitir leitura apenas para usuários autenticados (admin)
CREATE POLICY "Allow authenticated read" ON survey_responses
    FOR SELECT TO authenticated
    USING (true);