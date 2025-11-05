// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to fill survey form
Cypress.Commands.add('fillSurveyForm', (formData = {}) => {
  // Pergunta 1 - Nome do negócio
  if (formData.nomeNegocio) {
    cy.get('input[type="text"]').first().type(formData.nomeNegocio)
  }

  // Pergunta 2 - Tipo de atividade  
  if (formData.tipoAtividade) {
    cy.contains('label', 'Você trabalha com produtos')
      .parent()
      .find('input[type="radio"]')
      .check(formData.tipoAtividade, { force: true })
  }

  // Pergunta 3 - Canais de venda
  if (formData.canaisVenda && Array.isArray(formData.canaisVenda)) {
    formData.canaisVenda.forEach(canal => {
      cy.contains('label', 'Por quais canais realiza')
        .parent()
        .contains('label', canal)
        .find('input[type="checkbox"]')
        .check({ force: true })
    })
  }

  // LGPD Consent (sempre necessário)
  cy.get('#lgpd-consent').check({ force: true })
})

// Custom command to mock Supabase
Cypress.Commands.add('mockSupabase', () => {
  cy.intercept('POST', '**/rest/v1/survey_responses', {
    statusCode: 201,
    body: [{ id: 1, created_at: new Date().toISOString() }]
  }).as('submitSurvey')
})

// Custom command to mock Netlify functions
Cypress.Commands.add('mockNetlifyFunctions', () => {
  cy.intercept('POST', '/.netlify/functions/send-whatsapp', {
    statusCode: 200,
    body: { success: true, message: 'WhatsApp sent successfully' }
  }).as('sendWhatsApp')

  cy.intercept('POST', '/.netlify/functions/send-email', {
    statusCode: 200,  
    body: { success: true, message: 'Email sent successfully' }
  }).as('sendEmail')
})

// Custom command to wait for all requests
Cypress.Commands.add('waitForSubmission', () => {
  cy.wait('@submitSurvey')
})

// Custom command to check responsive design
Cypress.Commands.add('checkResponsive', () => {
  const viewports = [
    { width: 375, height: 667 }, // iPhone SE
    { width: 768, height: 1024 }, // iPad
    { width: 1280, height: 720 }, // Desktop
  ]

  viewports.forEach(viewport => {
    cy.viewport(viewport.width, viewport.height)
    cy.get('h1').should('be.visible')
    cy.get('form').should('be.visible')
  })
})