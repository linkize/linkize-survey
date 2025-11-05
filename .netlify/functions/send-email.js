import { createTransport } from 'nodemailer'

export async function handler(event, context) {
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

    // Validate required environment variables
    const smtpHost = process.env.MAIL_HOST
    const smtpPort = process.env.MAIL_PORT
    const smtpUser = process.env.MAIL_USER
    const smtpPass = process.env.MAIL_PASS
    const fromEmail = process.env.MAIL_FROM

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromEmail) {
      console.error('Missing SMTP environment variables')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Service configuration error' })
      }
    }

    // Create transporter
    const transporter = createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    })

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

    // Send email
    await transporter.sendMail({
      from: `"Linkize" <${fromEmail}>`,
      to: email,
      subject: '🎉 Obrigado por participar da pesquisa Linkize!',
      text: textContent,
      html: htmlContent
    })

    console.log(`Email sent successfully to ${email}`)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully' 
      })
    }

  } catch (error) {
    console.error('Error sending email:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      })
    }
  }
}