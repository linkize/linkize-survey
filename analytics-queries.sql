-- 📊 QUERIES DE ANÁLISE DA PESQUISA LINKIZE

-- 1. Visualizar todas as respostas
SELECT * FROM survey_responses ORDER BY created_at DESC;

-- 2. Contar total de respostas
SELECT COUNT(*) as total_respostas FROM survey_responses;

-- 3. Análise por tipo de atividade
SELECT 
    tipo_atividade,
    COUNT(*) as quantidade,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM survey_responses), 2) as percentual
FROM survey_responses 
WHERE tipo_atividade IS NOT NULL
GROUP BY tipo_atividade
ORDER BY quantidade DESC;

-- 4. Análise dos canais de venda mais usados
SELECT 
    UNNEST(canais_venda) as canal,
    COUNT(*) as quantidade
FROM survey_responses 
WHERE canais_venda IS NOT NULL
GROUP BY canal
ORDER BY quantidade DESC;

-- 5. Nível de tecnologia dos respondentes
SELECT 
    nivel_tecnologia,
    COUNT(*) as quantidade
FROM survey_responses 
WHERE nivel_tecnologia IS NOT NULL
GROUP BY nivel_tecnologia
ORDER BY quantidade DESC;

-- 6. Uso do WhatsApp Business
SELECT 
    usa_whatsapp_business,
    COUNT(*) as quantidade
FROM survey_responses 
WHERE usa_whatsapp_business IS NOT NULL
GROUP BY usa_whatsapp_business;

-- 7. Interesse na ferramenta Linkize
SELECT 
    interesse_linkize,
    COUNT(*) as quantidade
FROM survey_responses 
WHERE interesse_linkize IS NOT NULL
GROUP BY interesse_linkize;

-- 8. Características mais desejadas
SELECT 
    UNNEST(caracteristicas_preferidas) as caracteristica,
    COUNT(*) as quantidade
FROM survey_responses 
WHERE caracteristicas_preferidas IS NOT NULL
GROUP BY caracteristica
ORDER BY quantidade DESC;

-- 9. Valor considerado justo
SELECT 
    valor_justo,
    COUNT(*) as quantidade
FROM survey_responses 
WHERE valor_justo IS NOT NULL
GROUP BY valor_justo
ORDER BY 
    CASE valor_justo
        WHEN 'Prefiro gratuita' THEN 1
        WHEN 'Até R$15' THEN 2
        WHEN 'Até R$30' THEN 3
        WHEN 'Até R$50' THEN 4
        WHEN 'Mais de R$50 se valer a pena' THEN 5
    END;

-- 10. Interesse em participar do teste
SELECT 
    interesse_teste_gratuito,
    COUNT(*) as quantidade
FROM survey_responses 
WHERE interesse_teste_gratuito IS NOT NULL
GROUP BY interesse_teste_gratuito;

-- 11. Contatos para avisar sobre o teste
SELECT COUNT(*) as total_contatos
FROM survey_responses 
WHERE quer_ser_avisado = 'Sim, quero participar' 
AND contato IS NOT NULL 
AND contato != '';

-- 12. Resumo executivo
SELECT 
    COUNT(*) as total_respostas,
    COUNT(CASE WHEN tipo_atividade = 'Produtos' THEN 1 END) as produtos,
    COUNT(CASE WHEN tipo_atividade = 'Serviços' THEN 1 END) as servicos,
    COUNT(CASE WHEN tipo_atividade = 'Ambos' THEN 1 END) as ambos,
    COUNT(CASE WHEN interesse_linkize = 'Sim' THEN 1 END) as interessados,
    COUNT(CASE WHEN quer_ser_avisado = 'Sim, quero participar' THEN 1 END) as quer_testar
FROM survey_responses;