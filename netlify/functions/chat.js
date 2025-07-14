const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { message, history = [] } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          content: `I received: "${message}". However, the Anthropic API key is not configured. Please set ANTHROPIC_API_KEY in your Netlify environment variables.`,
          mock: true
        })
      };
    }

    // Initialize Anthropic
    const anthropic = new Anthropic({ apiKey });

    // Build messages
    const messages = [
      ...history.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Call Anthropic
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2048,
      temperature: 0.7,
      system: 'You are a helpful AI assistant for FlexOS, a Vue 3/Nuxt application builder. Keep responses concise and helpful.',
      messages
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        content: content.text,
        usage: response.usage
      })
    };

  } catch (error) {
    console.error('Chat error:', error);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        content: `Error: ${error.message || 'Something went wrong'}`,
        error: true
      })
    };
  }
};