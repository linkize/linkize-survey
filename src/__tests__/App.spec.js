import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

// Mock do módulo de perguntas
vi.mock('../data/questions.json', () => {
  const mockQuestions = [
    { id: 1, section: "Sobre o negócio", type: "text", label: "Qual é o nome do seu negócio?", placeholder: "Ex.: roupas, marmitas..." },
    { id: 2, type: "select", label: "Você trabalha com produtos, serviços ou ambos?", options: ["Produtos", "Serviços", "Ambos"] },
    { id: 3, type: "checkbox", label: "Por quais canais realiza suas vendas?", options: ["WhatsApp", "Instagram", "Loja física"] }
  ]
  
  return {
    default: mockQuestions
  }
})

describe('App.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(App)
  })

  describe('Renderização Inicial', () => {
    it('deve renderizar o título da pesquisa', () => {
      expect(wrapper.find('h1').text()).toContain('Pesquisa Linkize')
    })

    it('deve renderizar todas as perguntas', () => {
      expect(wrapper.findAll('label').length).toBeGreaterThanOrEqual(3)
    })

    it('deve renderizar o botão de envio desabilitado inicialmente', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.exists()).toBe(true)
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('deve renderizar o checkbox de consentimento LGPD', () => {
      const lgpdCheckbox = wrapper.find('#lgpd-consent')
      expect(lgpdCheckbox.exists()).toBe(true)
      expect(lgpdCheckbox.attributes('type')).toBe('checkbox')
    })
  })

  describe('Interação com Perguntas', () => {
    it('deve permitir preencher pergunta de texto', async () => {
      const textInput = wrapper.find('input[type="text"]')
      await textInput.setValue('Meu Negócio Teste')
      expect(textInput.element.value).toBe('Meu Negócio Teste')
    })

    it('deve permitir selecionar opção de radio', async () => {
      const radioInput = wrapper.find('input[type="radio"]')
      await radioInput.setChecked(true)
      expect(radioInput.element.checked).toBe(true)
    })

    it('deve permitir selecionar múltiplas opções de checkbox', async () => {
      const checkboxes = wrapper.findAll('input[type="checkbox"]')
      // Pula o primeiro que é o LGPD consent
      const questionCheckbox = checkboxes[1]
      await questionCheckbox.setChecked(true)
      expect(questionCheckbox.element.checked).toBe(true)
    })

    it('deve habilitar botão quando LGPD é aceito', async () => {
      const lgpdCheckbox = wrapper.find('#lgpd-consent')
      const submitButton = wrapper.find('button[type="submit"]')
      
      expect(submitButton.attributes('disabled')).toBeDefined()
      
      await lgpdCheckbox.setChecked(true)
      
      expect(submitButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Seções das Perguntas', () => {
    it('deve exibir cabeçalho da seção quando apropriado', () => {
      const sectionHeaders = wrapper.findAll('h3')
      expect(sectionHeaders.length).toBeGreaterThan(0)
      expect(sectionHeaders[0].text()).toBe('Sobre o negócio')
    })
  })

  describe('Validação do Formulário', () => {
    it('deve mostrar erro se tentar enviar sem respostas', async () => {
      const lgpdCheckbox = wrapper.find('#lgpd-consent')
      await lgpdCheckbox.setChecked(true)
      
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Por favor, responda pelo menos uma pergunta')
    })

    it('deve validar consentimento LGPD obrigatório', async () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })
  })

  describe('Estados da Aplicação', () => {
    it('deve mostrar estado de carregamento ao enviar', async () => {
      const lgpdCheckbox = wrapper.find('#lgpd-consent')
      const textInput = wrapper.find('input[type="text"]')
      
      await lgpdCheckbox.setChecked(true)
      await textInput.setValue('Teste')
      
      const submitButton = wrapper.find('button[type="submit"]')
      
      // Simular estado de submissão diretamente
      wrapper.vm.isSubmitting = true
      await wrapper.vm.$nextTick()
      
      expect(submitButton.text()).toContain('Enviando...')
    })

    it('deve mostrar mensagem de sucesso após envio', async () => {
      const lgpdCheckbox = wrapper.find('#lgpd-consent')
      const textInput = wrapper.find('input[type="text"]')
      
      await lgpdCheckbox.setChecked(true)
      await textInput.setValue('Teste')
      
      // Simular estado de sucesso diretamente
      wrapper.vm.submitted = true
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('Obrigado pelo seu feedback!')
    })

    it('deve permitir reset do formulário', async () => {
      // Simular estado de sucesso
      wrapper.vm.submitted = true
      await wrapper.vm.$nextTick()
      
      const resetButton = wrapper.find('button')
      await resetButton.trigger('click')
      
      expect(wrapper.vm.submitted).toBe(false)
    })
  })

  describe('Mapeamento de Dados', () => {
    it('deve ter mapeamento correto das perguntas', () => {
      expect(wrapper.vm.questionMapping[1]).toBe('nome_negocio')
      expect(wrapper.vm.questionMapping[2]).toBe('tipo_atividade')
      expect(wrapper.vm.questionMapping[21]).toBe('contato')
    })

    it('deve mapear respostas corretamente', async () => {
      // Simular preenchimento de algumas respostas diretamente
      wrapper.vm.answers[1] = 'Meu Negócio'
      wrapper.vm.answers[2] = 'Produtos'
      wrapper.vm.answers[20] = 'Sim, quero participar'
      wrapper.vm.answers[21] = 'test@test.com'
      
      await wrapper.vm.$nextTick()

      const surveyData = {}
      Object.keys(wrapper.vm.answers).forEach(questionId => {
        const columnName = wrapper.vm.questionMapping[questionId]
        if (columnName && wrapper.vm.answers[questionId]) {
          surveyData[columnName] = wrapper.vm.answers[questionId]
        }
      })

      expect(surveyData.nome_negocio).toBe('Meu Negócio')
      expect(surveyData.tipo_atividade).toBe('Produtos')
      expect(surveyData.quer_ser_avisado).toBe('Sim, quero participar')
      expect(surveyData.contato).toBe('test@test.com')
    })
  })

  describe('Detecção de Tipo de Contato', () => {
    it('deve detectar email corretamente', () => {
      expect(wrapper.vm.detectContactType('test@example.com')).toBe('email')
      expect(wrapper.vm.detectContactType('usuario.teste@dominio.com.br')).toBe('email')
    })

    it('deve detectar telefone corretamente', () => {
      expect(wrapper.vm.detectContactType('11999887766')).toBe('phone')
      expect(wrapper.vm.detectContactType('+5511999887766')).toBe('phone')
      expect(wrapper.vm.detectContactType('(11) 99988-7766')).toBe('phone')
    })

    it('deve retornar unknown para formatos inválidos', () => {
      expect(wrapper.vm.detectContactType('texto-invalido')).toBe('unknown')
      expect(wrapper.vm.detectContactType('123')).toBe('unknown')
    })
  })
})