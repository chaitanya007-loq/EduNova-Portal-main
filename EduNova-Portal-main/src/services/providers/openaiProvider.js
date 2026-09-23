// OpenAI Provider Integration for Sage AI Tutor

export const callOpenAIAPI = async (prompt, systemInstruction = '', apiKey = '') => {
  const key = apiKey || process.env.REACT_APP_OPENAI_API_KEY;
  if (!key) {
    throw new Error('OpenAI API Key missing');
  }

  const model = process.env.REACT_APP_OPENAI_MODEL || 'gpt-4o-mini';
  const url = 'https://api.openai.com/v1/chat/completions';

  const messages = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API Error: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  if (data.choices && data.choices[0]?.message?.content) {
    return data.choices[0].message.content;
  }

  throw new Error('Invalid response structure from OpenAI API');
};
