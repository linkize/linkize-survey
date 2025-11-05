exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { email, name, surveyData } = JSON.parse(event.body)

    console.log('Processing email request for:', email)

    // Validate required environment variables
    const brevoApiKey = process.env.BREVO_API_KEY
    const fromEmail = process.env.MAIL_FROM
    const fromName = process.env.MAIL_FROM_NAME || "Linkize"

    console.log('Environment check:', {
      hasApiKey: !!brevoApiKey,
      fromEmail: fromEmail,
      fromName: fromName
    })

    if (!brevoApiKey) {
      console.error('Missing Brevo API key')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Brevo API key not configured' })
      }
    }

    if (!fromEmail) {
      console.error('Missing MAIL_FROM environment variable')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'MAIL_FROM not configured' })
      }
    }

    // Create email content
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .highlight { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Obrigado, ${name}!</h1>
          <p>Sua participação na pesquisa Linkize foi registrada com sucesso</p>
        </div>
        <div class="content">
          <p>Olá, <strong>${name}</strong>!</p>
          
          <p>Ficamos muito felizes em saber que você tem interesse em testar nossa ferramenta!</p>
          
          <div class="highlight">
            <h3>🚀 O que vem por aí:</h3>
            <ul>
              <li>Acesso exclusivo à versão beta da Linkize</li>
              <li>Suporte dedicado durante o período de testes</li>
              <li>Suas sugestões ajudarão a moldar o produto final</li>
            </ul>
          </div>
          
          <p>📱 Estamos desenvolvendo uma solução que vai revolucionar a forma como você apresenta seus produtos e serviços pelo WhatsApp.</p>
          
          <p>Em breve nossa equipe entrará em contato para te dar todas as instruções de acesso.</p>
          
          <p>Se tiver alguma dúvida, pode responder este email que ficaremos felizes em ajudar!</p>
          
          <p>Muito obrigado pelo seu tempo e confiança.</p>
          
          <p><strong>Equipe Linkize 💙</strong></p>
        </div>
      </div>
    </body>
    </html>
    `

    const textContent = `
    🎉 Obrigado, ${name}!

    Ficamos muito felizes em saber que você tem interesse em testar nossa ferramenta!

    🚀 O que vem por aí:
    - Acesso exclusivo à versão beta da Linkize
    - Suporte dedicado durante o período de testes  
    - Suas sugestões ajudarão a moldar o produto final

    📱 Estamos desenvolvendo uma solução que vai revolucionar a forma como você apresenta seus produtos e serviços pelo WhatsApp.

    Em breve nossa equipe entrará em contato para te dar todas as instruções de acesso.

    Se tiver alguma dúvida, pode responder este email que ficaremos felizes em ajudar!

    Muito obrigado pelo seu tempo e confiança.

    Equipe Linkize 💙
    `

    // Create email data for Brevo API
    const emailData = {
      sender: { name: fromName, email: fromEmail },
      to: [{ email: email, name: name }],
      replyTo: { name: fromName, email: fromEmail },
      subject: '🎉 Obrigado por participar da pesquisa Linkize!',
      htmlContent: htmlContent,
      textContent: textContent
    }

    // Send email via Brevo API
    console.log('Attempting to send email via Brevo API...')
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify(emailData)
    })

    const responseData = await response.json()

    if (!response.ok) {
      throw new Error(`Brevo API Error: ${response.status} - ${JSON.stringify(responseData)}`)
    }

    console.log(`Email sent successfully to ${email}`, responseData)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        messageId: responseData?.messageId || 'unknown'
      })
    }

  } catch (error) {
    console.error('Error sending email:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data || error.response
    })
    
    // More specific error handling for Brevo
    let errorMessage = 'Failed to send email'
    let errorDetails = error.message
    
    if (error.message?.includes('401')) {
      errorMessage = 'Invalid API key'
      errorDetails = 'The Brevo API key is invalid or missing permissions.'
    } else if (error.message?.includes('400')) {
      errorMessage = 'Bad request'
      errorDetails = 'Check email format and sender configuration.'
    } else if (error.message?.includes('Brevo API Error')) {
      errorMessage = 'Brevo API Error'
      errorDetails = error.message
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      })
    }
  }
}