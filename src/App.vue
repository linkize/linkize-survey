<template>
  <div class="min-h-screen bg-gradient-to-br from-linkize-blue to-linkize-green py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">
          Pesquisa Linkize
        </h1>
        <p class="text-xl text-white/90">
          Ajude-nos a entender suas necessidades de negócio
        </p>
      </div>

      <!-- Survey Form -->
      <div class="bg-white rounded-lg shadow-xl p-8">
        <form v-if="!submitted" @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Dynamic Questions -->
          <div v-for="question in questions" :key="question.id" class="space-y-3">
            <!-- Section Header -->
            <div v-if="question.section && (!questions[questions.indexOf(question) - 1] || questions[questions.indexOf(question) - 1].section !== question.section)" class="pt-6 pb-2 border-b border-gray-200">
              <h3 class="text-xl font-semibold text-gray-800">{{ question.section }}</h3>
            </div>

            <label class="block text-lg font-medium text-gray-900">
              {{ question.label }}
              <span v-if="question.type === 'checkbox'" class="text-sm text-gray-500 font-normal ml-2">
                (Selecione todas as opções que se aplicam)
              </span>
            </label>

            <!-- Select Question -->
            <div v-if="question.type === 'select'" class="space-y-2">
              <div v-for="(option, index) in question.options" :key="index" class="flex items-center">
                <input
                  :id="`q${question.id}-opt${index}`"
                  type="radio"
                  :name="`question-${question.id}`"
                  :value="option"
                  v-model="answers[question.id]"
                  class="h-4 w-4 text-linkize-blue focus:ring-linkize-blue border-gray-300"
                />
                <label :for="`q${question.id}-opt${index}`" class="ml-3 text-gray-700">
                  {{ option }}
                </label>
              </div>
            </div>

            <!-- Checkbox Question -->
            <div v-else-if="question.type === 'checkbox'" class="space-y-2">
              <div v-for="(option, index) in question.options" :key="index" class="flex items-center">
                <input
                  :id="`q${question.id}-opt${index}`"
                  type="checkbox"
                  :value="option"
                  v-model="answers[question.id]"
                  class="h-4 w-4 text-linkize-blue focus:ring-linkize-blue border-gray-300 rounded"
                />
                <label :for="`q${question.id}-opt${index}`" class="ml-3 text-gray-700">
                  {{ option }}
                </label>
              </div>
            </div>

            <!-- Text Question -->
            <div v-else-if="question.type === 'text'">
              <input
                v-model="answers[question.id]"
                :placeholder="question.placeholder || ''"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkize-blue focus:border-transparent"
              />
            </div>

            <!-- Textarea Question -->
            <div v-else-if="question.type === 'textarea'">
              <textarea
                v-model="answers[question.id]"
                :placeholder="question.placeholder || 'Digite sua resposta aqui...'"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkize-blue focus:border-transparent resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-6">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-gradient-to-r from-linkize-blue to-linkize-green text-white py-3 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {{ isSubmitting ? 'Enviando...' : 'Enviar Pesquisa' }}
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-700 text-center">
              {{ errorMessage }}
            </p>
          </div>
        </form>

        <!-- Success Message -->
        <div v-else class="text-center py-8">
          <div class="mb-4">
            <svg class="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Obrigado pelo seu feedback!
          </h2>
          <p class="text-gray-600 mb-6">
            Sua resposta foi registrada com sucesso.
          </p>
          <button
            @click="resetForm"
            class="bg-gradient-to-r from-linkize-blue to-linkize-green text-white py-2 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          >
            Enviar Outra Resposta
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 text-white/80 text-sm">
        <p>Powered by Linkize</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'
import questions from './data/questions.json'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key disponível:', !!supabaseAnonKey)

let supabase = null
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log('Cliente Supabase inicializado com sucesso')
} else {
  console.error('Credenciais do Supabase não encontradas')
}

// Component state
const answers = ref({})
const isSubmitting = ref(false)
const submitted = ref(false)
const errorMessage = ref('')

// Helper function to initialize answers
const initializeAnswers = () => {
  questions.forEach(q => {
    if (q.type === 'checkbox') {
      answers.value[q.id] = []
    } else {
      answers.value[q.id] = ''
    }
  })
}

// Initialize answers on mount
onMounted(() => {
  initializeAnswers()
})

// Handle form submission
const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // Validate that at least some questions are answered
    const hasAnswers = Object.values(answers.value).some(answer => {
      if (Array.isArray(answer)) {
        return answer.length > 0
      }
      return answer !== ''
    })

    if (!hasAnswers) {
      errorMessage.value = 'Por favor, responda pelo menos uma pergunta antes de enviar.'
      isSubmitting.value = false
      return
    }

    // Save to Supabase if configured
    if (supabase) {
      console.log('Enviando dados para Supabase:', answers.value)
      
      // Mapear as respostas para as colunas corretas da tabela
      const surveyData = {
        // 👤 1. Sobre o negócio
        nome_negocio: answers.value[1] || null,
        tipo_atividade: answers.value[2] || null,
        canais_venda: Array.isArray(answers.value[3]) ? answers.value[3] : null,
        qtd_pessoas: answers.value[4] || null,
        nivel_tecnologia: answers.value[5] || null,
        
        // 💬 2. Rotina e desafios
        forma_apresentacao: answers.value[6] || null,
        principais_dificuldades: answers.value[7] || null,
        frequencia_atualizacao: answers.value[8] || null,
        perdeu_venda: answers.value[9] || null,
        desejo_facilidade: answers.value[10] || null,
        
        // 📱 3. Uso do WhatsApp
        usa_whatsapp_business: answers.value[11] || null,
        uso_whatsapp: answers.value[12] || null,
        usou_catalogo_whatsapp: answers.value[13] || null,
        motivo_catalogo_insuficiente: answers.value[14] || null,
        
        // 💡 4. Ideia da Linkize
        interesse_linkize: answers.value[15] || null,
        caracteristicas_preferidas: Array.isArray(answers.value[16]) ? answers.value[16] : null,
        valor_justo: answers.value[17] || null,
        interesse_teste_gratuito: answers.value[18] || null,
        motivo_recomendacao: answers.value[19] || null,
        
        // 📞 5. Contato
        quer_ser_avisado: answers.value[20] || null,
        contato: answers.value[21] || null
      }
      
      const { data, error } = await supabase
        .from('survey_responses')
        .insert([surveyData])
        .select()

      if (error) {
        console.error('Erro do Supabase:', error)
        errorMessage.value = `Falha ao enviar a pesquisa: ${error.message}`
        isSubmitting.value = false
        return
      }
      
      console.log('Dados salvos com sucesso:', data)
    } else {
      console.error('Supabase não configurado - URL ou Key faltando')
      errorMessage.value = 'Configuração do banco de dados não encontrada.'
      isSubmitting.value = false
      return
    }

    // Show success state
    submitted.value = true
  } catch (error) {
    console.error('Error submitting survey:', error)
    errorMessage.value = 'Ocorreu um erro inesperado. Tente novamente.'
  } finally {
    isSubmitting.value = false
  }
}

// Reset form
const resetForm = () => {
  initializeAnswers()
  submitted.value = false
  errorMessage.value = ''
}
</script>
