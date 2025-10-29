-- Teste para verificar se a tabela existe e está funcionando
-- Execute estas queries no SQL Editor do Supabase

-- 1. Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'survey_responses'
ORDER BY ordinal_position;

-- 2. Verificar políticas RLS (se existirem)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'survey_responses';

-- 3. Teste de inserção manual (opcional) - usando nova estrutura
INSERT INTO survey_responses (
  nome_negocio, 
  tipo_atividade, 
  canais_venda,
  qtd_pessoas,
  nivel_tecnologia
) VALUES (
  'Teste de Negócio',
  'Produtos',
  ARRAY['WhatsApp', 'Instagram'],
  'Apenas eu',
  'Tenho facilidade e gosto de aprender'
);

-- 4. Verificar dados inseridos
SELECT * FROM survey_responses ORDER BY created_at DESC LIMIT 5;

-- 5. Contar total de respostas
SELECT COUNT(*) as total_respostas FROM survey_responses;

-- 6. Análise por tipo de atividade
SELECT 
  tipo_atividade,
  COUNT(*) as quantidade
FROM survey_responses 
WHERE tipo_atividade IS NOT NULL
GROUP BY tipo_atividade
ORDER BY quantidade DESC;