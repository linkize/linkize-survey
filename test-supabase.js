// Teste simples de conexão com Supabase
// Execute este arquivo no console do navegador ou como script separado

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fkwoezmpvgzrxignmker.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrd29lem1wdmd6cnhpZ25ta2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1OTEyNzgsImV4cCI6MjA3NzE2NzI3OH0.XkG-yGoTMHHQzDZpK-k7q5Ms0A1mkcoWjGCDG4mKzns'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Teste de inserção
const testInsert = async () => {
  console.log('Testando inserção...')
  
  const testData = {
    nome_negocio: 'Teste de conexão',
    tipo_atividade: 'Produtos',
    canais_venda: ['WhatsApp', 'Instagram'],
    qtd_pessoas: 'Apenas eu',
    nivel_tecnologia: 'Tenho facilidade e gosto de aprender'
  }
  
  const { data, error } = await supabase
    .from('survey_responses')
    .insert([testData])
    .select()
  
  if (error) {
    console.error('Erro:', error)
  } else {
    console.log('Sucesso:', data)
  }
}

// Teste de leitura
const testSelect = async () => {
  console.log('Testando leitura...')
  
  const { data, error } = await supabase
    .from('survey_responses')
    .select('*')
    .limit(5)
  
  if (error) {
    console.error('Erro:', error)
  } else {
    console.log('Dados:', data)
  }
}

// Executar testes
testInsert()
testSelect()