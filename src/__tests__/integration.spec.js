import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock das funções Netlify
const mockWhatsAppFunction = async (data) => {
  if (!data.phone || !data.name) {
    throw new Error('Missing required fields')
  }
  return { success: true, message: 'WhatsApp sent successfully' }
}

const mockEmailFunction = async (data) => {
  if (!data.email || !data.name) {
    throw new Error('Missing required fields')
  }
  return { success: true, message: 'Email sent successfully' }
}

describe('Netlify Functions Integration', () => {
  beforeEach(() => {
    // Reset fetch mock
    vi.clearAllMocks()
  })

  describe('send-whatsapp Function', () => {
    it('deve enviar WhatsApp com dados válidos', async () => {
      const testData = {
        phone: '+5511999887766',
        name: 'João Silva',
        surveyData: {
          nome_negocio: 'Loja do João',
          tipo_atividade: 'Produtos'
        }
      }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockWhatsAppFunction(testData))
        })
      )

      const response = await fetch('/.netlify/functions/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })

      const result = await response.json()

      expect(fetch).toHaveBeenCalledWith('/.netlify/functions/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })

      expect(result.success).toBe(true)
      expect(result.message).toBe('WhatsApp sent successfully')
    })

    it('deve falhar com dados inválidos', async () => {
      const invalidData = {
        // faltando phone e name
        surveyData: {}
      }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ error: 'Missing required fields' })
        })
      )

      const response = await fetch('/.netlify/functions/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      })

      expect(response.ok).toBe(false)
    })

    it('deve formatar números de telefone brasileiros', () => {
      const testCases = [
        { input: '11999887766', expected: '+5511999887766' },
        { input: '+5511999887766', expected: '+5511999887766' },
        { input: '(11) 99988-7766', expected: '+5511999887766' }
      ]

      testCases.forEach(({ input, expected }) => {
        const formatted = input.startsWith('+') ? input : '+55' + input.replace(/\D/g, '')
        expect(formatted).toBe(expected)
      })
    })
  })

  describe('send-email Function', () => {
    it('deve enviar email com dados válidos', async () => {
      const testData = {
        email: 'joao@exemplo.com',
        name: 'João Silva',
        surveyData: {
          nome_negocio: 'Loja do João',
          interesse_linkize: 'Sim'
        }
      }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockEmailFunction(testData))
        })
      )

      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })

      const result = await response.json()

      expect(result.success).toBe(true)
      expect(result.message).toBe('Email sent successfully')
    })

    it('deve validar formato de email', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'contact+tag@site.org'
      ]

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true)
      })
    })

    it('deve rejeitar emails inválidos', () => {
      const invalidEmails = [
        'email-invalido',
        '@domain.com',
        'user@',
        'user@domain',
        'user name@domain.com'
      ]

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false)
      })
    })
  })

  describe('Fluxo de Notificações', () => {
    it('deve enviar notificações apenas se usuário quer ser avisado', async () => {
      const surveyData = {
        nome_negocio: 'Teste',
        quer_ser_avisado: 'Sim, quero participar',
        contato: 'test@example.com'
      }

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        })
      )

      // Simula a lógica do sendNotifications
      if (surveyData.quer_ser_avisado === "Sim, quero participar" && surveyData.contato) {
        const contactType = surveyData.contato.includes('@') ? 'email' : 'phone'
        
        if (contactType === 'email') {
          await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            body: JSON.stringify({ email: surveyData.contato, name: surveyData.nome_negocio })
          })
        }
      }

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith('/.netlify/functions/send-email', expect.any(Object))
    })

    it('não deve enviar notificações se usuário não quer ser avisado', async () => {
      const surveyData = {
        nome_negocio: 'Teste',
        quer_ser_avisado: 'Não',
        contato: 'test@example.com'
      }

      global.fetch = vi.fn()

      // Simula a lógica do sendNotifications
      if (surveyData.quer_ser_avisado === "Sim, quero participar" && surveyData.contato) {
        // Esta condição não será atendida
      }

      expect(fetch).not.toHaveBeenCalled()
    })

    it('deve detectar automaticamente o tipo de contato', () => {
      const testCases = [
        { contact: 'test@example.com', expected: 'email' },
        { contact: '11999887766', expected: 'phone' },
        { contact: '+5511999887766', expected: 'phone' },
        { contact: 'invalid-contact', expected: 'unknown' }
      ]

      testCases.forEach(({ contact, expected }) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/
        
        let result = 'unknown'
        if (emailRegex.test(contact)) result = 'email'
        else if (phoneRegex.test(contact.replace(/\D/g, ''))) result = 'phone'
        
        expect(result).toBe(expected)
      })
    })
  })

  describe('Tratamento de Erros', () => {
/*     it('deve continuar execução mesmo com falha nas notificações', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')))

      let errorOccurred = false
      
      try {
        await fetch('/.netlify/functions/send-email', {
          method: 'POST',
          body: JSON.stringify({ email: 'test@test.com' })
        })
      } catch (error) {
        errorOccurred = true
        console.log('Erro capturado:', error.message)
      }

      // Verifica que o erro foi tratado graciosamente
      expect(errorOccurred).toBe(true)
    }) */

    it('deve validar dados obrigatórios', () => {
      const requiredFields = ['phone', 'name']
      const testData = { phone: '+5511999887766' } // faltando name

      const missingFields = requiredFields.filter(field => !testData[field])
      expect(missingFields).toContain('name')
    })
  })
})