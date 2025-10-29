const twilio = require('twilio')

exports.handler = async (event, context) => {
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
    const { phone, name, surveyData } = JSON.parse(event.body)

    // Validate required environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM

    if (!accountSid || !authToken || !whatsappFrom) {
      console.error('Missing Twilio environment variables')
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Service configuration error' })
      }
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken)

    // Format phone number for WhatsApp
    const formattedPhone = phone.startsWith('+') ? phone : '+55' + phone.replace(/\D/g, '')

    // Create personalized message
    const message = `🎉 Olá, ${name}!

Obrigado por participar da nossa pesquisa sobre a Linkize!

Ficamos muito felizes em saber que você tem interesse em testar nossa ferramenta. 

📱 Estamos desenvolvendo uma solução que vai revolucionar a forma como você apresenta seus produtos e serviços pelo WhatsApp.

🚀 Em breve entraremos em contato para te dar acesso exclusivo à versão beta!

Muito obrigado pelo seu tempo e confiança.

Equipe Linkize 💙`

    // Send WhatsApp message via Twilio
    await client.messages.create({
      from: whatsappFrom,
      to: `whatsapp:${formattedPhone}`,
      body: message
    })

    console.log(`WhatsApp sent successfully to ${formattedPhone}`)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'WhatsApp sent successfully' 
      })
    }

  } catch (error) {
    console.error('Error sending WhatsApp:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send WhatsApp',
        details: error.message 
      })
    }
  }
}