// Gemini 2.5 Flash Provider Integration for Sage AI
// Connects securely via REACT_APP_GEMINI_API_KEY with JSON schema enforcement

export const callGeminiAPI = async (prompt, systemInstruction = '', apiKey = '', isJsonMode = false) => {
  const key = apiKey || process.env.REACT_APP_GEMINI_API_KEY;
  if (!key) {
    throw new Error('Gemini API key missing in environment variables (REACT_APP_GEMINI_API_KEY)');
  }

  const model = process.env.REACT_APP_AI_MODEL || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const contents = [
    {
      role: 'user',
      parts: [
        { text: systemInstruction ? `[SYSTEM CONTEXT]\n${systemInstruction}\n\n[USER REQUEST]\n${prompt}` : prompt }
      ]
    }
  ];

  const payload = {
    contents,
    generationConfig: {
      temperature: 0.3,
      topK: 40,
      topP: 0.95,
      responseMimeType: isJsonMode ? 'application/json' : 'text/plain'
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API HTTP ${response.status}: ${errText}`);
  }

  const data = await response.json();
  if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
    const rawText = data.candidates[0].content.parts[0].text.trim();
    
    if (isJsonMode) {
      // Strip markdown code fences if Gemini enclosed JSON in ```json ... ```
      const cleanedJson = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
      try {
        return JSON.parse(cleanedJson);
      } catch (err) {
        throw new Error(`Failed to parse structured JSON from Gemini output: ${err.message}`);
      }
    }

    return rawText;
  }

  throw new Error('Invalid or empty response candidate from Gemini 2.5 Flash API');
};
