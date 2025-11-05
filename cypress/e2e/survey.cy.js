describe('Linkize Survey - E2E Tests', () => {
  beforeEach(() => {
    cy.mockSupabase()
    cy.mockNetlifyFunctions()
    cy.visit('/')
  })

  describe('Carregamento da Página', () => {
    it('deve carregar a página principal corretamente', () => {
      cy.get('h1').should('contain', 'Pesquisa Linkize')
      cy.get('p').should('contain', 'Ajude-nos a entender suas necessidades')
    })

    it('deve exibir todas as seções de perguntas', () => {
      cy.get('h3').should('have.length.at.least', 4)
      cy.contains('h3', 'Sobre o negócio').should('be.visible')
      cy.contains('h3', 'Rotina e desafios').should('be.visible')
      cy.contains('h3', 'WhatsApp').should('be.visible')
      cy.contains('h3', 'Ideia da Linkize').should('be.visible')
    })

    it('deve exibir 21 perguntas no total', () => {
      // Conta labels que não são do LGPD
      cy.get('label').not('#lgpd-consent').should('have.length', 21)
    })
  })

  describe('Interação com Formulário', () => {
    it('deve permitir preencher pergunta de texto', () => {
      cy.get('input[type="text"]').first().type('Minha Loja Online')
      cy.get('input[type="text"]').first().should('have.value', 'Minha Loja Online')
    })

    it('deve permitir selecionar opções de radio', () => {
      cy.contains('Produtos').click()
      cy.contains('Produtos').prev('input').should('be.checked')
    })

    it('deve permitir selecionar múltiplas opções de checkbox', () => {
      cy.contains('WhatsApp').click()
      cy.contains('Instagram').click()
      
      cy.contains('WhatsApp').prev('input').should('be.checked')
      cy.contains('Instagram').prev('input').should('be.checked')
    })

    it('deve exibir placeholders nas perguntas de texto', () => {
      cy.get('input[type="text"]').first()
        .should('have.attr', 'placeholder')
        .and('include', 'Ex.:')
    })
  })

  describe('Validação do Formulário', () => {
    it('deve manter botão desabilitado sem consentimento LGPD', () => {
      cy.get('button[type="submit"]').should('be.disabled')
    })

    it('deve habilitar botão após consentimento LGPD', () => {
      cy.get('#lgpd-consent').check({ force: true })
      cy.get('button[type="submit"]').should('not.be.disabled')
    })

    it('deve mostrar erro ao enviar formulário vazio', () => {
      cy.get('#lgpd-consent').check({ force: true })
      cy.get('button[type="submit"]').click()
      
      cy.contains('Por favor, responda pelo menos uma pergunta').should('be.visible')
    })

    it('deve exibir link da política de privacidade', () => {
      cy.contains('Política de Privacidade')
        .should('have.attr', 'href')
    })
  })

  describe('Envio do Formulário', () => {
    it('deve enviar formulário com dados válidos', () => {
      cy.fillSurveyForm({
        nomeNegocio: 'Loja Teste',
        tipoAtividade: 'Produtos',
        canaisVenda: ['WhatsApp', 'Instagram']
      })
      
      cy.get('button[type="submit"]').click()
      cy.waitForSubmission()
      
      cy.contains('Obrigado pelo seu feedback!').should('be.visible')
    })

    it('deve exibir estado de carregamento durante envio', () => {
      cy.fillSurveyForm({
        nomeNegocio: 'Loja Teste'
      })
      
      cy.get('button[type="submit"]').click()
      cy.get('button[type="submit"]').should('contain', 'Enviando...')
    })

    it('deve permitir reset do formulário após sucesso', () => {
      cy.fillSurveyForm({
        nomeNegocio: 'Loja Teste'
      })
      
      cy.get('button[type="submit"]').click()
      cy.waitForSubmission()
      
      cy.contains('Enviar Outra Resposta').click()
      cy.get('form').should('be.visible')
      cy.get('input[type="text"]').first().should('have.value', '')
    })
  })

  describe('Notificações Automáticas', () => {
    it('deve enviar email para contatos de email', () => {
      // Preenche pergunta 20 (quer ser avisado) e 21 (contato)
      cy.contains('Deseja ser avisado').parent().contains('Sim, quero participar').click()
      cy.get('input[type="text"]').last().type('test@example.com')
      
      cy.fillSurveyForm({
        nomeNegocio: 'Loja Email Test'
      })
      
      cy.get('button[type="submit"]').click()
      cy.wait('@sendEmail')
      cy.contains('Obrigado pelo seu feedback!').should('be.visible')
    })

    it('deve enviar WhatsApp para números de telefone', () => {
      cy.contains('Deseja ser avisado').parent().contains('Sim, quero participar').click()
      cy.get('input[type="text"]').last().type('11999887766')
      
      cy.fillSurveyForm({
        nomeNegocio: 'Loja WhatsApp Test'
      })
      
      cy.get('button[type="submit"]').click()
      cy.wait('@sendWhatsApp')
      cy.contains('Obrigado pelo seu feedback!').should('be.visible')
    })

    it('não deve enviar notificações se usuário não quer ser avisado', () => {
      cy.contains('Deseja ser avisado').parent().contains('Não').click()
      cy.get('input[type="text"]').last().type('test@example.com')
      
      cy.fillSurveyForm({
        nomeNegocio: 'Loja Sem Notificação'
      })
      
      cy.get('button[type="submit"]').click()
      cy.waitForSubmission()
      
      // Verifica que as functions não foram chamadas
      cy.get('@sendEmail.all').should('have.length', 0)
      cy.get('@sendWhatsApp.all').should('have.length', 0)
    })
  })

  describe('Design Responsivo', () => {
    it('deve funcionar em dispositivos móveis', () => {
      cy.viewport('iphone-x')
      
      cy.get('h1').should('be.visible')
      cy.get('form').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })

    it('deve funcionar em tablets', () => {
      cy.viewport('ipad-2')
      
      cy.get('h1').should('be.visible')
      cy.get('form').should('be.visible')
      cy.fillSurveyForm({ nomeNegocio: 'Teste Tablet' })
    })

    it('deve manter layout em diferentes resoluções', () => {
      cy.checkResponsive()
    })
  })

  describe('Acessibilidade', () => {
    it('deve ter labels associados aos inputs', () => {
      cy.get('input[type="text"]').each($input => {
        const id = $input.attr('id')
        if (id) {
          cy.get(`label[for="${id}"]`).should('exist')
        }
      })
    })

    it('deve permitir navegação por teclado', () => {
      cy.get('body').tab()
      cy.focused().should('match', 'input, button, a, [tabindex]')
    })

    it('deve ter texto alternativo em elementos visuais', () => {
      cy.get('svg').should('have.attr', 'aria-label').or('have.attr', 'role')
    })
  })

  describe('Performance', () => {
    it('deve carregar em menos de 3 segundos', () => {
      const start = performance.now()
      
      cy.visit('/').then(() => {
        const loadTime = performance.now() - start
        expect(loadTime).to.be.lessThan(3000)
      })
    })

    it('deve ter elementos visuais carregados', () => {
      cy.get('h1').should('be.visible')
      cy.get('form').should('be.visible')
      cy.get('button').should('be.visible')
    })
  })

  describe('Tratamento de Erros', () => {
    it('deve mostrar erro se Supabase falhar', () => {
      cy.intercept('POST', '**/rest/v1/survey_responses', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      }).as('submitSurveyError')
      
      cy.fillSurveyForm({
        nomeNegocio: 'Teste Erro'
      })
      
      cy.get('button[type="submit"]').click()
      cy.wait('@submitSurveyError')
      
      cy.contains('Falha ao enviar a pesquisa').should('be.visible')
    })

    it('deve continuar mesmo com falha nas notificações', () => {
      cy.intercept('POST', '/.netlify/functions/send-email', {
        statusCode: 500,
        body: { error: 'Email service unavailable' }
      }).as('sendEmailError')
      
      cy.contains('Deseja ser avisado').parent().contains('Sim, quero participar').click()
      cy.get('input[type="text"]').last().type('test@example.com')
      
      cy.fillSurveyForm({
        nomeNegocio: 'Teste Erro Notificação'
      })
      
      cy.get('button[type="submit"]').click()
      cy.waitForSubmission()
      
      // Deve mostrar sucesso mesmo com falha na notificação
      cy.contains('Obrigado pelo seu feedback!').should('be.visible')
    })
  })
})