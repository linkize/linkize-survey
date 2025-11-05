import { describe, it, expect, vi } from 'vitest'

// Funções utilitárias extraídas do App.vue para testagem
const questionMapping = {
  1: 'nome_negocio',
  2: 'tipo_atividade', 
  3: 'canais_venda',
  4: 'qtd_pessoas',
  5: 'nivel_tecnologia',
  6: 'forma_apresentacao',
  7: 'principais_dificuldades',
  8: 'frequencia_atualizacao',
  9: 'perdeu_venda',
  10: 'desejo_facilidade',
  11: 'usa_whatsapp_business',
  12: 'uso_whatsapp',
  13: 'usou_catalogo_whatsapp',
  14: 'motivo_catalogo_insuficiente',
  15: 'interesse_linkize',
  16: 'caracteristicas_preferidas',
  17: 'valor_justo',
  18: 'interesse_teste_gratuito',
  19: 'motivo_recomendacao',
  20: 'quer_ser_avisado',
  21: 'contato'
}

const detectContactType = (contact) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^[\+]?[1-9][\d]{3,14}$/
  
  if (emailRegex.test(contact)) return 'email'
  if (phoneRegex.test(contact.replace(/\D/g, ''))) return 'phone'
  return 'unknown'
}

describe('Funções Utilitárias', () => {
  describe('questionMapping', () => {
    it('deve ter mapeamento completo para todas as 21 perguntas', () => {
      expect(Object.keys(questionMapping)).toHaveLength(21)
      
      for (let i = 1; i <= 21; i++) {
        expect(questionMapping[i]).toBeDefined()
        expect(typeof questionMapping[i]).toBe('string')
      }
    })

    it('deve ter nomes de colunas válidos', () => {
      const columnNames = Object.values(questionMapping)
      
      // Verificar que não há duplicatas
      const uniqueColumns = new Set(columnNames)
      expect(uniqueColumns.size).toBe(columnNames.length)
      
      // Verificar formato snake_case
      columnNames.forEach(column => {
        expect(column).toMatch(/^[a-z_]+$/)
      })
    })

    it('deve mapear seções corretamente', () => {
      // Sobre o negócio (1-5)
      expect(questionMapping[1]).toBe('nome_negocio')
      expect(questionMapping[2]).toBe('tipo_atividade')
      expect(questionMapping[5]).toBe('nivel_tecnologia')
      
      // WhatsApp (11-14)
      expect(questionMapping[11]).toBe('usa_whatsapp_business')
      expect(questionMapping[14]).toBe('motivo_catalogo_insuficiente')
      
      // Contato (20-21)
      expect(questionMapping[20]).toBe('quer_ser_avisado')
      expect(questionMapping[21]).toBe('contato')
    })
  })

  describe('detectContactType', () => {
    describe('Detecção de Email', () => {
      const validEmails = [
        'test@example.com',
        'usuario.teste@dominio.com.br',
        'admin@site.org',
        'contato+tag@empresa.net',
        'nome123@provedor.co.uk'
      ]

      validEmails.forEach(email => {
        it(`deve detectar "${email}" como email`, () => {
          expect(detectContactType(email)).toBe('email')
        })
      })

      const invalidEmails = [
        'email-sem-arroba.com',
        '@dominio.com',
        'usuario@',
        'email.com',
        'user name@domain.com'
      ]

      invalidEmails.forEach(email => {
        it(`deve rejeitar "${email}" como email inválido`, () => {
          expect(detectContactType(email)).not.toBe('email')
        })
      })
    })

    describe('Detecção de Telefone', () => {
      const validPhones = [
        '11999887766',
        '+5511999887766',
        '5511999887766',
        '21987654321',
        '+5521987654321'
      ]

      validPhones.forEach(phone => {
        it(`deve detectar "${phone}" como telefone`, () => {
          expect(detectContactType(phone)).toBe('phone')
        })
      })

      // Testa normalização de formato
      it('deve normalizar formatos de telefone com caracteres especiais', () => {
        expect(detectContactType('(11) 99988-7766')).toBe('phone')
        expect(detectContactType('11 99988-7766')).toBe('phone')
        expect(detectContactType('+55 (11) 9.9988-7766')).toBe('phone')
      })

      const invalidPhones = [
        '123', // muito curto
        '12345678901234567890', // muito longo
        '000000000' // começa com 0
      ]

      invalidPhones.forEach(phone => {
        it(`deve rejeitar "${phone}" como telefone inválido`, () => {
          expect(detectContactType(phone)).not.toBe('phone')
        })
      })
    })

    describe('Casos Especiais', () => {
      it('deve retornar unknown para strings vazias', () => {
        expect(detectContactType('')).toBe('unknown')
        expect(detectContactType('   ')).toBe('unknown')
      })

      it('deve retornar unknown para formatos mistos', () => {
        expect(detectContactType('invalid@text')).toBe('unknown')
        expect(detectContactType('11999887766@domain.com')).toBe('email') // email prevalece
      })

      it('deve retornar unknown para caracteres especiais apenas', () => {
        expect(detectContactType('!@#$%^&*()')).toBe('unknown')
        expect(detectContactType('-------')).toBe('unknown')
      })
    })
  })

  describe('Mapeamento de Dados', () => {
    it('deve mapear respostas simples corretamente', () => {
      const answers = {
        1: 'Minha Empresa',
        2: 'Produtos',
        5: 'Tenho facilidade'
      }

      const surveyData = {}
      Object.keys(answers).forEach(questionId => {
        const columnName = questionMapping[questionId]
        if (columnName && answers[questionId]) {
          surveyData[columnName] = answers[questionId]
        }
      })

      expect(surveyData).toEqual({
        nome_negocio: 'Minha Empresa',
        tipo_atividade: 'Produtos',
        nivel_tecnologia: 'Tenho facilidade'
      })
    })

    it('deve mapear arrays corretamente', () => {
      const answers = {
        3: ['WhatsApp', 'Instagram'],
        16: ['Facilidade de uso', 'Visual bonito']
      }

      const surveyData = {}
      Object.keys(answers).forEach(questionId => {
        const columnName = questionMapping[questionId]
        if (columnName && answers[questionId]) {
          surveyData[columnName] = answers[questionId]
        }
      })

      expect(surveyData).toEqual({
        canais_venda: ['WhatsApp', 'Instagram'],
        caracteristicas_preferidas: ['Facilidade de uso', 'Visual bonito']
      })
    })

    it('deve ignorar respostas vazias', () => {
      const answers = {
        1: 'Valor válido',
        2: '',
        3: null,
        4: undefined,
        5: []
      }

      const surveyData = {}
      Object.keys(answers).forEach(questionId => {
        const columnName = questionMapping[questionId]
        const answer = answers[questionId]
        if (columnName && answer && answer !== '' && answer !== null && answer !== undefined && (!Array.isArray(answer) || answer.length > 0)) {
          surveyData[columnName] = answer
        }
      })

      expect(surveyData).toEqual({
        nome_negocio: 'Valor válido'
      })
    })
  })
})